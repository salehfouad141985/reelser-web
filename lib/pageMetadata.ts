import type { Metadata } from "next";
import { TRANSLATED_SLUG_MATRIX } from "./localeRoutes";

/** Keep each page's search and sharing metadata tied to its canonical URL and localized equivalents. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = new URL(path, "https://reelser.com").href;
  const shareTitle = `${title} | Reelser`;
  const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: shareTitle };
  const hubRow = TRANSLATED_SLUG_MATRIX.find((r) => r.categoryHub === path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      ...(hubRow
        ? {
            languages: {
              en: url,
              ar: `https://reelser.com/ar/${hubRow.ar}`,
              es: `https://reelser.com/es/${hubRow.es}`,
              pt: `https://reelser.com/pt/${hubRow.pt}`,
              fr: `https://reelser.com/fr/${hubRow.fr}`,
              de: `https://reelser.com/de/${hubRow.de}`,
              tr: `https://reelser.com/tr/${hubRow.tr}`,
              id: `https://reelser.com/id/${hubRow.id}`,
              ru: `https://reelser.com/ru/${hubRow.ru}`,
              "x-default": url,
            },
          }
        : {}),
    },
    openGraph: {
      title: shareTitle,
      description,
      url,
      siteName: "Reelser",
      locale: "en_US",
      type: "website",
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: ["/opengraph-image"] },
  };
}
