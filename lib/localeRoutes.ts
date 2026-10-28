import { Locale } from "./i18n";

export type HubLocale = "en" | "ar" | "es" | "pt" | "fr" | "tr" | "id" | "de" | "ru";

export const HUB_LOCALES: HubLocale[] = ["en", "ar", "es", "pt", "fr", "tr", "id", "de", "ru"];

export function isHubLocale(locale: string): locale is HubLocale {
  return HUB_LOCALES.includes(locale as HubLocale);
}

export interface SlugRow {
  en: string;
  ar: string;
  es: string;
  pt: string;
  fr: string;
  tr: string;
  id: string;
  de: string;
  ru: string;
  categoryHub?: string;
}

export const TRANSLATED_SLUG_MATRIX: SlugRow[] = [
  {
    en: "instagram-reels-without-watermark",
    ar: "instagram-reels-download",
    es: "descargar-reels-instagram",
    pt: "baixar-reels-instagram",
    fr: "telecharger-reel-instagram",
    tr: "instagram-reels-indirme",
    id: "download-reels-ig",
    de: "instagram-reels-herunterladen",
    ru: "skachat-reels-instagram",
    categoryHub: "/reels",
  },
  {
    en: "instagram-to-mp4",
    ar: "instagram-video-downloader",
    es: "descargar-videos-instagram",
    pt: "baixar-videos-instagram",
    fr: "telecharger-video-instagram",
    tr: "instagram-video-indirme",
    id: "download-video-instagram",
    de: "instagram-video-herunterladen",
    ru: "skachat-video-instagram",
  },
  {
    en: "save-instagram-stories",
    ar: "instagram-story-saver",
    es: "descargar-historias-instagram",
    pt: "baixar-stories-instagram",
    fr: "telecharger-story-instagram",
    tr: "instagram-hikaye-indirme",
    id: "download-story-ig",
    de: "instagram-story-herunterladen",
    ru: "skachat-storis-instagram",
    categoryHub: "/story-saver",
  },
  {
    en: "storiesig-viewer",
    ar: "anonymous-story-viewer",
    es: "ver-historias-instagram-anonimo",
    pt: "ver-stories-instagram-anonimo",
    fr: "voir-story-instagram-anonymement",
    tr: "instagram-gizli-hikaye-izleme",
    id: "lihat-story-ig-anonim",
    de: "instagram-story-anonym-anschauen",
    ru: "smotret-storis-anonimno",
  },
  {
    en: "instagram-story-download-with-music",
    ar: "story-download-with-music",
    es: "descargar-historias-con-musica",
    pt: "baixar-stories-com-musica",
    fr: "telecharger-story-instagram-avec-musique",
    tr: "instagram-muzikli-hikaye-indirme",
    id: "download-story-ig-dengan-musik",
    de: "instagram-story-mit-musik-speichern",
    ru: "skachat-storis-s-muzykoj",
  },
  {
    en: "instagram-highlights-download",
    ar: "instagram-highlights-download",
    es: "descargar-destacadas-instagram",
    pt: "baixar-destaques-instagram",
    fr: "telecharger-story-a-la-une-instagram",
    tr: "instagram-one-cikanlar-indirme",
    id: "download-highlight-ig",
    de: "instagram-highlights-herunterladen",
    ru: "skachat-aktualnoe-instagram",
  },
  {
    en: "save-instagram-photos",
    ar: "instagram-photo-download",
    es: "descargar-fotos-instagram",
    pt: "baixar-fotos-instagram",
    fr: "telecharger-photo-instagram",
    tr: "instagram-fotograf-indirme",
    id: "download-foto-ig",
    de: "instagram-fotos-herunterladen",
    ru: "skachat-foto-instagram",
    categoryHub: "/photo-downloader",
  },
  {
    en: "instagram-carousel-download",
    ar: "instagram-carousel-downloader",
    es: "descargar-carrusel-instagram",
    pt: "baixar-carrossel-instagram",
    fr: "telecharger-carrousel-instagram",
    tr: "instagram-coklu-fotograf-indirme",
    id: "download-carousel-ig",
    de: "instagram-karussell-herunterladen",
    ru: "skachat-karusel-instagram",
  },
  {
    en: "instagram-audio-download",
    ar: "instagram-audio-mp3",
    es: "convertir-instagram-a-mp3",
    pt: "converter-instagram-para-mp3",
    fr: "convertir-instagram-en-mp3",
    tr: "instagram-mp3-ses-indirme",
    id: "convert-instagram-ke-mp3",
    de: "instagram-in-mp3-umwandeln",
    ru: "konvertirovat-instagram-v-mp3",
    categoryHub: "/audio-downloader",
  },
  {
    en: "instagram-dp-download",
    ar: "instagram-dp-viewer",
    es: "descargar-foto-perfil-instagram",
    pt: "baixar-foto-perfil-instagram",
    fr: "telecharger-photo-profil-instagram",
    tr: "instagram-profil-fotografi-buyutme",
    id: "download-foto-profil-ig-hd",
    de: "instagram-profilbild-vergroessern-hd",
    ru: "skachat-avatarku-instagram-hd",
    categoryHub: "/profile-downloader",
  },
  {
    en: "instagram-profile-viewer",
    ar: "instagram-profile-viewer",
    es: "visor-perfiles-instagram",
    pt: "visualizador-perfis-instagram",
    fr: "visionneuse-profil-instagram",
    tr: "instagram-profil-goruntuleme",
    id: "lihat-profil-ig-tanpa-login",
    de: "instagram-profil-anschauen-ohne-konto",
    ru: "smotret-profil-instagram-bez-vhoda",
  },
  {
    en: "download-instagram-reels-iphone",
    ar: "download-reels-iphone",
    es: "descargar-reels-iphone",
    pt: "baixar-reels-iphone",
    fr: "telecharger-reel-iphone",
    tr: "iphone-instagram-reels-indirme",
    id: "download-reels-ig-iphone",
    de: "instagram-reels-auf-iphone-speichern",
    ru: "skachat-reels-na-ajfon",
  },
  {
    en: "download-instagram-reels-android",
    ar: "download-reels-android",
    es: "descargar-reels-android",
    pt: "baixar-reels-android",
    fr: "telecharger-reel-android",
    tr: "android-instagram-reels-indirme",
    id: "download-reels-ig-android",
    de: "instagram-reels-auf-android-herunterladen",
    ru: "skachat-reels-na-android",
  },
  {
    en: "reels-download-hd",
    ar: "reels-download-4k-hd",
    es: "descargar-reels-hd-1080p",
    pt: "baixar-reels-hd-1080p",
    fr: "telecharger-reel-hd-1080p",
    tr: "instagram-reels-hd-1080p-indirme",
    id: "download-reels-ig-hd-1080p",
    de: "instagram-reels-hd-1080p-download",
    ru: "skachat-reels-hd-1080p",
  },
  {
    en: "saveinsta-alternative",
    ar: "saveinsta-arabic-alternative",
    es: "alternativa-saveinsta-snapinsta",
    pt: "alternativa-saveinsta-snapinsta",
    fr: "alternative-saveinsta-snapinsta",
    tr: "saveinsta-snapinsta-alternatifi",
    id: "alternatif-saveinsta-snapinsta",
    de: "saveinsta-snapinsta-alternative",
    ru: "analog-saveinsta-snapinsta",
  },
];

