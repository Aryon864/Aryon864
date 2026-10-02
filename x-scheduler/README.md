# X post scheduler

Schedules posts to X (Twitter) through the X API. A GitHub Actions workflow
(`.github/workflows/x-scheduler.yml`) runs every 15 minutes, posts anything in
`posts.yaml` whose time has passed, and commits the result back so nothing is
posted twice. No server needed.

## One-time setup

1. **Get API keys.** At <https://developer.x.com>, create a project and app.
   - Under *User authentication settings*, set app permissions to **Read and write**.
   - Under *Keys and tokens*, copy the **API Key and Secret**, then generate an
     **Access Token and Secret**. Generate the token *after* setting Read and
     write, or it will be read-only.
   - Posting needs an API plan that allows `POST /2/tweets`. Check your plan's
     monthly post limit.
2. **Add repo secrets.** Go to GitHub → repo *Settings → Secrets and variables → Actions*,
   and add `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN` and `X_ACCESS_TOKEN_SECRET`.
3. **Merge to the default branch.** GitHub only runs scheduled workflows from
   the default branch. On other branches the workflow only validates `posts.yaml`.

## Scheduling a post

Add an entry to `posts.yaml` and push:

```yaml
posts:
  - at: 2026-10-05T09:00:00-04:00   # timezone offset is required
    text: Something new is coming from YN Studios.

  - at: 2026-10-06T12:30:00-04:00
    thread:
      - How we rebuilt our site 🧵
      - Step 1 ...
```

After posting, the scheduler adds `status: posted`, `posted_at` and `ids`
(the post IDs) to the entry.

- **Late posts:** a post more than 6 hours overdue is marked
  `status: skipped-late` instead of being sent. To change the limit, set the
  `X_MAX_LATE_HOURS` env var in the workflow.
- **Failures:** a failed post (or the rest of a half-sent thread) is retried
  on the next run.
- **Timing:** GitHub can delay scheduled runs by a few minutes, so expect
  posts within about 15–20 minutes of `at`.
- **Run it now:** start it from the *Actions* tab → *X scheduled posts* → *Run workflow*.
- **Preview locally:** `pip install -r requirements.txt && python post_scheduled.py --dry-run`

Rewriting the file keeps the comment block at the top, but drops comments
placed between entries.
