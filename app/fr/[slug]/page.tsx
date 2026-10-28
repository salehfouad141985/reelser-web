import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { REELSER_FR_PSEO_PAGES } from "@/lib/pseo-fr-data";
import { buildHreflangMap } from "@/lib/localeRoutes";
import { HeroSection } from "@/components/HeroSection";
import { PseoFrenchContent } from "@/components/PseoFrenchContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(REELSER_FR_PSEO_PAGES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = REELSER_FR_PSEO_PAGES[slug];

  if (!config) {
    return {
      title: "Page introuvable",
    };
  }

  const url = `https://reelser.com/fr/${slug}`;
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
      locale: "fr_FR",
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

export default async function FrenchPseoPage({ params }: PageProps) {
  const { slug } = await params;
  const config = REELSER_FR_PSEO_PAGES[slug];

  if (!config) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://reelser.com/fr/${slug}#webpage`,
        url: `https://reelser.com/fr/${slug}`,
        inLanguage: "fr",
        name: config.metaTitle,
        description: config.metaDescription,
        breadcrumb: {
          "@id": `https://reelser.com/fr/${slug}#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://reelser.com/fr/${slug}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil (Français)",
            item: "https://reelser.com/fr",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: config.h1,
            item: `https://reelser.com/fr/${slug}`,
          },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://reelser.com/fr/${slug}#app`,
        name: config.h1,
        url: `https://reelser.com/fr/${slug}`,
        inLanguage: "fr",
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
        "@id": `https://reelser.com/fr/${slug}#howto`,
        inLanguage: "fr",
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
        "@id": `https://reelser.com/fr/${slug}#faq`,
        inLanguage: "fr",
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
    <div lang="fr">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection
        initialTab={config.category}
        customTitle={config.h1}
        customDescription={config.metaDescription}
      />
      <PseoFrenchContent config={config} />
    </div>
  );
}
