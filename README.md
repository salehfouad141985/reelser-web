# Reelser Web

Next.js application for retrieving publicly available Instagram media. Node.js 22 or newer and a persistent writable local volume are required.

## Development and checks

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run check` runs lint, types, regression tests and the production build. Tests cover authentication, corrupted storage, concurrent writers, SSRF and redirects, extraction classification, file validation, conversion failure/cancellation and real FFmpeg conversion of a synthetic local video. Live Instagram/SnapSave availability is not guaranteed by these tests.

## Configuration and migration

Copy `.env.example` to `.env.local` for local development. In production, provide environment variables through the host's secret configuration:

- `ADMIN_JWT_SECRET`: a fresh random secret of at least 32 characters. Despite the historical variable name, sessions now use opaque random tokens stored as HMAC hashes, not JWTs. Old JWTs are invalid.
- `REELSER_ADMIN_PASS`: an initial password of at least 16 characters. It is used only when the store has no password. The old public default is rejected.
- `REELSER_DATA_DIR`: an absolute path to a **persistent local volume shared by every worker on one host**. Defaults to `./data`. Do not put it inside a disposable release directory.
- `REELSER_TRUSTED_IP_HEADER`: optional single-IP header overwritten by a trusted front proxy. Configure it only when direct access to the application is blocked and the proxy strips visitor-supplied copies. Otherwise all visitors share site-wide hourly ceilings (600 extractions, 600 downloads, and 6000 previews) instead of the per-visitor limits. Concurrency limits still apply.

Administration fails closed without the secret. Existing non-default passwords retain compatibility; passwords are upgraded to the stronger hash when changed. Changing a password, rotating the secret or logging out revokes affected sessions. Sessions last one day.

Before upgrading a deployment that used the old defaults, rotate the signing secret and set a new password. Back up existing `admin-config.json` before migration. If the persisted password is the former public default, an operator must perform a controlled password reset with the application stopped; the application will never silently reset it. Do not delete a store to recover from corruption: restore a known valid backup.

The JSON store uses exclusive directory locks and atomic replacement. A process crash can leave a `.json.lock` directory: stop all workers, verify no writer remains, restore the file if necessary, then remove only the stale lock. Monitor storage errors and keep backups. This is a single-host design, **not** a distributed database or a network-filesystem locking protocol. Multi-host/serverless deployment needs a shared transactional database and distributed rate/concurrency limits first.

## Optional self-hosted profile source

The Python service in [`services/instagram-source`](services/instagram-source/README.md) supports independent posts, reels and active stories plus real continuation pages. It requires an operator-created Instagram session and a shared service secret. Enable with `REELSER_PROFILE_SOURCE=selfHosted` only after running the service and validating real results. It is disabled by default; no live Instagram verification has been performed without a session. See its README for local/Docker setup, managed-hosting connectivity and limits.

## Web server startup

The build emits standalone output. Copy `public` and `.next/static` into the corresponding standalone paths and run `node .next/standalone/server.js`, supplying environment variables at runtime. Build on the target operating system so `ffmpeg-static` matches the host. Configure the front proxy to overwrite the selected IP header, enforce body/request timeouts and serve HTTPS. Do not expose the data volume publicly.

## Hostinger and GitHub rollout

The connected repository is `salehfouad141985/reelser-web`. Review the pending changes on a separate branch before merging to its production branch. In Hostinger's Node.js website dashboard, first confirm which repository and branch the website actually deploys. Hostinger's GitHub integration can build and deploy on each push, so pushing directly to a connected production branch can publish immediately. The dashboard's Deployments page shows the actual build status.

Before merging, add `ADMIN_JWT_SECRET` and `REELSER_ADMIN_PASS` under the website's Environment variables. Set `REELSER_DATA_DIR` only to a writable **persistent** directory outside Hostinger's managed deployment directories (`hbuilds/`, `nodejs/` and `public_html/`), and verify that the data survives a test redeploy. The location must be available to all Node workers of the same site. If this hosting plan cannot provide such storage, keep the current site running and migrate the JSON store and rate limits to a shared transactional database before deploying these changes. Do not put real values in `.env.example` or GitHub.

At redeploy, review the selected Node.js version, build command, start command and environment variables in Hostinger. Verify a public profile photo, a public video, a story, admin login/logout, rate limiting and the site after a second redeploy. Hostinger documents [environment variable editing](https://www.hostinger.com/support/how-to-edit-or-add-environment-variables-after-deployment/) and [GitHub-based redeployment](https://www.hostinger.com/support/how-to-redeploy-a-node-js-application/). The site's actual hosting configuration was not readable in this local workspace.

## Media and resource policy

- Extraction is limited to 30 requests/hour per configured client; downloads default to 60/hour and use the admin setting (1–600). Previews allow 600/hour.
- Login allows 5 attempts per client per 15 minutes plus a global cap of 30.
- Shared single-host limits: 4 extraction jobs, 4 media fetches, 2 FFmpeg conversions. Busy requests return 429.
- Extraction has a 25-second deadline with cancellation and a 2 MiB source-document limit. Media is limited to 32 MiB (preview images: 8 MiB), with a 20-second fetch timeout. Conversion has a 35-second timeout and 24 MiB output limit. A download has a 60-second overall deadline.
- Only expiring, opaque server-issued tickets can fetch media. Tickets last 15 minutes. HTTPS media hosts are explicitly allowed in `lib/safeMedia.ts`. Every redirect is revalidated; DNS addresses are validated inside the connection lookup. Private/reserved IPv4 and all IPv6 destinations are rejected.
- Image previews accept JPEG, PNG, GIF and WebP signatures only, with fixed MIME types, `nosniff` and a restrictive CSP. HTML and SVG responses are rejected. Unknown media/CDN domains fail closed; review and explicitly add a provider domain only when needed.
- Video input currently supports MP4. FFmpeg receives a validated local temporary MP4, never a remote URL. Output is completed and checked before returning success. The download counter means **a complete file was prepared**, not confirmation that the user's browser saved it. No byte-range/resume streaming is offered.
- Temporary conversion files are removed on success/failure/cancellation. An operator should clean abandoned `reelser-audio-*` directories from the OS temp directory after process crashes, with no active conversions running.

## Supported behavior and limitations

Profile pictures, posts and story links depend on upstream public sources. Missing metadata or a generated placeholder is never offered as an original download. A metadata-only success can provide an actual profile photo while posts remain unavailable. Photos are never put in the reels list. The source does not provide trustworthy pagination cursors: “Show more” reveals only the already returned batch. Highlights have an explicit empty state until a real extraction source is implemented. Quality depends on the source; MP3 conversion targets 192 kbps and cannot restore missing source detail.

Maintenance blocks extraction/download/preview APIs and appears in the public UI. Advertisement settings are rendered in sandboxed frames without same-origin access; ad providers that require access to the parent page will not work. No Google Analytics script or fabricated rating schema is loaded. Activity records store generic event titles; legacy activity titles are scrubbed as new events are recorded. Temporary media URLs remain in the ticket store until expired entries are pruned by a subsequent extraction. See the privacy page for processing details.

Duplicate keyword routes permanently redirect to the corresponding main tool page; the sitemap lists canonical routes only. Result controls use the language dictionary. Static editorial/illustrated sections still contain some English text.

## Keyword tools

```sh
node scripts/analyze-keywords.cjs /path/to/keyword-export.tsv utf8
node scripts/build-reelser-pseo.cjs /path/to/keyword-export.tsv utf16le
```

Both accept UTF-8 or UTF-16LE. A UTF-16LE BOM is detected automatically; use the optional encoding argument for files without a BOM. The generator updates the keyword alias dataset, whose routes redirect to the canonical tools.
