"""Post scheduled entries from posts.yaml to X via the v2 API.

posts.yaml is written by people; state.json is written only by this script and
records what has been posted, so the two never conflict.

GitHub's own cron is best-effort and can skip runs for hours, so in --daemon
mode this script waits for posts itself: it sleeps until the next post is due,
posts it, re-reads posts.yaml from git every couple of minutes to pick up new
entries, and before the job's time limit runs out it re-dispatches the
workflow so the next run carries on. The cron schedule is only a watchdog that
restarts the chain if it ever stops.

Credentials (OAuth 1.0a user context, from developer.x.com) come from env:
    X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET

Usage:
    python post_scheduled.py            # post what's due now, then exit
    python post_scheduled.py --daemon   # keep waiting for upcoming posts (CI)
    python post_scheduled.py --dry-run  # show what would be posted now
    python post_scheduled.py --check    # validate posts.yaml only
    python post_scheduled.py --list     # show every post and its status
"""

import argparse
import hashlib
import json
import os
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
POSTS_FILE = HERE / "posts.yaml"
STATE_FILE = HERE / "state.json"
TWEETS_URL = "https://api.x.com/2/tweets"
MAX_CHARS = 280


def env_float(name, default):
    return float(os.environ.get(name, default))


# Posts overdue by more than this are skipped instead of sent, so an outage
# doesn't dump a stale backlog.
MAX_LATE = timedelta(hours=env_float("X_MAX_LATE_HOURS", 6))
# Minimum spacing between separate entries, so posts that became due together
# (e.g. after an outage) go out spread apart rather than back to back.
MIN_GAP = timedelta(minutes=env_float("X_MIN_GAP_MINUTES", 20))
# A post that fails this many times is marked failed and left alone.
MAX_ATTEMPTS = int(env_float("X_MAX_ATTEMPTS", 5))
# Daemon tuning: how often to re-read posts.yaml, how long one job may run
# (GitHub-hosted jobs stop at 6h), and how far ahead it's worth waiting.
POLL = timedelta(minutes=env_float("X_POLL_MINUTES", 2))
RUN_FOR = timedelta(minutes=env_float("X_RUN_MINUTES", 330))
LOOKAHEAD = timedelta(hours=env_float("X_LOOKAHEAD_HOURS", 48))


def now_utc():
    return datetime.now(timezone.utc)


# ---------------------------------------------------------------- loading


def load_posts(path=POSTS_FILE):
    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    return data.get("posts") or []


def load_state(path=STATE_FILE):
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8") or "{}")


