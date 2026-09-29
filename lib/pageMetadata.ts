import type { Metadata } from "next";

/** Keep each page's search and sharing metadata tied to its canonical URL. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = new URL(path, "https://reelser.com").href;
  const shareTitle = `${title} | Reelser`;
  const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: shareTitle };
  return {
    title,
    description,
    alternates: { canonical: url },
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
