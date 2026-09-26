import { REELSER_PSEO_PAGES } from "./pseo-data";
export function canonicalPath(slug: string) {
  const page = REELSER_PSEO_PAGES[slug];
  if (!page) return `/${slug}`;
  return ({ reels: "/reels", story: "/story-saver", photo: "/photo-downloader", audio: "/audio-downloader", profile: "/profile-downloader" })[page.category];
}