def save_state(state, path=STATE_FILE):
    path.write_text(json.dumps(state, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def parse_at(value):
    dt = value if isinstance(value, datetime) else datetime.fromisoformat(str(value))
    if dt.tzinfo is None:
        raise ValueError(f"`at: {value}` needs a timezone offset, e.g. +05:30 or Z")
    return dt.astimezone(timezone.utc)


def texts_of(post):
    if "thread" in post:
        return [str(t) for t in post["thread"]]
    return [str(post["text"])]


def key_of(post):
    """Stable id for an entry, from its time and text."""
    raw = json.dumps([parse_at(post["at"]).isoformat(), texts_of(post)], ensure_ascii=False)
    return hashlib.sha256(raw.encode()).hexdigest()[:16]


def weighted_len(text):
    """Length as X counts it: most CJK, emoji and symbols count as 2."""
    n = 0
    for c in text:
        o = ord(c)
        n += 1 if o <= 4351 or 8192 <= o <= 8205 or 8208 <= o <= 8223 or 8242 <= o <= 8247 else 2
    return n


def validate(posts):
    errors = []
    for i, post in enumerate(posts, 1):
        where = f"post #{i}"
        if not isinstance(post, dict):
            errors.append(f"{where}: must be a mapping")
            continue
        try:
            parse_at(post.get("at"))
        except (TypeError, ValueError) as e:
            errors.append(f"{where}: {e}")
        if ("text" in post) == ("thread" in post):
            errors.append(f"{where}: needs exactly one of `text` or `thread`")
            continue
        texts = texts_of(post)
        if not texts or not all(t.strip() for t in texts):
            errors.append(f"{where}: empty post text")
        for t in texts:
            if weighted_len(t) > MAX_CHARS:
                errors.append(f"{where}: {weighted_len(t)} chars (max {MAX_CHARS}): {t[:40]}...")
    return errors


# --------------------------------------------------------------- planning


def done(entry):
    return bool(entry) and entry.get("status") in ("posted", "skipped-late", "failed")


def last_posted_at(state):
    times = [datetime.fromisoformat(e["posted_at"]) for e in state.values() if e.get("posted_at")]
    return max(times, default=None)


def pending(posts, state):
    """Unfinished entries as (key, post, scheduled_at), earliest first."""
    out = []
    for post in posts:
        key = key_of(post)
        if not done(state.get(key)):
            out.append((key, post, parse_at(post["at"])))
    return sorted(out, key=lambda item: item[2])


def next_action(posts, state, now):
    """Return (when, key, post) for the next entry to handle, or None.

    `when` is the scheduled time pushed back to respect MIN_GAP after the
    previous post; a half-sent thread resumes immediately.
    """
    items = pending(posts, state)
    if not items:
        return None
    key, post, at = items[0]
    if state.get(key, {}).get("ids"):
        return now, key, post
    last = last_posted_at(state)
    when = max(at, last + MIN_GAP) if last else at
    return when, key, post


# ---------------------------------------------------------------- posting


def client():
    from requests_oauthlib import OAuth1Session

    keys = ["X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_TOKEN_SECRET"]
    missing = [k for k in keys if not os.environ.get(k)]
    if missing:
        sys.exit(f"Missing credentials: {', '.join(missing)}")
    return OAuth1Session(*(os.environ[k] for k in keys))


def send(session, text, reply_to=None):
    payload = {"text": text}
    if reply_to:
        payload["reply"] = {"in_reply_to_tweet_id": reply_to}
    resp = session.post(TWEETS_URL, json=payload, timeout=30)
    if resp.status_code != 201:
        raise RuntimeError(f"X API {resp.status_code}: {resp.text}")
    return resp.json()["data"]["id"]


def handle(key, post, state, session, now, send=send):
    """Post (or skip) one entry, updating state. Returns False on failure."""
    texts = texts_of(post)
    entry = state.setdefault(key, {"preview": texts[0][:60]})
    at = parse_at(post["at"])
    if not entry.get("ids") and now - at > MAX_LATE:
        print(f"Skipping, more than {MAX_LATE} late: {texts[0][:60]!r}")
        entry.update(status="skipped-late", at=at.isoformat())
        return True
    ids = entry.setdefault("ids", [])
    try:
        for t in texts[len(ids):]:
            ids.append(send(session, t, reply_to=ids[-1] if ids else None))
            print(f"Posted https://x.com/i/status/{ids[-1]}: {t[:60]!r}")
    except Exception as e:  # keep what was sent; the rest is retried next time
        entry["attempts"] = entry.get("attempts", 0) + 1
        entry["error"] = str(e)[:300]
        print(f"Failed (attempt {entry['attempts']}/{MAX_ATTEMPTS}): {e}", file=sys.stderr)
        if entry["attempts"] >= MAX_ATTEMPTS:
            entry.update(status="failed", at=at.isoformat())
        return False
    entry.pop("error", None)
    entry.update(status="posted", at=at.isoformat(),
                 posted_at=now_utc().isoformat(timespec="seconds"))
    return True


# -------------------------------------------------------------------- git


def git(*args, check=True):
    return subprocess.run(["git", *args], cwd=HERE, check=check,
                          capture_output=True, text=True)


def sync_from_remote():
    """Pull new posts.yaml edits; never fatal (keeps the last good copy)."""
    r = git("pull", "--rebase", "--quiet", check=False)
    if r.returncode:
        print(f"git pull failed, using local copy: {r.stderr.strip()}", file=sys.stderr)
        git("rebase", "--abort", check=False)


def save_and_push(state, message):
    """Commit state.json and push. The in-memory state is authoritative (only
    this script writes the file), so on a rejected push just move onto the
    latest remote and commit again."""
    for attempt in range(5):
        save_state(state)
        git("add", STATE_FILE.name)
        if git("diff", "--cached", "--quiet", check=False).returncode == 0:
            return
        git("commit", "-q", "-m", message)
        if git("push", "-q", check=False).returncode == 0:
            return
        git("fetch", "-q", check=False)
        git("reset", "-q", "--hard", "@{u}", check=False)
        time.sleep(2 * (attempt + 1))
    print("Could not push state.json after retries", file=sys.stderr)


def dispatch_next_run():
    """Start a fresh workflow run to continue after this job ends."""
    import requests

    repo, token = os.environ.get("GITHUB_REPOSITORY"), os.environ.get("GITHUB_TOKEN")
    workflow = os.environ.get("X_WORKFLOW_FILE", "x-scheduler.yml")
    ref = os.environ.get("GITHUB_REF_NAME", "main")
    if not (repo and token):
        print("No GITHUB_TOKEN; relying on the cron watchdog to continue.")
        return
    resp = requests.post(
        f"https://api.github.com/repos/{repo}/actions/workflows/{workflow}/dispatches",
        headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"},
        json={"ref": ref}, timeout=30)
    print(f"Dispatched next run: HTTP {resp.status_code}")


# ------------------------------------------------------------------- modes


def run_once(session, dry_run=False):
    posts, state = load_posts(), load_state()
    failed = False
    while True:
        now = now_utc()
        nxt = next_action(posts, state, now)
        if not nxt or nxt[0] > now:
            break
        _, key, post = nxt
        if dry_run:
            for t in texts_of(post):
                print(f"[dry-run] would post: {t!r}")
            state[key] = {"status": "posted", "posted_at": now.isoformat()}
            continue
        if not handle(key, post, state, session, now):
            failed = True
            break
    if not dry_run:
        save_state(state)
    return not failed


def run_daemon(session, send=send):
    """Returns False if any post failed during this run."""
    deadline = now_utc() + RUN_FOR
    all_ok = True
    while True:
        sync_from_remote()
        posts, state = load_posts(), load_state()
        now = now_utc()
        if errors := validate(posts):
            print("posts.yaml has problems; fix them and push:\n  " + "\n  ".join(errors))
            return False
        nxt = next_action(posts, state, now)
        if nxt and nxt[0] <= now:
            _, key, post = nxt
            ok = handle(key, post, state, session, now, send=send)
            save_and_push(state, "x-scheduler: record posted entries [skip ci]")
            all_ok &= ok
            if ok:
                continue
            nxt = (now + POLL, None, None)  # back off before retrying

        now = now_utc()
        if nxt is None or nxt[0] - now > LOOKAHEAD:
            print("Nothing due within the lookahead window; exiting (cron will check back).")
            return all_ok
        if now + POLL >= deadline:
            dispatch_next_run()
            return all_ok
        wake = min(nxt[0], now + POLL, deadline)
        print(f"Next post due {nxt[0]:%Y-%m-%d %H:%M} UTC; sleeping until {wake:%H:%M:%S}", flush=True)
        time.sleep(max(1, (wake - now).total_seconds()))


def list_posts():
    posts, state = load_posts(), load_state()
    for post in sorted(posts, key=lambda p: parse_at(p["at"])):
        entry = state.get(key_of(post), {})
        ist = parse_at(post["at"]).astimezone(timezone(timedelta(hours=5, minutes=30)))
        status = entry.get("status", "scheduled")
        link = f" https://x.com/i/status/{entry['ids'][0]}" if entry.get("ids") else ""
        print(f"{ist:%a %d %b %H:%M} IST | {status:12} | {texts_of(post)[0][:50]!r}{link}")


def main():
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--check", action="store_true")
    mode.add_argument("--dry-run", action="store_true")
    mode.add_argument("--daemon", action="store_true")
    mode.add_argument("--list", action="store_true")
    args = parser.parse_args()

    errors = validate(load_posts())
    if errors:
        sys.exit("posts.yaml has problems:\n  " + "\n  ".join(errors))
    if args.check:
        print(f"posts.yaml OK ({len(load_posts())} entries)")
    elif args.list:
        list_posts()
    elif args.dry_run:
        run_once(None, dry_run=True)
    elif args.daemon:
        if not run_daemon(client()):
            sys.exit(1)
    elif not run_once(client()):
        sys.exit(1)


if __name__ == "__main__":
    main()
