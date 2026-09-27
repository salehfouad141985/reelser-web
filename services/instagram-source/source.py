"""Read-only public profile service. One process owns one Instagram session."""
import base64
import hashlib
import hmac
import json
import os
import re
import threading
import time
from collections import OrderedDict
from datetime import datetime, timezone
from http import HTTPStatus
from pathlib import Path

SECTIONS = {"profile", "posts", "reels", "stories"}
MAX_ITEMS = 300
MAX_RESPONSE = 2 * 1024 * 1024


class SourceError(Exception):
    def __init__(self, status, code):
        self.status, self.code = status, code
        super().__init__(code)


def token_value():
    token = os.environ.get("REELSER_SOURCE_TOKEN", "")
    if len(token) < 32:
        raise RuntimeError("REELSER_SOURCE_TOKEN must contain at least 32 characters")
    return token


def session_path():
    return Path(os.environ.get("INSTAGRAM_SESSION_FILE", "runtime/session.json"))


class Instagram:
    """Use single bounded requests: no implicit relogin, challenge solver or retry sleeps."""
    def __init__(self):
        from instagrapi import Client
        if not session_path().is_file():
            raise SourceError(503, "session_required")
        self.client = Client(session_retry_total=0, request_timeout=1)
        self.client.load_settings(session_path())
        self.client.set_tls_verify(True)
        self.client.set_retry_config(request_timeout=1, session_retry_total=0)
        send = self.client.private.request
        def bounded_request(method, url, **kwargs):
            kwargs["timeout"] = 6
            kwargs["allow_redirects"] = False
            return send(method, url, **kwargs)
        self.client.private.request = bounded_request
        if not self.client.authorization:
            raise SourceError(503, "session_required")

    def request(self, endpoint, **kwargs):
        # The high-level private_request retries a timeout after 60s and resolves
        # challenges interactively. The pinned transport sends only this request.
        return self.client._send_private_request(
            endpoint, headers={"Authorization": self.client.authorization}, **kwargs
        )

    def profile(self, username):
        return self.request(f"users/{username}/usernameinfo/")["user"]

    def page(self, uid, section, cursor):
        if section == "stories":
            response = self.request(f"feed/user/{uid}/story/")
            if "reel" not in response:
                raise SourceError(502, "invalid_source_response")
            return (response["reel"] or {}).get("items", []), None
        if section == "reels":
            response = self.request("clips/user/", data={
                "target_user_id": uid, "page_size": "12", "max_id": cursor or ""
            })
            items = [entry["media"] for entry in response["items"]]
            paging = response.get("paging_info", {})
            return items, paging.get("max_id") if paging.get("more_available") is not False else None
        response = self.request(f"feed/user/{uid}/", params={"count": 12, "max_id": cursor or ""})
        return response["items"], response.get("next_max_id")


def image_url(item):
    candidates = (item.get("image_versions2") or {}).get("candidates") or []
    return max(candidates, key=lambda v: v.get("width", 0) * v.get("height", 0)).get("url", "") if candidates else ""


def normalize(items, stories=False):
    output = []
    for parent in items:
        # An authenticated service session must not expose Close Friends or
        # subscriber-only stories, even when the profile itself is public.
        if stories and (parent.get("is_besties") or parent.get("is_exclusive") or
                        parent.get("audience") not in (None, "", "everyone", "public")):
            continue
        if stories and parent.get("expiring_at", time.time() + 1) <= time.time():
            continue
        children = parent.get("carousel_media") if parent.get("media_type") == 8 else [parent]
        if not children:
            raise SourceError(502, "invalid_source_response")
        for child in children:
            kind = child.get("media_type")
            if kind not in (1, 2):
                raise SourceError(502, "unsupported_media")
            thumb = image_url(child)
            versions = child.get("video_versions") or []
            video = max(versions, key=lambda v: v.get("width", 0) * v.get("height", 0)).get("url", "") if versions else ""
            url = video if kind == 2 else thumb
            identifier = child.get("pk") or child.get("id")
            if not identifier or not url:
                raise SourceError(502, "invalid_source_response")
            taken = parent.get("taken_at")
            output.append({
                "id": str(identifier), "type": "video" if kind == 2 else "image",
                "thumbnail": thumb, "downloadUrl": url, "isVideo": kind == 2,
                "caption": (parent.get("caption") or {}).get("text", ""),
                "likes": str(parent.get("like_count", "")),
                "comments": str(parent.get("comment_count", "")),
                "timestamp": datetime.fromtimestamp(taken, timezone.utc).isoformat() if taken else "",
            })
            if len(output) > MAX_ITEMS:
                raise SourceError(502, "source_page_too_large")
    return list({item["id"]: item for item in output}.values())


