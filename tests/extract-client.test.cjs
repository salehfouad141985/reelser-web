const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../lib/extractClient.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const client = { exports: {} };
new Function("module", "exports", compiled)(client, client.exports);
const { requestExtract } = client.exports;

test("retries an empty response once and returns the next valid result", async () => {
  let calls = 0;
  const delays = [];
  const result = { formats: [{ url: "/api/download?ticket=test" }] };
  const request = async (_url, options) => {
    calls++;
    assert.equal(options.cache, "no-store");
    return calls === 1
      ? new Response("")
      : Response.json({ success: true, data: result });
  };
  assert.deepEqual(await requestExtract("@maoning_mfa", "reels", "Try again", request, async ms => { delays.push(ms); }), result);
  assert.equal(calls, 2);
  assert.deepEqual(delays, [750]);
});

test("recovers after two interrupted responses when the server restarts", async () => {
  let calls = 0;
  const result = { formats: [{ url: "/api/download?ticket=test" }] };
  const delays = [];
  const request = async () => {
    calls++;
    if (calls === 1) throw new TypeError("connection closed");
    return calls === 2 ? new Response("") : Response.json({ success: true, data: result });
  };
  assert.deepEqual(await requestExtract("@maoning_mfa", "reels", "Try again", request, async ms => { delays.push(ms); }), result);
  assert.equal(calls, 3);
  assert.deepEqual(delays, [750, 1500]);
});

test("shows a useful status after three invalid responses", async () => {
  let calls = 0;
  const delays = [];
  await assert.rejects(
    requestExtract("@maoning_mfa", "reels", "Try again", async () => {
      calls++;
      return new Response("<html>Unavailable</html>", { status: 502 });
    }, async ms => { delays.push(ms); }),
    { message: "Try again (HTTP 502)" },
  );
  assert.equal(calls, 3);
  assert.deepEqual(delays, [750, 1500]);
});

test("does not retry an explicit API error", async () => {
  let calls = 0;
  await assert.rejects(
    requestExtract("@private", "reels", "Try again", async () => {
      calls++;
      return Response.json({ success: false, error: "Profile is private" }, { status: 422 });
    }),
    { message: "Profile is private" },
  );
  assert.equal(calls, 1);
});

test("does not retry a non-JSON 403 response", async () => {
  let calls = 0;
  await assert.rejects(
    requestExtract("@maoning_mfa", "reels", "Try again", async () => {
      calls++;
      return new Response("<html>Forbidden</html>", { status: 403 });
    }),
    { message: "Try again (HTTP 403)" },
  );
  assert.equal(calls, 1);
});

test("explains a non-JSON rate limit without sending repeated requests", async () => {
  let calls = 0;
  await assert.rejects(
    requestExtract("@maoning_mfa", "reels", "Try again", async () => {
      calls++;
      return new Response("<html>Too many requests</html>", { status: 429 });
    }),
    { message: "Too many requests. Try again later." },
  );
  assert.equal(calls, 1);
});
