"""Summarize login failures without copying credentials or raw Instagram payloads."""
import json
from urllib.parse import urlsplit


ERROR_TYPES = {
    "bad_password", "challenge_required", "checkpoint_required", "login_required",
    "needs_upgrade", "two_factor_required", "rate_limit_error", "sentry_block",
    "feedback_required", "invalid_user", "invalid_credentials",
}


def category(message):
    if not isinstance(message, str) or not message:
        return "unavailable"
    message = message.lower()
    patterns = (
        ("couldn't find an account", "account_not_found"),
        ("username you entered", "username_rejected"),
        ("incorrect password", "credentials_rejected"),
        ("bad password", "credentials_rejected"),
        ("challenge_required", "verification_required"),
        ("checkpoint_required", "verification_required"),
        ("two_factor", "two_factor_required"),
        ("please wait", "try_later"),
        ("too many requests", "try_later"),
        ("out of date", "app_version_rejected"),
        ("problem with your request", "request_rejected"),
        ("email", "email_related_response"),
    )
    return next((label for marker, label in patterns if marker in message), "unrecognized")


def failure_report(client, exc):
    body = client.last_json if isinstance(client.last_json, dict) else {}
    error_type = getattr(exc, "error_type", None) or body.get("error_type")
    response = client.last_response
    status = getattr(response, "status_code", None)
    raw_url = getattr(response, "url", "")
    try:
        path = urlsplit(raw_url).path if isinstance(raw_url, str) else ""
    except ValueError:
        path = ""
    endpoint = "other"
    for suffix, label in (
        ("/accounts/login/", "password_login"),
        ("/accounts/two_factor_login/", "two_factor_login"),
        ("send_login_request/", "caa_login"),
        ("process_client_data/", "caa_process"),
        ("/feed/timeline/", "post_login_feed"),
        ("/feed/reels_tray/", "post_login_stories"),
    ):
        if path.endswith(suffix):
            endpoint = label
            break
    # Every server-derived string is mapped to a fixed label. Never serialize
    # exception text/attributes, cookies, headers, URLs or response bodies.
    return {
        "http_status": status if type(status) is int and 100 <= status <= 599 else None,
        "endpoint": endpoint,
        "error_type": error_type if isinstance(error_type, str) and error_type in ERROR_TYPES else "other",
        "response_category": category(body.get("message")),
        "exception_category": category(getattr(exc, "message", "")),
        "verification_requested": bool(body.get("challenge") or body.get("two_factor_info")),
    }


def save_failure_report(client, exc, session_file):
    report = failure_report(client, exc)
    destination = session_file.parent / "login-diagnostic.json"
    destination.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print("Login diagnostic: " + json.dumps(report))
    print("A diagnostic without raw responses or credentials was saved in the session folder.")
