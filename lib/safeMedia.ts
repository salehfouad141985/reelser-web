import https from "node:https";
import dns from "node:dns";
import { BlockList, isIP } from "node:net";
import { RequestError } from "./requestPolicy";

const HOSTS = ["cdninstagram.com", "fbcdn.net", "iqsaved.com"];
const EXACT_HOSTS = new Set(["d.rapidcdn.app"]);
const blockedIPv6 = new BlockList();
// Do not let IPv6 transition addresses tunnel a private IPv4 destination.
blockedIPv6.addSubnet("2001::", 32, "ipv6"); // Teredo
blockedIPv6.addSubnet("2002::", 16, "ipv6"); // 6to4
blockedIPv6.addSubnet("2001:db8::", 32, "ipv6"); // Documentation
export function validateMediaUrl(raw: string) {
  let url: URL;
  try { url = new URL(raw); } catch { throw new RequestError("Invalid media URL"); }
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443") ||
      !EXACT_HOSTS.has(url.hostname) && !HOSTS.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`))) {
    throw new RequestError("Unsupported media source");
  }
  return url;
}
export function publicAddress(ip: string): boolean {
  if (isIP(ip) === 6) {
    // Native global-unicast IPv6 only. This excludes loopback, private, link-local,
    // multicast, and IPv4-mapped addresses before the transition checks above.
    const first = Number.parseInt(ip.split(":", 1)[0], 16);
    return first >= 0x2000 && first <= 0x3fff && !blockedIPv6.check(ip, "ipv6");
  }
  if (isIP(ip) !== 4) return false;
  const [a, b, c] = ip.split(".").map(Number);
  return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99))) ||
    (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
    (a === 203 && b === 0 && c === 113));
}

export async function fetchMedia(raw: string, signal: AbortSignal, maxBytes = 32 * 1024 * 1024): Promise<Buffer> {
  let url = validateMediaUrl(raw);
  for (let hop = 0; hop < 4; hop++) {
    signal.throwIfAborted();
    const result = await new Promise<{ location?: string; bytes?: Buffer }>((resolve, reject) => {
      const options: https.RequestOptions & { autoSelectFamily: boolean } = {
        signal, agent: false, autoSelectFamily: true,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Accept-Encoding": "identity",
          Referer: url.hostname === "iqsaved.com" || url.hostname.endsWith(".iqsaved.com")
            ? "https://insta-stories-viewer.com/" : "https://www.instagram.com/",
        },
        // Validate inside the connection's lookup: no second DNS resolution.
        lookup(hostname, options, callback) {
          dns.lookup(hostname, { all: true, family: 0 }, (error, addresses) => {
            if (error) return callback(error, "", 4);
            const allowed = addresses.filter(item => publicAddress(item.address));
            if (!allowed.length) {
              return callback(new Error("Blocked network destination"), "", 4);
            }
            if (options.all) callback(null, allowed);
            else callback(null, allowed[0].address, allowed[0].family);
          });
        },
      };
      const request = https.get(url, options, response => {
        const status = response.statusCode || 502;
        if ([301, 302, 303, 307, 308].includes(status)) {
          const location = response.headers.location;
          response.destroy();
          if (!location) reject(new RequestError("Invalid media redirect", 502));
          else resolve({ location });
          return;
        }
        if (status !== 200 || Number(response.headers["content-length"] || 0) > maxBytes) {
          // Log only the host and status; media URLs can contain signed tokens.
          console.warn("Media fetch rejected upstream response", {
            host: url.hostname, status,
            oversized: Number(response.headers["content-length"] || 0) > maxBytes,
          });
          response.destroy();
          // A rejected or expired source URL is a bad media link, not a gateway
          // failure. A 422 lets the client show the JSON error through Hostinger.
          const denied = status === 403 || status === 404;
          reject(new RequestError(denied ? "Media link unavailable. Extract it again." : "Media unavailable or too large", denied ? 422 : 502));
          return;
        }
        const chunks: Buffer[] = [];
        let size = 0;
        response.on("data", (chunk: Buffer) => {
          size += chunk.length;
          if (size > maxBytes) response.destroy(new RequestError("Media exceeds size limit", 413));
          else chunks.push(chunk);
        });
        response.once("error", error => {
          console.warn("Media fetch response error", { host: url.hostname, code: (error as NodeJS.ErrnoException).code || "unknown" });
          reject(error);
        });
        response.once("end", () => size ? resolve({ bytes: Buffer.concat(chunks) }) : reject(new RequestError("Empty media", 502)));
      });
      request.once("error", error => {
        console.warn("Media fetch connection error", { host: url.hostname, code: (error as NodeJS.ErrnoException).code || "unknown" });
        reject(error);
      });
    });
    if (result.bytes) return result.bytes;
    url = validateMediaUrl(new URL(result.location!, url).href);
  }
  throw new RequestError("Too many media redirects", 502);
}

export function mediaKind(bytes: Buffer) {
  if (bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) return { mime: "image/jpeg", ext: "jpg", type: "image" } as const;
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return { mime: "image/png", ext: "png", type: "image" } as const;
  if (["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6))) return { mime: "image/gif", ext: "gif", type: "image" } as const;
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return { mime: "image/webp", ext: "webp", type: "image" } as const;
  if (bytes.length >= 12 && bytes.toString("ascii", 4, 8) === "ftyp" &&
      ["isom", "iso2", "mp41", "mp42", "avc1", "M4V ", "dash"].includes(bytes.toString("ascii", 8, 12))) {
    return { mime: "video/mp4", ext: "mp4", type: "video" } as const;
  }
  throw new RequestError("Unsupported media content", 415);
}
