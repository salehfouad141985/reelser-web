import type { MediaResult, ProfileData, ProfileMediaItem } from "./instagramExtractor";
import { RequestError } from "./requestPolicy";
import { authorizeMedia } from "./mediaTickets";
import { validateMediaUrl } from "./safeMedia";

export type ProfileSection = "posts" | "reels" | "stories";
export interface ProfilePage { items: ProfileMediaItem[]; nextCursor: string | null }
const unavailable = () => new RequestError("Media source unavailable. Try again later. / مصدر الوسائط غير متاح حاليًا", 503);

export function sourceEnabled() {
  const mode = process.env.REELSER_PROFILE_SOURCE || "legacy";
  if (!["legacy", "selfHosted"].includes(mode)) throw unavailable();
  return mode === "selfHosted";
}

export function validateProfileQuery(username: unknown, section: unknown, cursor: unknown) {
  if (typeof username !== "string" || !/^[a-zA-Z0-9._]{1,30}$/.test(username) ||
    !["posts", "reels", "stories"].includes(String(section)) ||
    (cursor !== undefined && cursor !== null && (typeof cursor !== "string" || cursor.length > 4096)) ||
    (section === "stories" && cursor)) throw new RequestError("Invalid profile request", 400);
  return { username: username.toLowerCase(), section: section as ProfileSection, cursor: (cursor || null) as string | null };
}

async function sourceRequest(username: string, section: ProfileSection | "profile", signal: AbortSignal, cursor?: string | null): Promise<Record<string, unknown>> {
  const secret = process.env.REELSER_SOURCE_TOKEN || "";
  const raw = process.env.REELSER_SOURCE_URL || "";
  if (secret.length < 32 || !raw) throw unavailable();
  let base: URL;
  try { base = new URL(raw); } catch { throw unavailable(); }
  // This is an operator-configured service address, never a visitor-supplied URL.
  // Cleartext transport is limited to loopback; remote deployments require TLS.
  if (base.username || base.password || base.search || base.hash ||
    (base.protocol !== "https:" && !(base.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(base.hostname)))) throw unavailable();
  let response: Response;
  try {
    response = await fetch(new URL("v1/profile", base.href.endsWith("/") ? base : base.href + "/"), {
      method: "POST", headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ username, section, cursor }), cache: "no-store", redirect: "error",
      signal: AbortSignal.any([signal, AbortSignal.timeout(22000)]),
    });
  } catch { signal.throwIfAborted(); throw unavailable(); }
  if (!response.ok) {
    await response.body?.cancel();
    if (response.status === 429) throw new RequestError("Media source is busy. Try again later. / مصدر الوسائط مشغول، حاول لاحقًا", 429);
    if (response.status === 403) throw new RequestError("Only public profiles are supported. / الحسابات العامة فقط مدعومة", 403);
    if (response.status === 400) throw new RequestError("Page link expired or invalid. Search the profile again. / أعد البحث عن الحساب لتحديث النتائج", 400);
    throw unavailable();
  }
  const reader = response.body?.getReader();
  if (!reader) throw unavailable();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      signal.throwIfAborted();
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 2 * 1024 * 1024) { await reader.cancel(); throw unavailable(); }
      chunks.push(value);
    }
    const result: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!result || typeof result !== "object" || Array.isArray(result)) throw unavailable();
    return result as Record<string, unknown>;
  } finally { reader.releaseLock(); }
}

function stringField(value: unknown, max = 10000): string {
  if (typeof value !== "string" || value.length > max) throw unavailable();
  return value;
}

export async function getSourcePage(username: string, section: ProfileSection, signal: AbortSignal, cursor?: string | null): Promise<ProfilePage> {
  const query = validateProfileQuery(username, section, cursor);
  const data = await sourceRequest(query.username, query.section, signal, query.cursor);
  if (!Array.isArray(data.items) || data.items.length > 300 ||
    (data.nextCursor !== null && (typeof data.nextCursor !== "string" || !data.nextCursor || data.nextCursor.length > 4096)) ||
    (data.nextCursor && data.nextCursor === cursor) || (section === "stories" && data.nextCursor)) throw unavailable();
  const items: ProfileMediaItem[] = data.items.map(item => {
    if (!item || typeof item !== "object" || !["video", "image"].includes(item.type) || (section === "reels" && item.type !== "video")) throw unavailable();
    const id = stringField(item.id, 200);
    const url = stringField(item.downloadUrl);
    if (!id) throw unavailable();
    // Keep existing URL/DNS/redirect protections for every source-provided asset.
    try { validateMediaUrl(url); } catch { throw unavailable(); }
    return { id, type: item.type, thumbnail: stringField(item.thumbnail), downloadUrl: url,
      caption: stringField(item.caption ?? ""), likes: stringField(item.likes ?? "", 100),
      comments: stringField(item.comments ?? "", 100), timestamp: stringField(item.timestamp ?? "", 100),
      isVideo: item.type === "video" };
  });
  return { items: [...new Map(items.map(item => [item.id, item])).values()], nextCursor: data.nextCursor as string | null };
}

export function pageResult(username: string, section: ProfileSection, page: ProfilePage, profile?: ProfileData): MediaResult {
  const data: ProfileData = profile || { username, fullName: username, avatarUrl: "", hdAvatarUrl: "",
    postsCount: "", followersCount: "", followingCount: "", biography: "", posts: [], reels: [], stories: [], highlights: [] };
  data[section] = page.items;
  return { url: `https://www.instagram.com/${username}/`, title: `@${username}`, author: `@${username}`,
    platform: "Instagram", thumbnail: data.avatarUrl, isProfile: true, profileData: data,
    formats: page.items.map(item => ({ formatId: item.id, quality: item.type === "video" ? "Video" : "Photo",
      ext: item.type === "video" ? "mp4" : "jpg", type: item.type, downloadUrl: item.downloadUrl })) };
}

export function authorizePage(username: string, section: ProfileSection, page: ProfilePage): ProfilePage {
  const result = authorizeMedia(pageResult(username, section, page));
  return { items: result.profileData![section], nextCursor: page.nextCursor };
}

export async function extractSelfHostedProfile(username: string, section: ProfileSection, signal: AbortSignal): Promise<MediaResult> {
  const query = validateProfileQuery(username, section, null);
  const response = await sourceRequest(query.username, "profile", signal);
  const raw = response.profile;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw unavailable();
  const fields = raw as Record<string, unknown>;
  if (fields.username !== query.username) throw unavailable();
  const profile: ProfileData = { username: query.username, fullName: stringField(fields.fullName),
    avatarUrl: stringField(fields.avatarUrl), hdAvatarUrl: stringField(fields.hdAvatarUrl),
    postsCount: stringField(fields.postsCount), followersCount: stringField(fields.followersCount),
    followingCount: stringField(fields.followingCount), biography: stringField(fields.biography),
    isVerified: fields.isVerified === true, posts: [], reels: [], stories: [], highlights: [],
    source: "selfHosted", initialSection: section, pagination: {
      posts: { loaded: false, cursor: null }, reels: { loaded: false, cursor: null }, stories: { loaded: false, cursor: null },
    } };
  const page = await getSourcePage(query.username, section, signal);
  profile.pagination![section] = { loaded: true, cursor: page.nextCursor };
  const result = pageResult(query.username, section, page, profile);
  if (profile.hdAvatarUrl) result.formats.push({ formatId: "avatar", quality: "Profile picture", ext: "jpg", type: "image", downloadUrl: profile.hdAvatarUrl });
  return result;
}
