require("./register.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { setTimeout: delay } = require("node:timers/promises");
const { extractInstagramMedia } = require("../lib/instagramExtractor.ts");
const { sourceAttempt } = require("../lib/sourceDiagnostics.ts");
const input = "https://www.instagram.com/reel/public-test/";

function capture(t) {
  const logs = [];
  for (const level of ["warn", "info"]) t.mock.method(console, level, line => logs.push({ level, event: JSON.parse(line) }));
  return logs;
}

function encoded(html) {
  const decoded = `getElementById("download-section").innerHTML = "${html}"; document.getElementById("inputData").remove(); `;
  const value = [...decoded].map(char => char.charCodeAt(0).toString(2).replaceAll("0", "a").replaceAll("1", "b") + "c").join("");
  return `decodeURIComponent(escape(r))}("${value}",0,"abc",0,2,0))`;
}

test("upstream HTTP rejection records status and cancels its body without exposing it", async t => {
  const logs = capture(t);
  const response = new Response("private-upstream-response", { status: 403 });
  let cancelled = false;
  t.mock.method(response.body, "cancel", async () => { cancelled = true; });
  t.mock.method(globalThis, "fetch", async () => response);
  assert.equal(await extractInstagramMedia(input), null);
  assert.equal(cancelled, true);
  assert.equal(logs.length, 1);
  assert.equal(logs[0].event.provider, "snapsave");
  assert.equal(logs[0].event.stage, "http");
  assert.equal(logs[0].event.reason, "http_status");
  assert.equal(logs[0].event.httpStatus, 403);
  assert.ok(logs[0].event.elapsedMs >= 0);
  assert.match(logs[0].event.operationId, /^[a-f0-9-]{36}$/);
  assert.doesNotMatch(JSON.stringify(logs), /public-test|private-upstream-response|instagram\.com|snapsave\.app/);
});

test("network failures retain an allow-listed nested code without exception text", async t => {
  const logs = capture(t);
  t.mock.method(globalThis, "fetch", async () => { throw new TypeError("https://secret-host/secret-token", {
    cause: Object.assign(new Error("private-account-name"), { code: "ECONNRESET" }),
  }); });
  assert.equal(await extractInstagramMedia(input), null);
  assert.equal(logs[0].event.stage, "transport");
  assert.equal(logs[0].event.reason, "network_failure");
  assert.equal(logs[0].event.errorType, "TypeError");
  assert.equal(logs[0].event.networkCode, "ECONNRESET");
  assert.doesNotMatch(JSON.stringify(logs), /secret|private-account-name/);
});

test("unknown upstream formats are diagnosed instead of silently returning no media", async t => {
  const logs = capture(t);
  t.mock.method(globalThis, "fetch", async () => new Response("private source document"));
  assert.equal(await extractInstagramMedia(input), null);
  assert.equal(logs[0].event.stage, "encoding");
  assert.equal(logs[0].event.reason, "encoding_missing");
  assert.equal(logs[0].event.httpStatus, 200);
  assert.doesNotMatch(JSON.stringify(logs), /private source document/);
});

test("invalid decoder parameters identify the decoding stage", async t => {
  const logs = capture(t);
  t.mock.method(globalThis, "fetch", async () => new Response('decodeURIComponent(escape(r))}("private",0,"abc",0,100,0))'));
  assert.equal(await extractInstagramMedia(input), null);
  assert.equal(logs[0].event.stage, "decode");
  assert.equal(logs[0].event.reason, "parse_failed");
});

test("valid encoding without download HTML identifies the HTML stage", async t => {
  const logs = capture(t);
  // The decoder accepts an empty encoded string, which contains no target HTML.
  t.mock.method(globalThis, "fetch", async () => new Response('decodeURIComponent(escape(r))}("",0,"abc",0,2,0))'));
  assert.equal(await extractInstagramMedia(input), null);
  assert.equal(logs[0].event.stage, "html");
  assert.equal(logs[0].event.reason, "html_missing");
});

test("HTML with no download items identifies the media selection stage", async t => {
  const logs = capture(t);
  t.mock.method(globalThis, "fetch", async () => new Response(encoded("<div>No items</div>")));
  assert.equal(await extractInstagramMedia(input), null);
  assert.equal(logs[0].event.stage, "media");
  assert.equal(logs[0].event.reason, "no_media");
});

test("oversized source documents keep their HTTP status and body failure reason", async t => {
  const logs = capture(t);
  t.mock.method(globalThis, "fetch", async () => new Response("x".repeat(2 * 1024 * 1024 + 1)));
  assert.equal(await extractInstagramMedia(input), null);
  assert.equal(logs[0].event.stage, "body");
  assert.equal(logs[0].event.reason, "response_too_large");
  assert.equal(logs[0].event.httpStatus, 200);
});

test("timeouts and user cancellations have distinct reasons and levels", async t => {
  const logs = capture(t);
  t.mock.method(globalThis, "fetch", async (_url, options) => { throw options.signal.reason; });
  const timeout = AbortSignal.timeout(1);
  await delay(5);
  await assert.rejects(extractInstagramMedia(input, timeout), error => error.name === "TimeoutError");
  assert.equal(logs[0].event.reason, "timeout");
  assert.equal(logs[0].level, "warn");
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(extractInstagramMedia(input, controller.signal), error => error.name === "AbortError");
  assert.equal(logs[1].event.reason, "cancelled");
  assert.equal(logs[1].level, "info");
});

test("error names and codes cannot smuggle secrets into structured logs", t => {
  const logs = capture(t);
  const error = Object.assign(new Error("password-and-signed-url"), { name: "private-user", code: "secret-key" });
  sourceAttempt("snapsave")("request", "parse_failed", error);
  assert.equal(logs[0].event.errorType, "Error");
  assert.equal(logs[0].event.networkCode, undefined);
  assert.doesNotMatch(JSON.stringify(logs), /password|signed-url|private-user|secret-key/);
});

test("successful extraction does not emit a source failure", async t => {
  const logs = capture(t);
  t.mock.method(globalThis, "fetch", async () => new Response(encoded('<div class="download-items"><img src="https://cdninstagram.com/image.jpg"><div class="download-items__btn"><a href="https://cdninstagram.com/image.jpg">Download</a></div></div>')));
  const result = await extractInstagramMedia(input);
  assert.equal(result.formats.length, 1);
  assert.deepEqual(logs, []);
});
