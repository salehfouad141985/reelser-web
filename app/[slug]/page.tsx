import type { Metadata } from "next";
import { canonicalPath } from "@/lib/pseoCanonical";
import { notFound, permanentRedirect } from "next/navigation";
import { REELSER_PSEO_PAGES } from "@/lib/pseo-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(REELSER_PSEO_PAGES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = REELSER_PSEO_PAGES[slug];

  if (!config) {
    return {
      title: "Page Not Found",
    };
  }

  const url = `https://reelser.com${canonicalPath(slug)}`;
  const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: config.metaTitle };

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url,
      siteName: "Reelser",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: config.metaTitle,
      description: config.metaDescription,
      images: ["/opengraph-image"],
    },
  };
}

export default async function PseoPage({ params }: PageProps) {
  const { slug } = await params;
  const config = REELSER_PSEO_PAGES[slug];

  if (!config) {
    notFound();
  }

  permanentRedirect(canonicalPath(slug));
}
