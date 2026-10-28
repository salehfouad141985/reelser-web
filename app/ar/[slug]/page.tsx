import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { REELSER_AR_PSEO_PAGES } from "@/lib/pseo-ar-data";
import { buildHreflangMap } from "@/lib/localeRoutes";
import { HeroSection } from "@/components/HeroSection";
import { PseoArabicContent } from "@/components/PseoArabicContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(REELSER_AR_PSEO_PAGES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const config = REELSER_AR_PSEO_PAGES[slug];

  if (!config) {
    return {
      title: "الصفحة غير موجودة",
    };
  }

  const url = `https://reelser.com/ar/${slug}`;
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
      locale: "ar_SA",
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

export default async function ArabicPseoPage({ params }: PageProps) {
  const { slug } = await params;
  const config = REELSER_AR_PSEO_PAGES[slug];

  if (!config) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://reelser.com/ar/${slug}#webpage`,
        url: `https://reelser.com/ar/${slug}`,
        inLanguage: "ar",
        name: config.metaTitle,
        description: config.metaDescription,
        breadcrumb: {
          "@id": `https://reelser.com/ar/${slug}#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://reelser.com/ar/${slug}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "الرئيسية (العربية)",
            item: "https://reelser.com/ar",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: config.h1,
            item: `https://reelser.com/ar/${slug}`,
          },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://reelser.com/ar/${slug}#app`,
        name: config.h1,
        url: `https://reelser.com/ar/${slug}`,
        inLanguage: "ar",
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
        "@id": `https://reelser.com/ar/${slug}#howto`,
        inLanguage: "ar",
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
        "@id": `https://reelser.com/ar/${slug}#faq`,
        inLanguage: "ar",
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
    <div dir="rtl" lang="ar">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection
        initialTab={config.category}
        customTitle={config.h1}
        customDescription={config.metaDescription}
      />
      <PseoArabicContent config={config} />
    </div>
  );
}
