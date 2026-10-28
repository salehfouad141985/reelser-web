import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { REELSER_ID_PSEO_PAGES } from "@/lib/pseo-id-data";
import { buildHreflangMap } from "@/lib/localeRoutes";
import { HeroSection } from "@/components/HeroSection";
import { PseoIndonesianContent } from "@/components/PseoIndonesianContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(REELSER_ID_PSEO_PAGES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = REELSER_ID_PSEO_PAGES[slug];

  if (!config) {
    return {
      title: "Halaman Tidak Ditemukan",
    };
  }

  const url = `https://reelser.com/id/${slug}`;
  const enUrl = `https://reelser.com/${config.enSlug}`;
  const arUrl = `https://reelser.com/ar/${config.arSlug}`;
  const esUrl = `https://reelser.com/es/${config.esSlug}`;
  const ptUrl = `https://reelser.com/pt/${config.ptSlug}`;
  const frUrl = `https://reelser.com/fr/${config.frSlug}`;
  const trUrl = `https://reelser.com/tr/${config.trSlug}`;
  const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: config.metaTitle };

  return {
    title: {
      absolute: config.metaTitle,
    },
    description: config.metaDescription,
    keywords: config.keywords,
    alternates: {
      canonical: url,
      languages: buildHreflangMap(config.enSlug),
    },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url,
      siteName: "Reelser",
      locale: "id_ID",
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

export default async function IndonesianPseoPage({ params }: PageProps) {
  const { slug } = await params;
  const config = REELSER_ID_PSEO_PAGES[slug];

  if (!config) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://reelser.com/id/${slug}#webpage`,
        url: `https://reelser.com/id/${slug}`,
        inLanguage: "id",
        name: config.metaTitle,
        description: config.metaDescription,
        breadcrumb: {
          "@id": `https://reelser.com/id/${slug}#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://reelser.com/id/${slug}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Beranda (Indonesia)",
            item: "https://reelser.com/id",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: config.h1,
            item: `https://reelser.com/id/${slug}`,
          },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://reelser.com/id/${slug}#app`,
        name: config.h1,
        url: `https://reelser.com/id/${slug}`,
        inLanguage: "id",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "All (iOS, Android, Windows, macOS, Linux)",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "HowTo",
        "@id": `https://reelser.com/id/${slug}#howto`,
        inLanguage: "id",
        name: config.howToTitle,
        step: config.howToSteps.map((step, idx) => ({
          "@type": "HowToStep",
          position: idx + 1,
          name: step.title,
          text: step.desc,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `https://reelser.com/id/${slug}#faq`,
        inLanguage: "id",
        mainEntity: config.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <div lang="id">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection
        initialTab={config.category}
        customTitle={config.h1}
        customDescription={config.metaDescription}
      />
      <PseoIndonesianContent config={config} />
    </div>
  );
}
