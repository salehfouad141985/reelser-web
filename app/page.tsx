import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

export default function HomePage() {
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://reelser.com/#application",
        name: "Reelser - Instagram Reels, Story, Photo & Audio Downloader",
        url: "https://reelser.com",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "All (iOS, Android, Windows, macOS, Linux)",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://reelser.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is Reelser completely free to use?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Reelser is 100% free with fair usage limits to keep the service fast and reliable for everyone. No subscription or account registration is needed.",
            },
          },
          {
            "@type": "Question",
            name: "Does Reelser work on iPhone and Android without an app?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, Reelser runs directly inside any mobile or desktop browser including Safari on iPhone/iPad, Chrome on Android, Mac, and Windows PC.",
            },
          },
          {
            "@type": "Question",
            name: "What types of Instagram media can I download with Reelser?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can download public Instagram Reels in MP4, 24-hour Stories, Highlights, single or multi-slide Carousel Photos, full-size HD Profile Pictures (DP), and MP3 Audio tracks.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <HeroSection initialTab="reels" />
      <div className="bg-gray-50 border-b border-gray-100 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrossLanguageLinksBar currentLocale="en" />
        </div>
      </div>
      <FeaturesSection />
      <HowToSection />
      <FaqSection />
    </>
  );
}
