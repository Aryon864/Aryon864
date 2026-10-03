# X post scheduler

Posts to @aryonmotions on X at scheduled times, using the X API and GitHub
Actions. Nothing has to run on your computer.

## How it works

- **`posts.yaml`**: the schedule. People (or Claude) add posts here.
- **`state.json`**: what has been posted, with links. Only the scheduler writes it.
- **`.github/workflows/x-scheduler.yml`**: runs the scheduler on GitHub.
  - A job on `main` waits for each post's time, posts it, and records it in
    `state.json`.
  - Every 2 minutes it re-reads `posts.yaml`, so new posts are picked up
    without restarting anything.
  - Before GitHub's 6-hour job limit, it starts a fresh run to carry on.
  - GitHub's cron runs twice an hour as a watchdog, restarting the chain if it
    ever stops. Timing never depends on cron, because GitHub can skip cron runs
    for hours.
  - When nothing is due in the next 48 hours, the job exits. The watchdog or
    your next push starts it again.
- **Safety rules:**
  - Posts more than **6 hours** late are skipped instead of sent.
  - Separate posts go out at least **20 minutes** apart, so a backlog doesn't
    land all at once.
  - A failed post is retried every 2 minutes, up to **5 attempts**.
  - A half-sent thread resumes where it stopped, without posting duplicates.

## Adding posts

Edit `posts.yaml` on `main` (on GitHub: open the file → ✏️ → **Commit changes**):

```yaml
posts:
  - at: 2026-10-05T10:00:00+05:30      # +05:30 = IST
    text: Your post here

  - at: 2026-10-06T19:30:00+05:30
    thread:
      - First post of the thread 🧵
      - Second post
```

Use `|-` for text with line breaks; the existing entries show the format.
To post right away, use a time that has already passed (within 6 hours).

Rules:
- 280 characters max per post, with emoji counting as 2.
- Don't edit an entry after it has posted, or it will be treated as a new post.
  Delete posted entries instead if the file gets long.
- If the file has a mistake, the run fails with the reason and nothing posts
  until it's fixed.

## Checking on it

- **Actions tab → X scheduled posts:** the running job's log shows the next
  post time, and every post with its link. The **Show schedule** step lists all
  posts and their status.
- **`state.json`:** a record of every post, including links and any error.
- **Run it now:** Actions → X scheduled posts → **Run workflow**.
- **Account stats:** Actions → X account report → **Run workflow**. It reads
  up to 100 posts, which costs about $0.50.

## Setup (already done)

1. An X developer app with **Read and write** permissions, and an Access
   Token generated after setting that.
2. Repo secrets `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN` and
   `X_ACCESS_TOKEN_SECRET`.
3. Credits on the X API pay-per-use plan. Each text post costs about $0.015,
   and each post with a link about $0.20.

## Local commands

```sh
pip install -r requirements.txt
python post_scheduled.py --check     # validate posts.yaml
python post_scheduled.py --list      # schedule and status
python -m unittest -v                # tests
```

## Settings

Set these as `env:` in the workflow's "Post on schedule" step:

| Variable | Default | Meaning |
|---|---|---|
| `X_MAX_LATE_HOURS` | 6 | Skip posts later than this |
| `X_MIN_GAP_MINUTES` | 20 | Minimum spacing between separate posts |
| `X_MAX_ATTEMPTS` | 5 | Give up on a post after this many failures |
| `X_POLL_MINUTES` | 2 | How often the job re-reads `posts.yaml` |
| `X_LOOKAHEAD_HOURS` | 48 | Exit if nothing is due within this window |
