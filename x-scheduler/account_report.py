"""Print a snapshot of the account: profile stats and recent posts with metrics.

Reads ~100 posts (about $0.50 of X API credit at pay-per-use rates).
Uses the same credentials as post_scheduled.py.
"""

import os
import sys
from datetime import datetime

from requests_oauthlib import OAuth1Session

API = "https://api.x.com/2"
MAX_POSTS = int(os.environ.get("X_REPORT_POSTS", "100"))


def get(session, path, **params):
    resp = session.get(f"{API}{path}", params=params, timeout=30)
    if resp.status_code != 200:
        sys.exit(f"X API {resp.status_code} on {path}: {resp.text}")
    return resp.json()


def main():
    keys = ["X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_TOKEN_SECRET"]
    session = OAuth1Session(*(os.environ[k] for k in keys))

    me = get(session, "/users/me",
             **{"user.fields": "created_at,description,public_metrics,location,url,verified"})["data"]
    m = me["public_metrics"]
    print(f"@{me['username']} ({me['name']}) joined {me['created_at'][:10]}")
    print(f"Bio: {me.get('description', '')!r}")
    print(f"Followers {m['followers_count']} | Following {m['following_count']} | "
          f"Posts {m['tweet_count']} | Likes given {m.get('like_count', '?')}")
    print()

    posts = get(session, f"/users/{me['id']}/tweets",
                max_results=min(max(MAX_POSTS, 5), 100),
                **{"tweet.fields": "created_at,public_metrics,referenced_tweets,attachments",
                   "expansions": "attachments.media_keys",
                   "media.fields": "type"}).get("data", [])

    print(f"{len(posts)} recent posts (newest first):")
    print("date (IST)       | kind  | views | likes | replies | reposts | quotes | bookmarks | text")
    for p in posts:
        pm = p["public_metrics"]
        refs = [r["type"] for r in p.get("referenced_tweets", [])]
        kind = refs[0][:5] if refs else ("media" if p.get("attachments") else "post")
        when = datetime.fromisoformat(p["created_at"].replace("Z", "+00:00"))
        ist = when.astimezone(__import__("zoneinfo").ZoneInfo("Asia/Kolkata"))
        text = p["text"].replace("\n", " ")[:90]
        print(f"{ist:%Y-%m-%d %H:%M} | {kind:5} | {pm.get('impression_count', 0):5} | "
              f"{pm['like_count']:5} | {pm['reply_count']:7} | {pm['retweet_count']:7} | "
              f"{pm['quote_count']:6} | {pm.get('bookmark_count', 0):9} | {text}")


if __name__ == "__main__":
    main()
