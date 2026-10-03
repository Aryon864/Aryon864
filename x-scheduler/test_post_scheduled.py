"""Tests for post_scheduled.py. Run: python -m unittest -v (from x-scheduler/)."""

import unittest
from datetime import datetime, timedelta, timezone
from unittest import mock

import post_scheduled as ps

T0 = datetime(2026, 10, 3, 12, 0, tzinfo=timezone.utc)


def post(minutes, text="hello", thread=None):
    at = (T0 + timedelta(minutes=minutes)).isoformat()
    return {"at": at, "thread": thread} if thread else {"at": at, "text": text}


class FakeX:
    def __init__(self, fail_times=0):
        self.sent, self.fail_times = [], fail_times

    def __call__(self, session, text, reply_to=None):
        if self.fail_times:
            self.fail_times -= 1
            raise RuntimeError("X API 503: busy")
        self.sent.append((text, reply_to))
        return str(1000 + len(self.sent))


class Validation(unittest.TestCase):
    def test_needs_timezone(self):
        errors = ps.validate([{"at": "2026-10-03T09:00:00", "text": "x"}])
        self.assertIn("timezone", errors[0])

    def test_emoji_count_double(self):
        self.assertEqual(ps.weighted_len("ab👋"), 4)
        self.assertTrue(ps.validate([post(0, "👋" * 141)]))
        self.assertFalse(ps.validate([post(0, "👋" * 140)]))

    def test_text_xor_thread(self):
        self.assertTrue(ps.validate([{"at": T0.isoformat()}]))

    def test_key_ignores_timezone_spelling(self):
        ist = {"at": "2026-10-03T17:30:00+05:30", "text": "hi"}
        utc = {"at": "2026-10-03T12:00:00Z", "text": "hi"}
        self.assertEqual(ps.key_of(ist), ps.key_of(utc))


class Planning(unittest.TestCase):
    def test_nothing_before_time(self):
        when, _, _ = ps.next_action([post(10)], {}, T0)
        self.assertEqual(when, T0 + timedelta(minutes=10))

    def test_done_entries_skipped(self):
        p = post(0)
        state = {ps.key_of(p): {"status": "posted", "posted_at": T0.isoformat()}}
        self.assertIsNone(ps.next_action([p], state, T0))

    def test_min_gap_spreads_backlog(self):
        a, b = post(-30, "a"), post(-29, "b")
        state = {ps.key_of(a): {"status": "posted", "posted_at": T0.isoformat()}}
        when, key, _ = ps.next_action([a, b], state, T0)
        self.assertEqual(key, ps.key_of(b))
        self.assertEqual(when, T0 + ps.MIN_GAP)

    def test_half_sent_thread_resumes_now(self):
        t = post(-5, thread=["1", "2"])
        state = {ps.key_of(t): {"ids": ["9"], "posted_at": None}}
        when, _, _ = ps.next_action([t], state, T0)
        self.assertEqual(when, T0)


class Handling(unittest.TestCase):
    def test_posts_thread_as_reply_chain(self):
        t, x, state = post(0, thread=["one", "two"]), FakeX(), {}
        self.assertTrue(ps.handle(ps.key_of(t), t, state, None, T0, send=x))
        self.assertEqual(x.sent, [("one", None), ("two", "1001")])
        self.assertEqual(state[ps.key_of(t)]["status"], "posted")

    def test_too_late_is_skipped(self):
        p, x, state = post(-60 * 7), FakeX(), {}
        ps.handle(ps.key_of(p), p, state, None, T0, send=x)
        self.assertEqual(x.sent, [])
        self.assertEqual(state[ps.key_of(p)]["status"], "skipped-late")

    def test_gives_up_after_max_attempts(self):
        p, state = post(0), {}
        x = FakeX(fail_times=99)
        for _ in range(ps.MAX_ATTEMPTS):
            self.assertFalse(ps.handle(ps.key_of(p), p, state, None, T0, send=x))
        self.assertEqual(state[ps.key_of(p)]["status"], "failed")
        self.assertIsNone(ps.next_action([p], state, T0))

    def test_retry_resumes_thread_without_duplicates(self):
        t, state = post(0, thread=["one", "two"]), {}
        x = FakeX()
        real = x.__call__

        def flaky(session, text, reply_to=None):
            if text == "two" and not getattr(flaky, "failed", False):
                flaky.failed = True
                raise RuntimeError("X API 503")
            return real(session, text, reply_to)

        self.assertFalse(ps.handle(ps.key_of(t), t, state, None, T0, send=flaky))
        self.assertTrue(ps.handle(ps.key_of(t), t, state, None, T0, send=flaky))
        self.assertEqual([s[0] for s in x.sent], ["one", "two"])


class Daemon(unittest.TestCase):
    """Simulates a daemon run with a fake clock, fake X and no git."""

    def run_daemon(self, posts, x, run_minutes=600):
        clock = {"now": T0}
        state = {}

        def sleep(seconds):
            clock["now"] += timedelta(seconds=seconds)

        patches = [
            mock.patch.object(ps, "now_utc", lambda: clock["now"]),
            mock.patch.object(ps.time, "sleep", sleep),
            mock.patch.object(ps, "sync_from_remote", lambda: None),
            mock.patch.object(ps, "load_posts", lambda: posts),
            mock.patch.object(ps, "load_state", lambda: state),
            mock.patch.object(ps, "save_and_push", lambda st, msg: None),
            mock.patch.object(ps, "dispatch_next_run", mock.Mock()),
            mock.patch.object(ps, "RUN_FOR", timedelta(minutes=run_minutes)),
        ]
        for p in patches:
            p.start()
        try:
            ok = ps.run_daemon(None, send=x)
            dispatched = ps.dispatch_next_run.called
        finally:
            mock.patch.stopall()
        return ok, state, clock["now"], dispatched

    def test_posts_each_entry_on_time_then_exits(self):
        x = FakeX()
        ok, state, end, dispatched = self.run_daemon([post(30, "a"), post(90, "b")], x)
        self.assertTrue(ok)
        self.assertEqual([s[0] for s in x.sent], ["a", "b"])
        posted = sorted(datetime.fromisoformat(e["posted_at"]) for e in state.values())
        self.assertLessEqual(abs(posted[0] - (T0 + timedelta(minutes=30))), ps.POLL)
        self.assertFalse(dispatched)

    def test_hands_over_before_time_limit(self):
        x = FakeX()
        ok, _, end, dispatched = self.run_daemon([post(60 * 10, "later")], x, run_minutes=60)
        self.assertTrue(ok)
        self.assertEqual(x.sent, [])
        self.assertTrue(dispatched)
        self.assertLessEqual(end, T0 + timedelta(minutes=60))

    def test_exits_when_nothing_within_lookahead(self):
        x = FakeX()
        ok, _, end, dispatched = self.run_daemon([post(60 * 24 * 5, "far")], x)
        self.assertEqual(end, T0)
        self.assertFalse(dispatched)

    def test_transient_failure_is_retried(self):
        x = FakeX(fail_times=2)
        ok, state, _, _ = self.run_daemon([post(0, "a")], x)
        self.assertFalse(ok)  # reported, so the run shows a warning
        self.assertEqual([s[0] for s in x.sent], ["a"])
        self.assertEqual(next(iter(state.values()))["status"], "posted")


if __name__ == "__main__":
    unittest.main()
