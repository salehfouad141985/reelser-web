# Mobile performance and download audit — 28 September 2026

## Published baseline

PageSpeed Insights mobile report:
https://pagespeed.web.dev/analysis/https-reelser-com/z2hblnz27g?form_factor=mobile

Measured before this change, using an emulated Moto G Power and slow 4G:

| Metric | Result |
| --- | --- |
| Performance | 99/100 |
| Accessibility | 94/100 |
| Best practices | 100/100 |
| SEO checks | 100/100 |
| First contentful paint | 0.9 s |
| Largest contentful paint | 1.7 s |
| Total blocking time | 20 ms |
| Cumulative layout shift | 0.001 |
| Speed index | 2.5 s |

No real-user field data was available. These are laboratory results for the
initial homepage, not download latency or a guarantee for every visitor.

## Changes

- Load the result viewer only after an extraction succeeds. Initial homepage
  JavaScript in the production build fell from 673,439 to 651,033 uncompressed
  bytes (22,406 bytes deferred); this is a bundle comparison, not a new speed score.
- Lazy-load and asynchronously decode profile result thumbnails.
- Guard concurrent downloads and show busy states on story and reel buttons.
- Keep the avatar modal within a 320-pixel viewport.
- Improve the specific text contrast and footer heading-order issues identified
  by PageSpeed Insights.
- Reject unexpected HTML download responses and show a readable retry message
  for gateway errors, network interruptions, empty files and interrupted bodies.

## Verification

- Production build and lint passed. The suite includes real local FFmpeg
  conversion, media security, extraction, pagination and download-client tests.
- Browser check at 390 pixels: no horizontal page overflow; real profile results
  loaded through the deferred viewer without console errors.
- Browser check at 320 pixels: the avatar modal and its image fit on screen.
- During a download, all other profile download buttons were disabled and the
  active button displayed its busy state. A completed file save could not be
  independently confirmed through the browser's download-event tool.

## Outstanding production issue

The published extraction endpoint returned HTTP 200 for `@maoning_mfa`, with
partial results. Its generated avatar preview and download URLs repeatedly
returned a Cloudflare HTML **502 Bad Gateway** page, even with identity encoding.
Invalid tickets returned the expected JSON 403, and public site settings returned
JSON 200. A second account, `@ai_work_flows_`, returned 422 during this audit.

Hostinger runtime logs showed extraction-provider warnings without a useful
stack trace for the 502. No hosting configuration was changed. The root cause of
the production 502 is **not established or fixed** by these frontend changes.
The next diagnostic step is to correlate a fresh failure with the hosting/reverse
proxy error log; do not disable security checks or claim a successful download
based only on the extraction response. Do not store signed media tickets in this
report or in source control.

After deployment, rerun both the mobile audit and an actual file download.
