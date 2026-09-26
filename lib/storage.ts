import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export function dataDirectory() {
  return path.resolve(process.env.REELSER_DATA_DIR || path.join(process.cwd(), "data"));
}

// One local persistent volume shared by all Node workers. A crashed lock fails
// closed; do not delete it until the owning process has been stopped.
export function transaction<T, R>(name: string, initial: () => T, change: (data: T) => R): R {
  const directory = dataDirectory();
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  const file = path.join(directory, name + ".json");
  const lock = file + ".lock";
  const deadline = Date.now() + 1500;
  for (;;) {
    try { fs.mkdirSync(lock); break; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST" || Date.now() >= deadline) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    }
  }
  const temporary = `${file}.${crypto.randomUUID()}.tmp`;
  try {
    let data: T;
    try { data = JSON.parse(fs.readFileSync(file, "utf8")) as T; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw new Error("Stored data is unreadable; manual recovery required", { cause: error });
      data = initial();
    }
    const result = change(data);
    const fd = fs.openSync(temporary, "wx", 0o600);
    try { fs.writeFileSync(fd, JSON.stringify(data)); fs.fsyncSync(fd); }
    finally { fs.closeSync(fd); }
    fs.renameSync(temporary, file);
    return result;
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    fs.rmdirSync(lock);
  }
}