class Service:
    def __init__(self, token, factory=Instagram, clock=time.time):
        self.token, self.factory, self.clock = token, factory, clock
        self.client = None
        self.lock = threading.Lock()
        self.cache = OrderedDict()
        self.cooldown = 0
        self.session_blocked = False

    def sign(self, username, section, uid, cursor):
        if not cursor:
            return None
        raw = json.dumps([username, section, uid, str(cursor), int(self.clock()) + 900], separators=(",", ":")).encode()
        data = base64.urlsafe_b64encode(raw).decode().rstrip("=")
        sig = hmac.new(self.token.encode(), data.encode(), hashlib.sha256).hexdigest()
        value = data + "." + sig
        if len(value) > 4096:
            raise SourceError(502, "invalid_source_cursor")
        return value

    def decode(self, value, username, section):
        if not value:
            return None
        try:
            data, sig = value.split(".")
            expected = hmac.new(self.token.encode(), data.encode(), hashlib.sha256).hexdigest()
            if not hmac.compare_digest(sig, expected):
                raise ValueError()
            user, kind, uid, cursor, expiry = json.loads(base64.urlsafe_b64decode(data + "=" * (-len(data) % 4)))
            if user != username or kind != section or expiry <= self.clock():
                raise ValueError()
            return str(uid), cursor
        except (ValueError, TypeError, KeyError):
            raise SourceError(400, "invalid_cursor") from None

    def get(self, body):
        if not isinstance(body, dict):
            raise SourceError(400, "invalid_request")
        username, section, cursor = body.get("username"), body.get("section"), body.get("cursor")
        if not isinstance(username, str) or not re.fullmatch(r"[a-zA-Z0-9._]{1,30}", username):
            raise SourceError(400, "invalid_username")
        if not isinstance(section, str) or section not in SECTIONS:
            raise SourceError(400, "invalid_section")
        if cursor is not None and (not isinstance(cursor, str) or len(cursor) > 4096):
            raise SourceError(400, "invalid_cursor")
        if cursor and section in {"profile", "stories"}:
            raise SourceError(400, "invalid_cursor")
        username = username.lower()
        decoded = self.decode(cursor, username, section)
        key = (username, section, cursor)
        if not self.lock.acquire(blocking=False):
            raise SourceError(429, "source_busy")
        try:
            if self.session_blocked:
                raise SourceError(503, "session_required")
            if self.clock() < self.cooldown:
                raise SourceError(429, "source_cooldown")
            if self.client is None:
                self.client = self.factory()
            # Recheck privacy on EVERY request, including cached media pages.
            info = self.client.profile(username)
            if info.get("is_private") is not False or str(info.get("username", "")).lower() != username:
                raise SourceError(403, "public_profiles_only")
            uid = str(info["pk"])
            if decoded and decoded[0] != uid:
                raise SourceError(400, "invalid_cursor")
            entry = self.cache.get(key)
            if entry and entry[0] > self.clock() and entry[1] == uid:
                return entry[2]
            if section == "profile":
                avatar = (info.get("hd_profile_pic_url_info") or {}).get("url") or info.get("profile_pic_url", "")
                result = {"profile": {
                    "username": username, "fullName": info.get("full_name", username),
                    "avatarUrl": avatar, "hdAvatarUrl": avatar,
                    "postsCount": str(info.get("media_count", 0)),
                    "followersCount": str(info.get("follower_count", 0)),
                    "followingCount": str(info.get("following_count", 0)),
                    "biography": info.get("biography", ""), "isVerified": bool(info.get("is_verified")),
                }}
            else:
                raw_cursor = decoded[1] if decoded else None
                items, next_cursor = self.client.page(uid, section, raw_cursor)
                if not isinstance(items, list) or len(items) > MAX_ITEMS:
                    raise SourceError(502, "invalid_source_response")
                if next_cursor and str(next_cursor) == raw_cursor:
                    raise SourceError(502, "repeated_source_cursor")
                result = {"items": normalize(items, section == "stories"),
                          "nextCursor": self.sign(username, section, uid, next_cursor)}
            if len(json.dumps(result).encode()) > MAX_RESPONSE:
                raise SourceError(502, "source_page_too_large")
            # Stories are intentionally not cached: expired stories must disappear.
            if section != "stories":
                self.cache[key] = (self.clock() + 60, uid, result)
                self.cache.move_to_end(key)
                while len(self.cache) > 16:
                    self.cache.popitem(last=False)
            return result
        except SourceError:
            raise
        except Exception as exc:
            name = type(exc).__name__
            if any(word in name for word in ("Login", "Challenge", "Password", "TwoFactor", "Consent")):
                self.session_blocked = True
                self.cache.clear()
                raise SourceError(503, "session_required") from None
            if any(word in name for word in ("PleaseWait", "Throttled", "RateLimit", "Feedback")):
                self.cooldown = self.clock() + 300
                raise SourceError(429, "source_cooldown") from None
            raise SourceError(502, "source_unavailable") from None
        finally:
            self.lock.release()


