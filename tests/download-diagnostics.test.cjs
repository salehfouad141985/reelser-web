require("./register.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { NextRequest } = require("next/server");
const { downloadAttempt, MediaFetchError } = require("../lib/downloadDiagnostics.ts");
const { RequestError } = require("../lib/requestPolicy.ts");

function capture(t) {
  const logs = [];
  for (const level of ["warn", "info"]) t.mock.method(console, level, line => logs.push({ level, event: JSON.parse(line) }));
  return logs;
}

test("download failures distinguish upstream HTTP status from the client status and redact secrets", t => {
  const logs = capture(t);
  const error = new MediaFetchError("https://private-url/?secret=token", 422, "http", "http_status", 403,
    Object.assign(new Error("private-response"), { name: "secret-name", code: "secret-code" }));
  downloadAttempt().failure("fetch", error);
  const event = logs[0].event;
  assert.equal(event.event, "download_failure");
  assert.equal(event.stage, "fetch");
  assert.equal(event.sourceStage, "http");
  assert.equal(event.reason, "http_status");
  assert.equal(event.httpStatus, 403);
  assert.equal(event.responseStatus, 422);
  assert.ok(event.elapsedMs >= 0);
  assert.match(event.operationId, /^[a-f0-9-]{36}$/);
  assert.doesNotMatch(JSON.stringify(logs), /private|secret|token/);
});

test("download timeout differs from cancellation even when HTTPS wraps it in AbortError", t => {
  const logs = capture(t);
  const timeout = AbortSignal.abort(new DOMException("private-url", "TimeoutError"));
  downloadAttempt().failure("fetch", new MediaFetchError("failed", 502, "transport", "network_failure", undefined,
    Object.assign(new Error("private"), { name: "AbortError", cause: { code: "ECONNRESET" } })), timeout);
  assert.equal(logs[0].event.reason, "timeout");
  assert.equal(logs[0].event.responseStatus, 504);
  assert.equal(logs[0].event.networkCode, "ECONNRESET");
  const cancelled = AbortSignal.abort();
  downloadAttempt().failure("convert", cancelled.reason, cancelled);
  assert.equal(logs[1].event.reason, "cancelled");
  assert.equal(logs[1].event.responseStatus, 499);
  assert.equal(logs[1].level, "info");
});

test("expired tickets have their own reason before media fetching begins", t => {
  const logs = capture(t);
  downloadAttempt().failure("ticket", new RequestError("Media link expired. Extract the link again.", 403));
  assert.equal(logs[0].event.reason, "ticket_expired_or_missing");
  assert.equal(logs[0].event.responseStatus, 403);
  assert.equal(logs[0].event.httpStatus, undefined);
});

test("download API logs one correlated failure and releases the slot", async t => {
  const logs = capture(t);
  const policy = require("../lib/requestPolicy.ts");
  const tickets = require("../lib/mediaTickets.ts");
  const media = require("../lib/safeMedia.ts");
  let released = false;
  t.mock.method(policy, "servicePolicy", async () => {});
  t.mock.method(policy, "acquireLease", async () => async () => { released = true; });
  t.mock.method(tickets, "readTicket", async () => ({ url: "https://cdninstagram.com/private?token=secret", audio: false }));
  t.mock.method(media, "fetchMedia", async () => { throw new MediaFetchError("private source response", 422, "http", "http_status", 403); });
  const { GET } = require("../app/api/download/route.ts");
  const response = await GET(new NextRequest("https://reelser.com/api/download?ticket=private-ticket"));
  assert.equal(response.status, 422);
  assert.equal(logs.length, 1);
  assert.equal(response.headers.get("x-request-id"), logs[0].event.operationId);
  assert.equal(released, true);
  assert.doesNotMatch(JSON.stringify(logs), /private|secret/);
});

test("download API prepares a valid file without logging a failure", async t => {
  const logs = capture(t);
  const policy = require("../lib/requestPolicy.ts");
  const tickets = require("../lib/mediaTickets.ts");
  const media = require("../lib/safeMedia.ts");
  const admin = require("../lib/adminStore.ts");
  let counted, released = false;
  t.mock.method(policy, "servicePolicy", async () => {});
  t.mock.method(policy, "acquireLease", async () => async () => { released = true; });
  t.mock.method(tickets, "readTicket", async () => ({ url: "https://cdninstagram.com/test", audio: false }));
  const mp4 = Buffer.from([0,0,0,24,102,116,121,112,105,115,111,109]);
  t.mock.method(media, "fetchMedia", async () => mp4);
  t.mock.method(admin, "recordDownloadStat", async type => { counted = type; });
  const { GET } = require("../app/api/download/route.ts");
  const response = await GET(new NextRequest("https://reelser.com/api/download?ticket=test"));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "video/mp4");
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), mp4);
  assert.equal(counted, "video");
  assert.equal(released, true);
  assert.deepEqual(logs, []);
});

test("a source closing without end fails promptly with its HTTP status", async t => {
  const https = require("node:https");
  const { EventEmitter } = require("node:events");
  t.mock.method(https, "get", (_url, _options, callback) => {
    const request = new EventEmitter();
    queueMicrotask(() => {
      const response = new EventEmitter();
      response.statusCode = 200;
      response.headers = {};
      response.complete = false;
      callback(response);
      response.emit("close");
    });
    return request;
  });
  const { fetchMedia } = require("../lib/safeMedia.ts");
  await assert.rejects(fetchMedia("https://cdninstagram.com/test", AbortSignal.timeout(1000)),
    error => error.stage === "body" && error.reason === "body_read_failed" && error.httpStatus === 200);
});

test("download API reports the actual timeout status and a readable retry instruction", async t => {
  const logs = capture(t);
  const policy = require("../lib/requestPolicy.ts");
  const tickets = require("../lib/mediaTickets.ts");
  const media = require("../lib/safeMedia.ts");
  const controller = new AbortController();
  t.mock.method(policy, "servicePolicy", async () => {});
  t.mock.method(policy, "acquireLease", async () => async () => {});
  t.mock.method(tickets, "readTicket", async () => ({ url: "https://cdninstagram.com/test", audio: false }));
  t.mock.method(media, "fetchMedia", async () => {
    controller.abort(new DOMException("source timeout", "TimeoutError"));
    throw new MediaFetchError("failed", 502, "transport", "network_failure", undefined, new DOMException("aborted", "AbortError"));
  });
  const { GET } = require("../app/api/download/route.ts");
  const response = await GET(new NextRequest("https://reelser.com/api/download?ticket=test", { signal: controller.signal }));
  assert.equal(response.status, 504);
  assert.match((await response.json()).error, /timed out.*Try again/);
  assert.equal(logs[0].event.responseStatus, 504);
  assert.equal(logs[0].event.reason, "timeout");
});