function buildLocaleUrl(targetLocale: HubLocale, slug?: string): string {
  if (!slug) {
    return targetLocale === "en" ? "/" : `/${targetLocale}`;
  }
  return targetLocale === "en" ? `/${slug}` : `/${targetLocale}/${slug}`;
}

export function detectPathnameLocale(pathname: string): HubLocale | null {
  if (pathname === "/ar" || pathname.startsWith("/ar/")) return "ar";
  if (pathname === "/es" || pathname.startsWith("/es/")) return "es";
  if (pathname === "/pt" || pathname.startsWith("/pt/")) return "pt";
  if (pathname === "/fr" || pathname.startsWith("/fr/")) return "fr";
  if (pathname === "/tr" || pathname.startsWith("/tr/")) return "tr";
  if (pathname === "/id" || pathname.startsWith("/id/")) return "id";
  if (pathname === "/de" || pathname.startsWith("/de/")) return "de";
  if (pathname === "/ru" || pathname.startsWith("/ru/")) return "ru";
  return null;
}

export interface LanguageAlternateLink {
  code: HubLocale;
  label: string;
  flag: string;
  href: string;
}

/**
 * Returns direct HTML crawl links for all 9 hub languages for a given English slug (or hub root).
 */
export function getEquivalentLanguageLinks(enSlug?: string): LanguageAlternateLink[] {
  const row = enSlug ? TRANSLATED_SLUG_MATRIX.find((r) => r.en === enSlug) : undefined;

  return [
    {
      code: "en",
      label: "English",
      flag: "🇺🇸",
      href: row ? `/${row.en}` : "/",
    },
    {
      code: "ar",
      label: "العربية",
      flag: "🇸🇦",
      href: row ? `/ar/${row.ar}` : "/ar",
    },
    {
      code: "es",
      label: "Español",
      flag: "🇪🇸",
      href: row ? `/es/${row.es}` : "/es",
    },
    {
      code: "pt",
      label: "Português",
      flag: "🇧🇷",
      href: row ? `/pt/${row.pt}` : "/pt",
    },
    {
      code: "fr",
      label: "Français",
      flag: "🇫🇷",
      href: row ? `/fr/${row.fr}` : "/fr",
    },
    {
      code: "de",
      label: "Deutsch",
      flag: "🇩🇪",
      href: row ? `/de/${row.de}` : "/de",
    },
    {
      code: "tr",
      label: "Türkçe",
      flag: "🇹🇷",
      href: row ? `/tr/${row.tr}` : "/tr",
    },
    {
      code: "id",
      label: "Indonesia",
      flag: "🇮🇩",
      href: row ? `/id/${row.id}` : "/id",
    },
    {
      code: "ru",
      label: "Русский",
      flag: "🇷🇺",
      href: row ? `/ru/${row.ru}` : "/ru",
    },
  ];
}

