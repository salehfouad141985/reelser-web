import type { ProfileMediaItem } from "./instagramExtractor";
export type Section = "posts" | "reels" | "stories";
export async function requestProfilePage(username: string, section: Section, cursor: string | null, signal: AbortSignal, request: typeof fetch = fetch) {
  const response = await request("/api/profile-media", { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, section, cursor }), cache: "no-store", signal });
  const body = await response.json();
  if (!response.ok || body?.success !== true) throw new Error(typeof body?.error === "string" ? body.error : "Could not load more results. Try again.");
  const data = body.data;
  if (!data || !Array.isArray(data.items) || data.items.length > 300 ||
    (data.nextCursor !== null && (typeof data.nextCursor !== "string" || !data.nextCursor || data.nextCursor.length > 4096)) ||
    (cursor && data.nextCursor === cursor) || data.items.some((item: ProfileMediaItem) => !item || typeof item.id !== "string" ||
      !["image", "video"].includes(item.type) || !/^\/api\/download\?ticket=[\w-]{32}$/.test(item.downloadUrl) ||
      !(item.thumbnail === "/icon.svg" || /^\/api\/proxy\?ticket=[\w-]{32}$/.test(item.thumbnail)))) {
    throw new Error("Could not load more results. Try again.");
  }
  return data as { items: ProfileMediaItem[]; nextCursor: string | null };
}

export function mergeProfileItems(previous: ProfileMediaItem[], incoming: ProfileMediaItem[]) {
  return [...new Map([...previous, ...incoming].map(item => [item.id, item])).values()];
}
