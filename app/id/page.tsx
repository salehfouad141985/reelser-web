import type { Metadata } from "next";
import Link from "next/link";
import { REELSER_ID_PSEO_PAGES } from "@/lib/pseo-id-data";
import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { ArrowRight, CheckCircle2, Layers, Sparkles, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "Download Reels IG, Video & Story Instagram Tanpa Watermark Gratis | Reelser",
  },
  description:
    "Download video Reels IG tanpa watermark, video MP4, Story IG anonim, foto carousel, dan lagu MP3 dalam kualitas asli Full HD 1080p. Gratis dan tanpa login.",
  keywords: [
    "download reels ig",
    "download video instagram",
    "download story ig tanpa login",
    "lihat story ig tanpa ketahuan",
    "convert instagram ke mp3",
    "download foto profil ig hd",
  ],
  alternates: {
    canonical: "https://reelser.com/id",
    languages: {
      id: "https://reelser.com/id",
      en: "https://reelser.com",
      ar: "https://reelser.com/ar",
      es: "https://reelser.com/es",
      pt: "https://reelser.com/pt",
      fr: "https://reelser.com/fr",
      tr: "https://reelser.com/tr",
      de: "https://reelser.com/de",
      ru: "https://reelser.com/ru",
      "x-default": "https://reelser.com",
    },
  },
  openGraph: {
    title: "Download Reels IG, Video & Story Instagram Gratis (Full HD) | Reelser",
    description:
      "Simpan Reels, Video, Story, Foto, dan Audio MP3 Instagram langsung ke HP atau PC dalam kualitas asli.",
    url: "https://reelser.com/id",
    siteName: "Reelser",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Reelser — Pengunduh Instagram" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Download Reels & Video Instagram Gratis | Reelser",
    description: "Download Reels, Story, dan foto Instagram dalam kualitas asli tanpa watermark.",
    images: ["/opengraph-image"],
  },
};

export default function IndonesianHomePage() {
  const pages = Object.values(REELSER_ID_PSEO_PAGES);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://reelser.com/id#webpage",
        url: "https://reelser.com/id",
        inLanguage: "id",
        name: "Download Reels IG, Video & Story Instagram Gratis | Reelser",
        description:
          "Platform online gratis untuk mengunduh Reels, video, story, foto, dan audio MP3 dari akun Instagram publik.",
      },
      {
        "@type": "WebApplication",
        "@id": "https://reelser.com/id#app",
        name: "Reelser Indonesia - Pengunduh Video & Reels Instagram",
        url: "https://reelser.com/id",
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
        "@type": "FAQPage",
        "@id": "https://reelser.com/id#faq",
        inLanguage: "id",
        mainEntity: [
          {
            "@type": "Question",
            name: "Bagaimana cara download Reels IG tanpa watermark?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Salin link Reels dari aplikasi Instagram, tempel ke kotak pencarian Reelser, lalu klik 'Unduh Video (MP4)' untuk menyimpannya dalam kualitas Full HD 1080p tanpa watermark.",
            },
          },
          {
            "@type": "Question",
            name: "Bisakah saya melihat dan mengunduh Story IG tanpa ketahuan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Bisa. Ketik @username profil publik mana pun untuk menonton dan mengunduh story aktif maupun highlight tanpa login dan tanpa muncul di daftar penonton.",
            },
          },
          {
            "@type": "Question",
            name: "Apakah Reelser berfungsi di HP Android dan iPhone tanpa aplikasi?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ya, Reelser berjalan langsung melalui browser Chrome di Android dan Safari di iPhone/iPad tanpa perlu menginstal aplikasi tambahan.",
            },
          },
        ],
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
        initialTab="reels"
        customTitle="Download Reels IG, Video & Story Instagram Gratis"
        customDescription="Simpan video Reels MP4 Full HD, Story anonim, Foto carousel, dan Audio MP3 dalam kualitas asli tanpa watermark dan tanpa login."
      />

      <div className="bg-gray-50 border-b border-gray-100 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrossLanguageLinksBar currentLocale="id" />
        </div>
      </div>

      {/* Indonesian Value Propositions */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-pink-50/40 via-white to-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Paket Lengkap Pengunduh Instagram</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900">
              Semua Alat Download Instagram dalam Satu Tempat
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Tanpa instal aplikasi atau ekstensi: Reelser terhubung langsung ke server sumber untuk memberikan hasil unduhan yang bersih, cepat, dan aman.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Kualitas Asli 1080p Tanpa Watermark
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Unduh file MP4 dan JPG asli tanpa kompresi tambahan dan tanpa tempelan logo.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Lihat Story Anonim dengan @username
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tonton dan simpan story harian serta highlight dari akun publik secara 100% rahasia.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Konverter Reels ke MP3 Terintegrasi
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ekstrak musik atau suara dari video Reels mana pun ke format MP3 siap dengar secara offline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Indonesian Tools Directory (All 15 Indonesian pSEO Pages) */}
      <section className="py-12 sm:py-16 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-pink-700 border border-pink-100">
              <Layers className="w-3.5 h-3.5" />
              <span>Direktori Alat Bahasa Indonesia ({pages.length} Alat)</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
              Pilih Alat Khusus Sesuai Kebutuhan Anda
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Panduan lengkap dan pengunduh khusus untuk Android, iPhone, Story anonim, album carousel, dan MP3
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((item) => (
              <Link
                key={item.slug}
                href={`/id/${item.slug}`}
                className="flex flex-col p-5 rounded-2xl bg-white border border-gray-200/90 hover:border-pink-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider">
                    {item.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
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

      {/* Indonesian FAQ Section */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pertanyaan Umum (FAQ)</span>
            </span>
            <h2 className="text-2xl font-black text-gray-900">
              Tanya Jawab Seputar Reelser Bahasa Indonesia
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Bagaimana cara download Reels IG tanpa watermark?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Salin link Reels dari aplikasi Instagram, tempel ke kotak pencarian di atas, lalu tekan tombol unduh MP4 untuk mendapatkan video Full HD tanpa watermark.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Bisakah saya melihat dan mengunduh Story IG tanpa ketahuan?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Bisa. Ketik @username profil publik mana pun untuk menonton dan mengunduh story aktif maupun highlight tanpa login dan tanpa muncul di daftar penonton.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Apakah Reelser berfungsi di HP Android dan iPhone tanpa aplikasi?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ya, Reelser berjalan langsung melalui Chrome di Android dan Safari di iPhone/iPad, serta semua browser di PC atau Mac.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