/**
 * Builds a 9-way hreflang map for Next.js metadata alternates.languages.
 */
export function buildHreflangMap(enSlug?: string): Record<string, string> {
  const row = enSlug ? TRANSLATED_SLUG_MATRIX.find((r) => r.en === enSlug) : undefined;
  if (enSlug && !row) {
    return {
      en: `https://reelser.com/${enSlug}`,
      "x-default": `https://reelser.com/${enSlug}`,
    };
  }
  return {
    en: row ? `https://reelser.com/${row.en}` : "https://reelser.com",
    ar: row ? `https://reelser.com/ar/${row.ar}` : "https://reelser.com/ar",
    es: row ? `https://reelser.com/es/${row.es}` : "https://reelser.com/es",
    pt: row ? `https://reelser.com/pt/${row.pt}` : "https://reelser.com/pt",
    fr: row ? `https://reelser.com/fr/${row.fr}` : "https://reelser.com/fr",
    de: row ? `https://reelser.com/de/${row.de}` : "https://reelser.com/de",
    tr: row ? `https://reelser.com/tr/${row.tr}` : "https://reelser.com/tr",
    id: row ? `https://reelser.com/id/${row.id}` : "https://reelser.com/id",
    ru: row ? `https://reelser.com/ru/${row.ru}` : "https://reelser.com/ru",
    "x-default": row ? `https://reelser.com/${row.en}` : "https://reelser.com",
  };
}

export function resolveLocalizedPath(currentPathname: string, targetLocale: Locale): string | null {
  const cleanPath = (currentPathname || "/").replace(/\/+$/, "") || "/";
  const effectiveTarget: HubLocale = isHubLocale(targetLocale) ? targetLocale : "en";
  const currentPathLocale = detectPathnameLocale(cleanPath);

  // 1. Check if on home or language hub root (/, /ar, /es, /pt, /fr, /tr, /id, /de, /ru)
  if (
    cleanPath === "/" ||
    cleanPath === "/ar" ||
    cleanPath === "/es" ||
    cleanPath === "/pt" ||
    cleanPath === "/fr" ||
    cleanPath === "/tr" ||
    cleanPath === "/id" ||
    cleanPath === "/de" ||
    cleanPath === "/ru"
  ) {
    return buildLocaleUrl(effectiveTarget);
  }

  // 2. Check if on one of the 5 category hubs (/reels, /story-saver, etc.)
  const categoryMatch = TRANSLATED_SLUG_MATRIX.find((row) => row.categoryHub === cleanPath);
  if (categoryMatch) {
    if (effectiveTarget === "en") return cleanPath;
    return buildLocaleUrl(effectiveTarget, categoryMatch[effectiveTarget]);
  }

  // 3. Check if on a localized subpage (/ar/[slug], /es/[slug], /pt/[slug], /fr/[slug], /tr/[slug], /id/[slug], /de/[slug], /ru/[slug])
  if (currentPathLocale) {
    const subSlug = cleanPath.slice(`/${currentPathLocale}/`.length);
    const rowMatch = TRANSLATED_SLUG_MATRIX.find((row) => row[currentPathLocale] === subSlug);
    if (rowMatch) {
      return buildLocaleUrl(effectiveTarget, rowMatch[effectiveTarget]);
    }
    return buildLocaleUrl(effectiveTarget);
  }

  // 4. Check if on an English pSEO subpage (/[slug])
  const enSlug = cleanPath.slice(1);
  const enRowMatch = TRANSLATED_SLUG_MATRIX.find((row) => row.en === enSlug);
  if (enRowMatch) {
    return buildLocaleUrl(effectiveTarget, enRowMatch[effectiveTarget]);
  }

  // 5. Fallback for English-only pSEO pages when switching to ar/es/pt/fr/tr/id/de/ru
  if (effectiveTarget !== "en") {
    return buildLocaleUrl(effectiveTarget);
  }

  return null;
}
