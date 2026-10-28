import type { Metadata } from "next";
import Link from "next/link";
import { REELSER_DE_PSEO_PAGES } from "@/lib/pseo-de-data";
import { buildHreflangMap } from "@/lib/localeRoutes";
import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { ArrowRight, CheckCircle2, Layers, Sparkles, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "Instagram Reels, Video, Story & Foto Herunterladen (Ohne Wasserzeichen) | Reelser",
  },
  description:
    "Laden Sie Instagram Reels, Videos, Stories (anonym), Highlights, Fotos, Karussells, Profilbilder in HD und MP3-Audio kostenlos herunter – ohne Anmeldung auf iPhone, Android & PC.",
  keywords: [
    "instagram reels herunterladen",
    "instagram video download mp4",
    "instagram story herunterladen anonym",
    "instagram story anonym anschauen",
    "instagram fotos herunterladen hd",
    "instagram in mp3 umwandeln",
    "instagram profilbild vergrößern",
  ],
  alternates: {
    canonical: "https://reelser.com/de",
    languages: buildHreflangMap(),
  },
  openGraph: {
    title: "Instagram Reels, Video & Story Herunterladen (Full HD) | Reelser",
    description:
      "Speichern Sie öffentliche Instagram Reels, Videos, Stories, Fotos und MP3-Audio kostenlos in Originalqualität ohne Wasserzeichen.",
    url: "https://reelser.com/de",
    siteName: "Reelser",
    locale: "de_DE",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Reelser — Instagram Downloader Deutsch" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Reels & Story Herunterladen Kostenlos | Reelser",
    description: "Laden Sie Instagram Reels, Videos und Stories in Originalqualität ohne Wasserzeichen herunter.",
    images: ["/opengraph-image"],
  },
};

export default function GermanHomePage() {
  const pages = Object.values(REELSER_DE_PSEO_PAGES);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://reelser.com/de#webpage",
        url: "https://reelser.com/de",
        inLanguage: "de",
        name: "Instagram Reels, Video, Story & Foto Herunterladen (Ohne Wasserzeichen) | Reelser",
        description:
          "Deutsches All-in-One-Portal zum Herunterladen von Instagram Reels, Videos, Stories, Fotos, MP3-Audio und Profilbildern in Full HD.",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://reelser.com/de#app",
        name: "Reelser — Instagram Downloader Deutsch",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "iOS, Android, Windows, macOS, Linux",
        url: "https://reelser.com/de",
        inLanguage: "de",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://reelser.com/de#faq",
        inLanguage: "de",
        mainEntity: [
          {
            "@type": "Question",
            name: "Ist Reelser komplett kostenlos und ohne Anmeldung nutzbar?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja, Reelser ist zu 100 % kostenlos. Sie müssen sich weder registrieren noch mit Ihrem Instagram-Konto einloggen.",
            },
          },
          {
            "@type": "Question",
            name: "Kann ich Instagram Stories über Reelser anonym anschauen und speichern?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja. Geben Sie einfach den öffentlichen @Benutzernamen ein, um aktuelle Stories und Highlights völlig unsichtbar anzusehen und als MP4 oder JPG herunterzuladen.",
            },
          },
          {
            "@type": "Question",
            name: "Funktioniert der Download auf iPhone (iOS) und Android ohne Zusatz-App?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja, Reelser funktioniert direkt in Safari auf dem iPhone/iPad sowie in Chrome auf Android-Smartphones, Windows und Mac.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div lang="de" className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection
        initialTab="reels"
        customTitle="Instagram Reels, Videos, Stories & Fotos Kostenlos Herunterladen"
        customDescription="Fügen Sie einen Instagram-Link oder @Benutzernamen ein, um Reels ohne Wasserzeichen (1080p MP4), Stories anonym, Karussells, Profilbilder und MP3-Audio zu speichern."
      />

      {/* Direct HTML Cross-Language Crawl Links Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrossLanguageLinksBar currentLocale="de" />
        </div>
      </div>

      {/* German Overview & Core Advantages */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-pink-50/40 via-white to-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reelser Deutschland, Österreich & Schweiz (DACH)</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Ihr Komplettes Instagram-Werkzeug für Originalqualität Ohne Wasserzeichen
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Reelser vereint fünf spezialisierte Instagram-Tools unter einer schnellen, werbearmen Oberfläche: Laden Sie Reels in Full HD (1080p MP4), schauen Sie Stories anonym ohne Konto an, entpacken Sie mehrteilige Foto-Karussells, vergrößern Sie Profilbilder und wandeln Sie Videos in MP3-Audiodateien um.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                100 % Originalqualität (1080p MP4 & JPG)
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Direkter Abruf vom Instagram-CDN ohne Neukodierung, ohne Qualitätsverlust und ohne eingebrannte Wasserzeichen.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Anonym & Ohne Instagram-Login
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Betrachten und speichern Sie Stories, Highlights und Profile per @Benutzername, ohne in der Zuschauerliste aufzutauchen.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Für iPhone, Android, Windows & Mac
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Läuft direkt im Browser (Safari, Chrome, Firefox, Edge) ohne Installation von Apps, Erweiterungen oder APKs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All 15 German Programmatic SEO Tools Directory */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-pink-700">
              <Layers className="w-3.5 h-3.5" />
              <span>Alle Deutschen Instagram-Tools ({pages.length})</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
              Wählen Sie Ihr Spezialisiertes Instagram-Werkzeug
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Direkter Zugriff auf alle deutschen Downloader, Konverter und Schritt-für-Schritt-Anleitungen
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((item) => (
              <Link
                key={item.slug}
                href={`/de/${item.slug}`}
                className="flex flex-col p-5 rounded-2xl bg-gray-50/70 border border-gray-200/80 hover:bg-white hover:border-pink-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider">
                    {item.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                  {item.h1}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.metaDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* German Hub FAQ */}
      <section className="py-12 sm:py-16 bg-gray-50/60 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Häufige Fragen (FAQ)</span>
            </span>
            <h2 className="text-2xl font-black text-gray-900">
              Alles Wichtige zum Instagram Download mit Reelser
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Ist Reelser komplett kostenlos und ohne Anmeldung nutzbar?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ja, Reelser ist zu 100 % kostenlos. Sie müssen sich weder registrieren noch mit Ihrem Instagram-Konto einloggen.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Kann ich Instagram Stories über Reelser anonym anschauen und speichern?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ja. Geben Sie einfach den öffentlichen @Benutzernamen ein, um aktuelle Stories und Highlights völlig unsichtbar anzusehen und als MP4 oder JPG herunterzuladen.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Funktioniert der Download auf iPhone (iOS) und Android ohne Zusatz-App?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ja, Reelser funktioniert direkt in Safari auf dem iPhone/iPad sowie in Chrome auf Android-Smartphones, Windows und Mac.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
