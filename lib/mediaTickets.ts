import crypto from "node:crypto";
import { transaction } from "./storage";
import { validateMediaUrl } from "./safeMedia";
import { RequestError } from "./requestPolicy";
import type { MediaResult } from "./instagramExtractor";
interface Ticket { url: string; kind: "preview" | "download"; audio: boolean; expires: number }
type Tickets = Record<string, Ticket>;
export function readTicket(id: string | null, kind: Ticket["kind"]) {
  if (!id || !/^[\w-]{32}$/.test(id)) throw new RequestError("Invalid media ticket", 403);
  return transaction<Tickets, Ticket>("media-tickets", () => ({}), data => {
    const ticket = data[id];
    if (!ticket || ticket.expires <= Date.now() || ticket.kind !== kind) throw new RequestError("Media link expired. Extract the link again.", 403);
    return ticket;
  });
}
export function authorizeMedia(result: MediaResult): MediaResult {
  return transaction<Tickets, MediaResult>("media-tickets", () => ({}), data => {
    for (const [id, ticket] of Object.entries(data)) if (ticket.expires <= Date.now()) delete data[id];
    if (Object.keys(data).length > 20000) throw new RequestError("Service busy", 429);
    const issue = (url: string, kind: Ticket["kind"], audio = false): string => {
      if (Object.keys(data).length >= 20000) throw new RequestError("Service busy", 429);
      try { validateMediaUrl(url); } catch { return ""; }
      const id = crypto.randomBytes(24).toString("base64url");
      data[id] = { url, kind, audio, expires: Date.now() + 15 * 60_000 };
      return `/api/${kind === "preview" ? "proxy" : "download"}?ticket=${id}`;
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
