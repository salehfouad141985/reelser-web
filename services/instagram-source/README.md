# Reelser self-hosted Instagram source

This optional Python service retrieves public profile metadata, separate post/reel pages and currently active stories using `instagrapi`. The web application uses it only when `REELSER_PROFILE_SOURCE=selfHosted`. Direct post/reel links continue using the existing extractor. Highlights are not implemented in this first version.

The source is implemented and testable without credentials. Real Instagram retrieval still requires an operator-created session and live verification. Unofficial Instagram endpoints can change or reject a session; this is not a promise to retrieve every item from every account. Never treat a source error as an empty account.

## Run locally

Requires Python 3.12. From this directory:

```sh
python -m venv .venv
# Linux/macOS:
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python login.py
# Windows PowerShell:
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe login.py
```

Enter the Instagram username, password and optional 2FA code in the local terminal. Credentials must not be pasted into chat, placed in the web frontend or committed to Git. The login command stores only the resulting session settings at `runtime/session.json`, excluded from Git. Protect this directory with OS permissions; on Windows restrict its ACL to the service user. Do not use a valuable personal account for an experimental integration: Instagram can require verification or restrict it.

Generate a random shared token locally with `python -c "import secrets; print(secrets.token_urlsafe(32))"`. Supply it through your process manager/secret settings as `REELSER_SOURCE_TOKEN` to both services. The source does **not** read `.env` automatically when run directly.

Start the source with `.venv/bin/python source.py` (Windows: `.\.venv\Scripts\python.exe source.py`). Defaults are `127.0.0.1:8010` and `runtime/session.json`. `SOURCE_HOST`, `SOURCE_PORT` and `INSTAGRAM_SESSION_FILE` may override them. Run exactly one source process per session; the request lock, cache and cooldown are process-local.

## Docker on the production host

Put `REELSER_SOURCE_TOKEN=<your random secret>` in this directory's ignored `.env` file, then:

```sh
docker compose build
docker compose run --rm instagram-source python login.py
docker compose up -d
```

The session is stored in a persistent Docker volume, and the port is bound to host loopback. Do not remove the volume when redeploying. Login is interactive; restart the service after refreshing the session. The container runs as an unprivileged user with a read-only application filesystem.

For the web application on the **same host**, configure:

```dotenv
REELSER_PROFILE_SOURCE=selfHosted
REELSER_SOURCE_URL=http://127.0.0.1:8010
REELSER_SOURCE_TOKEN=<same random secret>
```

For a web app on another host (including managed Node hosting), run this service on a machine that supports Python/Docker and expose it through HTTPS plus network access controls. Set `REELSER_SOURCE_URL` to that HTTPS service address. Loopback refers to the web application's own machine, so a managed Hostinger web app cannot reach a developer PC through `127.0.0.1`. Never send the token over a public HTTP connection. No `NEXT_PUBLIC_` variable should contain these settings.

## API and behavior

- `GET /health`: process liveness only; it does not test the Instagram session.
- `POST /v1/profile`: requires `Authorization: Bearer <token>` and JSON `{ "username": "example", "section": "profile|posts|reels|stories", "cursor": null }`.
- `profile` returns normalized metadata. Other sections return `{ "items": [...], "nextCursor": "..." | null }`. Reels use a separate endpoint; album posts expand all child assets. Stories return active items and have no continuation cursor.
- Continuation cursors are signed, bound to account ID/name and section, and expire in 15 minutes. Every request rechecks that the account remains public, even for a cached page.
- Metadata/media cache lasts 60 seconds and retains at most 16 entries. Stories are not cached. Cache does not eliminate the privacy-check request.
- Only one Instagram operation runs at a time. Concurrent requests get 429. Upstream throttling starts a five-minute cooldown; session/challenge failures require operator login and service restart. No automatic account rotation or challenge bypass.
- Transport requests use a six-second timeout with no automatic transport retries. A profile/page request may make more than one upstream call. The web application also has a 25-second overall deadline.
- A page exceeding 300 flattened media items or 2 MiB of normalized output fails explicitly. The web view stops retaining new pages after approximately 5,000 items. There is no fabricated full-account count based on a retrieved batch.
- Existing Reelser media host validation, DNS restrictions, download quotas and expiring download tickets apply. A new unsupported CDN fails closed; review it before extending the allowlist.
- Browser continuation requests share the current extraction quota (30/hour per configured client). Configure the trusted proxy header correctly before a public rollout; otherwise the existing shared quota applies to all visitors.

## Validation

```sh
python -m unittest discover -s .
```

From the repository root run the existing web checks too. Fake Instagram tests verify page cursors, independent reels, stories, all album children, private-profile rejection, auth, cache, cooldown and session failures. They do not establish live Instagram availability.

Before enabling publicly, test `maoning_mfa` and `ai_work_flows_` with a valid session: compare latest posts/reels/active stories, load a second page without duplicates, download an image/video, then confirm an invalid session shows an error. Do not mark this live check passed until performed.

Disable by setting `REELSER_PROFILE_SOURCE=legacy` (or removing it) and restarting the web app. The service does not silently fall back to legacy results when enabled, so a failed session cannot masquerade as a successful partial lookup.

Implementation references: [instagrapi](https://github.com/subzeroid/instagrapi), [media pagination](https://github.com/subzeroid/instagrapi/blob/master/docs/usage-guide/media.md), [stories](https://github.com/subzeroid/instagrapi/blob/master/docs/usage-guide/story.md). The transport is pinned to 3.0.14 because this adapter deliberately uses its single-request method; rerun adapter tests when upgrading.
