import { MetadataRoute } from "next";
import { REELSER_PSEO_PAGES } from "@/lib/pseo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://reelser.com";
  const now = new Date();

  const coreRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/reels", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/story-saver", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/photo-downloader", priority: 0.85, changeFrequency: "daily" as const },
    { path: "/audio-downloader", priority: 0.85, changeFrequency: "daily" as const },
    { path: "/profile-downloader", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/dmca", priority: 0.3, changeFrequency: "monthly" as const },
  ];

  const pseoRoutes = Object.keys(REELSER_PSEO_PAGES).map((slug) => ({
    path: `/${slug}`,
    priority: 0.85,
    changeFrequency: "weekly" as const,
  }));

  return [...coreRoutes, ...pseoRoutes].map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
