require("./register.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
test("multiple workers update the same file without lost writes", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "reelser-lock-test-"));
  const script = `require('./tests/register.cjs');const {transaction}=require('./lib/storage.ts');(async()=>{for(let i=0;i<12;i++)await transaction('counter',()=>({value:0}),data=>{data.value++});})().catch(error=>{console.error(error);process.exitCode=1});`;
  try {
    await Promise.all(Array.from({ length: 3 }, () => promisify(execFile)(process.execPath, ["-e", script], {
      cwd: path.join(__dirname, ".."), env: { ...process.env, REELSER_DATA_DIR: directory }, windowsHide: true, timeout: 15000,
    })));
    assert.equal(JSON.parse(fs.readFileSync(path.join(directory, "counter.json"))).value, 36);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});

test("stale lock directory left by a crashed process is automatically recovered", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "reelser-stale-lock-"));
  const previous = process.env.REELSER_DATA_DIR;
  process.env.REELSER_DATA_DIR = directory;
  try {
    const lock = path.join(directory, "stale.json.lock");
    fs.mkdirSync(lock);
    const past = new Date(Date.now() - 20_000);
    fs.utimesSync(lock, past, past);
    const { transaction } = require("../lib/storage.ts");
    await transaction("stale", () => ({ ok: false }), data => { data.ok = true; });
    assert.equal(JSON.parse(fs.readFileSync(path.join(directory, "stale.json"), "utf8")).ok, true);
    assert.equal(fs.existsSync(lock), false);
  } finally {
    if (previous === undefined) delete process.env.REELSER_DATA_DIR;
    else process.env.REELSER_DATA_DIR = previous;
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
