import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";

export function dataDirectory() {
  if (process.env.REELSER_DATA_DIR) {
    return path.resolve(process.env.REELSER_DATA_DIR);
  }
  const cwd = process.cwd();
  // Hostinger: cwd = /home/u123456789/domains/reelser.com/hbuilds/versions/xxx
  // البيانات داخل hbuilds تُحذف مع كل Deploy -> نستخدم مجلداً دائماً خارجها (نفس حل SaveYou2be)
  if (cwd.includes("hbuilds/versions")) {
    const domainDir = cwd.split("/hbuilds/")[0];
    const persistentData = path.join(domainDir, "data");
    return persistentData;
  }
  return path.resolve(path.join(cwd, "data"));
}

// One local persistent volume shared by all Node workers. A crashed lock fails
// closed; do not delete it until the owning process has been stopped.
export async function readSnapshot<T>(name: string, initial: () => T): Promise<T> {
  try { return JSON.parse(await fs.readFile(path.join(dataDirectory(), name + ".json"), "utf8")) as T; }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return initial();
    throw new Error("Stored data is unreadable; manual recovery required", { cause: error });
  }
}

// Readers see a complete snapshot through atomic replacement. Writers wait
// asynchronously so a contended lock never blocks Node's event loop.
export async function transaction<T, R>(name: string, initial: () => T, change: (data: T) => R | Promise<R>): Promise<R> {
  const directory = dataDirectory();
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  const file = path.join(directory, name + ".json");
  const lock = file + ".lock";
  const deadline = performance.now() + 1500;
  for (;;) {
    try { await fs.mkdir(lock); break; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      const stat = await fs.stat(lock).catch(() => null);
      if (stat && Date.now() - stat.mtimeMs >= 15_000) { await fs.rmdir(lock).catch(() => {}); continue; }
      if (performance.now() >= deadline) throw error;
      await delay(10);
    }
  }
  const temporary = `${file}.${crypto.randomUUID()}.tmp`;
  try {
    const data = await readSnapshot(name, initial);
    const result = await change(data);
    const fd = await fs.open(temporary, "wx", 0o600);
    try { await fd.writeFile(JSON.stringify(data)); await fd.sync(); }
    finally { await fd.close(); }
    await fs.rename(temporary, file);
    return result;
  } finally {
    // Cleanup must not replace a committed result or its original error.
    await fs.unlink(temporary).catch(error => {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") console.error("Unable to remove storage temporary file");
    });
    await fs.rmdir(lock).catch(() => { console.error("Unable to release storage lock; manual recovery required"); });
  }
}
