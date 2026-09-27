import io
import json
import unittest
import tempfile
from pathlib import Path
from unittest.mock import patch
from source import Service, SourceError, make_app, normalize, Instagram


def media(pk="1", kind=1):
    return {"pk": pk, "media_type": kind, "taken_at": 1700000000,
            "image_versions2": {"candidates": [{"url": "https://cdninstagram.com/a.jpg", "width": 100, "height": 100}]},
            "video_versions": [{"url": "https://cdninstagram.com/a.mp4", "width": 100, "height": 100}]}


class FakeInstagram:
    def __init__(self):
        self.calls = []
        self.private = False
        self.failure = None

    def profile(self, username):
        if self.failure:
            raise self.failure
        return {"pk": 42, "username": username, "is_private": self.private,
                "profile_pic_url": "https://cdninstagram.com/avatar.jpg"}

    def page(self, uid, section, cursor):
        self.calls.append((uid, section, cursor))
        if section == "stories":
            return [media("s1"), media("s2", 2)], None
        return [media("2" if cursor else "1", 2 if section == "reels" else 1)], None if cursor else "next-page"


class SourceTests(unittest.TestCase):
    def setUp(self):
        self.client = FakeInstagram()
        self.now = 1800000000
        self.service = Service("x" * 32, lambda: self.client, lambda: self.now)

    def query(self, section="posts", cursor=None, username="example"):
        return self.service.get({"username": username, "section": section, "cursor": cursor})

    def test_pages_and_independent_reels(self):
        first = self.query()
        second = self.query(cursor=first["nextCursor"])
        self.assertEqual(second["items"][0]["id"], "2")
        self.assertIsNone(second["nextCursor"])
        self.assertEqual(self.query("reels")["items"][0]["type"], "video")
        self.assertIn(("42", "reels", None), self.client.calls)

    def test_all_story_items_and_carousel_children(self):
        self.assertEqual(len(self.query("stories")["items"]), 2)
        album = {"pk": "album", "media_type": 8, "carousel_media": [media("a"), media("b", 2)]}
        self.assertEqual([x["id"] for x in normalize([album])], ["a", "b"])
        self.assertEqual(normalize([{**media(), "expiring_at": 1}], True), [])
        self.assertEqual(normalize([{**media(), "is_besties": True}], True), [])

    def test_signed_cursor_binding_expiry_and_tampering(self):
        cursor = self.query()["nextCursor"]
        for kwargs in [{"section": "reels", "cursor": cursor}, {"cursor": cursor, "username": "someone"}, {"cursor": cursor + "x"}]:
            with self.assertRaises(SourceError):
                self.query(**kwargs)
        self.now += 901
        with self.assertRaises(SourceError):
            self.query(cursor=cursor)

    def test_cached_page_rechecks_privacy(self):
        self.query()
        self.query()
        self.assertEqual(len(self.client.calls), 1)
        self.client.private = True
        with self.assertRaises(SourceError) as error:
            self.query()
        self.assertEqual(error.exception.status, 403)

    def test_cooldown_and_session_failure_never_become_empty_results(self):
        self.client.failure = type("PleaseWaitFewMinutes", (Exception,), {})("SECRET")
        with self.assertRaises(SourceError) as error:
            self.query()
        self.assertEqual(error.exception.status, 429)
        self.client.failure = None
        with self.assertRaises(SourceError):
            self.query()
        self.now += 301
        self.client.failure = type("LoginRequired", (Exception,), {})("SECRET")
        with self.assertRaises(SourceError) as error:
            self.query()
        self.assertEqual(error.exception.code, "session_required")
        self.client.failure = None
        with self.assertRaises(SourceError):
            self.query()

    def test_busy_and_missing_session(self):
        self.service.lock.acquire()
        try:
            with self.assertRaises(SourceError) as error:
                self.query()
            self.assertEqual(error.exception.status, 429)
        finally:
            self.service.lock.release()
        def missing():
            raise SourceError(503, "session_required")
        self.service.factory = missing
        with self.assertRaises(SourceError) as error:
            self.query()
        self.assertEqual(error.exception.code, "session_required")

    def test_http_auth_and_body_validation(self):
        app = make_app(self.service)
        def call(payload, auth="Bearer " + "x" * 32):
            body = json.dumps(payload).encode()
            status = []
            result = app({"PATH_INFO": "/v1/profile", "REQUEST_METHOD": "POST", "HTTP_AUTHORIZATION": auth,
                          "CONTENT_TYPE": "application/json", "CONTENT_LENGTH": str(len(body)), "wsgi.input": io.BytesIO(body)},
                         lambda value, headers: status.append(value))
            return status[0], b"".join(result)
        self.assertTrue(call({}, "wrong")[0].startswith("401"))
        self.assertTrue(call({"username": "../bad", "section": "posts"})[0].startswith("400"))
        self.assertTrue(call({"username": "example", "section": []})[0].startswith("400"))
        self.assertTrue(call({"username": "example", "section": "profile"})[0].startswith("200"))
        self.assertTrue(call(None)[0].startswith("400"))

    def test_missing_media_is_an_error_and_bounds_are_explicit(self):
        with self.assertRaises(SourceError):
            normalize([{"pk": 1, "media_type": 2}])
        with self.assertRaises(SourceError):
            normalize([media(str(i)) for i in range(301)])

    def test_pinned_adapter_uses_saved_session_bounded_transport_and_full_page(self):
        # Real installed Client, mocked transport: no network or account required.
        with tempfile.TemporaryDirectory() as tmp:
            session = Path(tmp) / "session.json"
            session.write_text(json.dumps({"cookies": {}, "authorization_data": {"ds_user_id": "1", "sessionid": "test-only"}}))
            with patch("source.session_path", return_value=session):
                adapter = Instagram()
            self.assertTrue(adapter.client.authorization)
            self.assertEqual(adapter.client.session_retry_total, 0)
            with patch.object(adapter.client.private, "send") as send:
                send.return_value = object()
                adapter.client.private.request("GET", "https://i.instagram.com/test")
                self.assertEqual(send.call_args.kwargs["timeout"], 6)
                self.assertFalse(send.call_args.kwargs["allow_redirects"])
            response = {"items": [{"media": media(str(i), 2)} for i in range(14)], "paging_info": {"max_id": "next"}}
            with patch.object(adapter.client, "_send_private_request", return_value=response) as request:
                items, cursor = adapter.page("42", "reels", "previous")
                self.assertEqual(len(items), 14)  # Never truncate a page and lose items.
                self.assertEqual(cursor, "next")
                self.assertEqual(request.call_args.kwargs["data"]["max_id"], "previous")
                self.assertIn("Authorization", request.call_args.kwargs["headers"])


if __name__ == "__main__":
    unittest.main()
