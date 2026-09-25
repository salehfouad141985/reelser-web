import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { REELSER_PSEO_PAGES } from "@/lib/pseo-data";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

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

  const url = `https://reelser.com/${slug}`;

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
    },
    twitter: {
      card: "summary_large_image",
      title: config.metaTitle,
      description: config.metaDescription,
    },
  };
}

export default async function PseoPage({ params }: PageProps) {
  const { slug } = await params;
  const config = REELSER_PSEO_PAGES[slug];

  if (!config) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://reelser.com/${slug}#webpage`,
        url: `https://reelser.com/${slug}`,
        name: config.metaTitle,
        description: config.metaDescription,
      },
      {
        "@type": "WebApplication",
        "@id": `https://reelser.com/${slug}#app`,
        name: config.h1,
        url: `https://reelser.com/${slug}`,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "All (iOS, Android, Windows, macOS)",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  const otherPages = Object.values(REELSER_PSEO_PAGES)
    .filter((p) => p.slug !== slug)
    .slice(0, 12);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection
        initialTab={config.category}
        customTitle={config.h1}
        customDescription={config.metaDescription}
      />
      <FeaturesSection />
      <HowToSection />

      {/* SEO Topic Cloud & Internal Cross-Links */}
      <section className="py-12 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-lg font-bold text-gray-900">
              Related Instagram Tools & Searches
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Explore specialized media extraction utilities for Instagram
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {otherPages.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-700 hover:text-pink-600 hover:border-pink-300 hover:shadow-xs transition-all"
              >
                {item.h1}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />
    </>
  );
}
