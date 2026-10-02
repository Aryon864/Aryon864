"""Post any due entries from posts.yaml to X via the v2 API.

Meant to run on a timer (see .github/workflows/x-scheduler.yml). Each run
posts every entry whose `at` time has passed and that hasn't been posted yet,
then writes the result back into posts.yaml so it's never sent twice.

Credentials (OAuth 1.0a user context, from developer.x.com) come from env:
    X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET

Usage:
    python post_scheduled.py            # post what's due
    python post_scheduled.py --dry-run  # show what would be posted
    python post_scheduled.py --check    # validate posts.yaml only
"""

import argparse
import os
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import yaml

POSTS_FILE = Path(__file__).with_name("posts.yaml")
TWEETS_URL = "https://api.x.com/2/tweets"
MAX_CHARS = 280
# Posts overdue by more than this are marked skipped instead of sent, so a
# paused or broken scheduler doesn't dump a backlog all at once.
MAX_LATE = timedelta(hours=float(os.environ.get("X_MAX_LATE_HOURS", "6")))


def load(path):
    raw = path.read_text(encoding="utf-8")
    # Keep the leading comment block so rewriting the file doesn't drop it.
    header = []
    for line in raw.splitlines():
        if line.startswith("#") or not line.strip():
            header.append(line)
        else:
            break
    data = yaml.safe_load(raw) or {}
    return "\n".join(header), data.get("posts") or []


def save(path, header, posts):
    body = yaml.safe_dump(
        {"posts": posts}, sort_keys=False, allow_unicode=True, width=1000
    )
    path.write_text((header + "\n" if header else "") + body, encoding="utf-8")


def parse_at(value):
    dt = value if isinstance(value, datetime) else datetime.fromisoformat(str(value))
    if dt.tzinfo is None:
        raise ValueError(f"`at: {value}` needs a timezone offset, e.g. -04:00 or Z")
    return dt


def weighted_len(text):
    """Length as X counts it: most CJK, emoji and symbols count as 2."""
    n = 0
    for c in text:
        o = ord(c)
        n += 1 if o <= 4351 or 8192 <= o <= 8205 or 8208 <= o <= 8223 or 8242 <= o <= 8247 else 2
    return n


def texts_of(post):
    if "thread" in post:
        return [str(t) for t in post["thread"]]
    return [str(post["text"])]


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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()

    header, posts = load(POSTS_FILE)
    errors = validate(posts)
    if errors:
        sys.exit("posts.yaml has problems:\n  " + "\n  ".join(errors))
    if args.check:
        print(f"posts.yaml OK ({len(posts)} entries)")
        return

    now = datetime.now(timezone.utc)
    due = [p for p in posts if "status" not in p and parse_at(p["at"]) <= now]
    if not due:
        print("Nothing due.")
        return

    session = None if args.dry_run else client()
    failed = False
    for post in due:
        texts = texts_of(post)
        if now - parse_at(post["at"]) > MAX_LATE:
            print(f"Skipping (more than {MAX_LATE} late): {texts[0][:60]!r}")
            post["status"] = "skipped-late"
            continue
        if args.dry_run:
            for t in texts:
                print(f"[dry-run] would post: {t!r}")
            continue
        ids = list(post.get("ids") or [])  # resume a half-sent thread
        try:
            for t in texts[len(ids):]:
                ids.append(send(session, t, reply_to=ids[-1] if ids else None))
                print(f"Posted {ids[-1]}: {t[:60]!r}")
            post["status"] = "posted"
            post["posted_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
        except Exception as e:  # keep going; record what we have and retry next run
            print(f"Failed: {e}", file=sys.stderr)
            failed = True
        if ids:
            post["ids"] = ids

    if not args.dry_run:
        save(POSTS_FILE, header, posts)
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
