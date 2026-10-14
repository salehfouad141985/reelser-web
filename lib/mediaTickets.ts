import crypto from "node:crypto";
import { readSnapshot, transaction } from "./storage";
import { validateMediaUrl } from "./safeMedia";
import { RequestError } from "./requestPolicy";
import type { MediaResult } from "./instagramExtractor";
interface Ticket { url: string; kind: "preview" | "download"; audio: boolean; expires: number }
type Tickets = Record<string, Ticket>;
export async function readTicket(id: string | null, kind: Ticket["kind"]) {
  if (!id || !/^[\w-]{32}$/.test(id)) throw new RequestError("Invalid media ticket", 403);
  const ticket = (await readSnapshot<Tickets>("media-tickets", () => ({})))[id];
  if (!ticket || ticket.expires <= Date.now() || ticket.kind !== kind) throw new RequestError("Media link expired. Extract the link again.", 403);
  return ticket;
}
export async function authorizeMedia(result: MediaResult): Promise<MediaResult> {
  return transaction<Tickets, MediaResult>("media-tickets", () => ({}), data => {
    for (const [id, ticket] of Object.entries(data)) if (ticket.expires <= Date.now()) delete data[id];
    let count = Object.keys(data).length;
    if (count > 20000) throw new RequestError("Service busy", 429);
    const issued = new Map<string, string>();
    const issue = (url: string, kind: Ticket["kind"], audio = false): string => {
      try { validateMediaUrl(url); } catch { return ""; }
      const key = JSON.stringify([url, kind, audio]);
      const existing = issued.get(key);
      if (existing) return existing;
      if (count >= 20000) throw new RequestError("Service busy", 429);
      const id = crypto.randomBytes(24).toString("base64url");
      data[id] = { url, kind, audio, expires: Date.now() + 15 * 60_000 };
      count++;
      const link = `/api/${kind === "preview" ? "proxy" : "download"}?ticket=${id}`;
      issued.set(key, link);
      return link;
    };
    const output = structuredClone(result);
    output.thumbnail = issue(output.thumbnail, "preview") || "/icon.svg";
    output.formats = output.formats.map(format => ({ ...format, downloadUrl: issue(format.downloadUrl, "download", format.ext === "mp3") })).filter(format => format.downloadUrl);
    const profile = output.profileData;
    if (profile) {
      profile.avatarDownloadUrl = issue(profile.hdAvatarUrl, "download");
      profile.avatarUrl = issue(profile.avatarUrl, "preview") || "/icon.svg";
      profile.hdAvatarUrl = issue(profile.hdAvatarUrl, "preview") || profile.avatarUrl;
      for (const field of ["posts", "stories", "reels"] as const) {
        profile[field] = profile[field].map(item => ({ ...item,
          thumbnail: issue(item.thumbnail, "preview") || "/icon.svg",
          downloadUrl: issue(item.downloadUrl, "download"),
        })).filter(item => item.downloadUrl);
      }
      profile.highlights = [];
    }
    return output;
  });
}