def make_app(service):
    def app(environ, start_response):
        try:
            if environ.get("PATH_INFO") == "/health" and environ.get("REQUEST_METHOD") == "GET":
                result = {"status": "running"}  # Liveness only, not proof of Instagram access.
            else:
                auth = environ.get("HTTP_AUTHORIZATION", "").encode()
                if not hmac.compare_digest(auth, ("Bearer " + service.token).encode()):
                    raise SourceError(401, "unauthorized")
                if environ.get("PATH_INFO") != "/v1/profile" or environ.get("REQUEST_METHOD") != "POST":
                    raise SourceError(404, "not_found")
                if not environ.get("CONTENT_TYPE", "").startswith("application/json"):
                    raise SourceError(415, "json_required")
                length = int(environ.get("CONTENT_LENGTH") or 0)
                if length <= 0 or length > 8192:
                    raise SourceError(413, "invalid_body_size")
                result = service.get(json.loads(environ["wsgi.input"].read(length)))
            status = 200
        except (ValueError, UnicodeDecodeError):
            status, result = 400, {"error": "invalid_json"}
        except SourceError as exc:
            status, result = exc.status, {"error": exc.code}
        except Exception:
            status, result = 503, {"error": "source_unavailable"}
        payload = json.dumps(result).encode()
        headers = [("Content-Type", "application/json"), ("Cache-Control", "no-store"), ("Content-Length", str(len(payload)))]
        if status == 429:
            headers.append(("Retry-After", "300"))
        start_response(f"{status} {HTTPStatus(status).phrase}", headers)
        return [payload]
    return app


if __name__ == "__main__":
    from waitress import serve
    serve(make_app(Service(token_value())), host=os.environ.get("SOURCE_HOST", "127.0.0.1"),
          port=int(os.environ.get("SOURCE_PORT", "8010")), threads=4, connection_limit=32,
          max_request_body_size=8192, channel_timeout=30, ident="")
