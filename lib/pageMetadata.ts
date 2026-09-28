import type { Metadata } from "next";

/** Keep each page's search and sharing metadata tied to its canonical URL. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = new URL(path, "https://reelser.com").href;
  const shareTitle = `${title} | Reelser`;
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
    },
    twitter: { card: "summary", title: shareTitle, description },
  };
}
