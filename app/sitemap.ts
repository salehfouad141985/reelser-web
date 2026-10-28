import { MetadataRoute } from "next";
import { REELSER_PSEO_PAGES } from "@/lib/pseo-data";
import { REELSER_AR_PSEO_PAGES } from "@/lib/pseo-ar-data";
import { REELSER_ES_PSEO_PAGES } from "@/lib/pseo-es-data";
import { REELSER_PT_PSEO_PAGES } from "@/lib/pseo-pt-data";
import { REELSER_FR_PSEO_PAGES } from "@/lib/pseo-fr-data";
import { REELSER_TR_PSEO_PAGES } from "@/lib/pseo-tr-data";
import { REELSER_ID_PSEO_PAGES } from "@/lib/pseo-id-data";
import { REELSER_DE_PSEO_PAGES } from "@/lib/pseo-de-data";
import { REELSER_RU_PSEO_PAGES } from "@/lib/pseo-ru-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://reelser.com";

  const coreRoutes = [
    { path: "", priority: 1.0, changeFrequency: "daily" as const },
    { path: "/ar", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/es", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/pt", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/fr", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/tr", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/id", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/de", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/ru", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/reels", priority: 0.95, changeFrequency: "daily" as const },
    { path: "/story-saver", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/photo-downloader", priority: 0.85, changeFrequency: "daily" as const },
    { path: "/audio-downloader", priority: 0.85, changeFrequency: "daily" as const },
    { path: "/profile-downloader", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "monthly" as const },
    { path: "/dmca", priority: 0.3, changeFrequency: "monthly" as const },
  ];

  const coreEntries: MetadataRoute.Sitemap = coreRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const pseoEntries: MetadataRoute.Sitemap = Object.keys(REELSER_PSEO_PAGES).map((slug) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const arPseoEntries: MetadataRoute.Sitemap = Object.keys(REELSER_AR_PSEO_PAGES).map((slug) => ({
    url: `${baseUrl}/ar/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const esPseoEntries: MetadataRoute.Sitemap = Object.keys(REELSER_ES_PSEO_PAGES).map((slug) => ({
    url: `${baseUrl}/es/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const ptPseoEntries: MetadataRoute.Sitemap = Object.keys(REELSER_PT_PSEO_PAGES).map((slug) => ({
    url: `${baseUrl}/pt/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const frPseoEntries: MetadataRoute.Sitemap = Object.keys(REELSER_FR_PSEO_PAGES).map((slug) => ({
    url: `${baseUrl}/fr/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const trPseoEntries: MetadataRoute.Sitemap = Object.keys(REELSER_TR_PSEO_PAGES).map((slug) => ({
    url: `${baseUrl}/tr/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const idPseoEntries: MetadataRoute.Sitemap = Object.keys(REELSER_ID_PSEO_PAGES).map((slug) => ({
    url: `${baseUrl}/id/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const dePseoEntries: MetadataRoute.Sitemap = Object.keys(REELSER_DE_PSEO_PAGES).map((slug) => ({
    url: `${baseUrl}/de/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const ruPseoEntries: MetadataRoute.Sitemap = Object.keys(REELSER_RU_PSEO_PAGES).map((slug) => ({
    url: `${baseUrl}/ru/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [
    ...coreEntries,
    ...pseoEntries,
    ...arPseoEntries,
    ...esPseoEntries,
    ...ptPseoEntries,
    ...frPseoEntries,
    ...trPseoEntries,
    ...idPseoEntries,
    ...dePseoEntries,
    ...ruPseoEntries,
  ];
}
