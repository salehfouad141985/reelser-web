import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { REELSER_DE_PSEO_PAGES } from "@/lib/pseo-de-data";
import { buildHreflangMap } from "@/lib/localeRoutes";
import { HeroSection } from "@/components/HeroSection";
import { PseoGermanContent } from "@/components/PseoGermanContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(REELSER_DE_PSEO_PAGES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = REELSER_DE_PSEO_PAGES[slug];

  if (!config) {
    return {
      title: "Seite nicht gefunden",
    };
  }

  const url = `https://reelser.com/de/${slug}`;
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
      locale: "de_DE",
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

export default async function GermanPseoPage({ params }: PageProps) {
  const { slug } = await params;
  const config = REELSER_DE_PSEO_PAGES[slug];

  if (!config) {
    notFound();
  }

  const url = `https://reelser.com/de/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        inLanguage: "de",
        name: config.metaTitle,
        description: config.metaDescription,
        breadcrumb: {
          "@id": `${url}#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Startseite (Deutsch)",
            item: "https://reelser.com/de",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: config.h1,
            item: url,
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        name: `${config.h1} | Reelser`,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "iOS, Android, Windows, macOS, Linux",
        url,
        inLanguage: "de",
        description: config.metaDescription,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
        featureList: config.benefits.map((b) => b.title),
      },
      {
        "@type": "HowTo",
        "@id": `${url}#howto`,
        inLanguage: "de",
        name: config.stepsTitle,
        description: config.subtitle,
        step: config.steps.map((s, idx) => ({
          "@type": "HowToStep",
          position: idx + 1,
          name: s.title,
          text: s.description,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: "de",
        mainEntity: config.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection
        initialTab={config.category}
        customTitle={config.h1}
        customDescription={config.subtitle}
      />
      <PseoGermanContent config={config} />
    </>
  );
}
