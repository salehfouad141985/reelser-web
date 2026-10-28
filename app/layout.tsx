import type { Metadata, Viewport } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SiteSettings } from "@/components/SiteSettings";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#833ab4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://reelser.com"),
  title: {
    default: "Reelser - Instagram Reels, Story, Photo & Audio Downloader",
    template: "%s | Reelser",
  },
  description:
    "Download public Instagram Reels, videos, stories, photos, and MP3 audio with Reelser. Fast, free online tools for iPhone, Android, and PC with no registration.",
  keywords: [
    "instagram reels download",
    "instagram video downloader",
    "download instagram reels",
    "save instagram reels",
    "insta reel download",
    "reels downloader",
    "instagram story saver",
    "instagram photo download",
    "instagram audio mp3",
    "تحميل ريلز انستقرام",
    "تنزيل ريلز انستا",
    "تحميل فيديو من الانستقرام",
    "descargar reels de instagram",
    "telecharger reel instagram",
    "baixar reels do instagram",
  ],
  authors: [{ name: "Reelser" }],
  creator: "Reelser",
  publisher: "Reelser",
  alternates: {
    canonical: "https://reelser.com",
    languages: {
      en: "https://reelser.com",
      ar: "https://reelser.com/ar",
      es: "https://reelser.com/es",
      pt: "https://reelser.com/pt",
      fr: "https://reelser.com/fr",
      tr: "https://reelser.com/tr",
      id: "https://reelser.com/id",
      de: "https://reelser.com/de",
      ru: "https://reelser.com/ru",
      "x-default": "https://reelser.com",
    },
  },
  openGraph: {
    title: "Reelser - Instagram Reels & Video Downloader (Source Quality)",
    description:
      "Save Instagram Reels, Videos, Stories, Photos, and Audio directly to your device for free in the quality available from the source.",
    url: "https://reelser.com",
    siteName: "Reelser",
    locale: "en_US",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Reelser — Instagram Reels & Video Downloader" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reelser - Free Instagram Reels & Video Downloader",
    description: "Download Instagram Reels & Videos in source quality without watermark or login.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://reelser.com/#organization",
        name: "Reelser",
        url: "https://reelser.com",
        logo: "https://reelser.com/icon.svg",
      },
      {
        "@type": "WebSite",
        "@id": "https://reelser.com/#website",
        url: "https://reelser.com",
        name: "Reelser",
        publisher: { "@id": "https://reelser.com/#organization" },
        inLanguage: ["en", "ar", "es", "pt", "fr", "de", "tr", "id", "ru"],
        description: "Free online tools to download public Instagram Reels, Stories, Photos, Profile Pictures, and MP3 Audio.",
      },
      {
        "@type": "ItemList",
        "@id": "https://reelser.com/#navigation",
        name: "Reelser Main Navigation & Language Hubs",
        itemListElement: [
          { "@type": "SiteNavigationElement", position: 1, name: "Instagram Reels Downloader", url: "https://reelser.com/reels" },
          { "@type": "SiteNavigationElement", position: 2, name: "Instagram Story Saver", url: "https://reelser.com/story-saver" },
          { "@type": "SiteNavigationElement", position: 3, name: "Instagram Photo & Carousel Downloader", url: "https://reelser.com/photo-downloader" },
          { "@type": "SiteNavigationElement", position: 4, name: "Instagram Audio & MP3 Extractor", url: "https://reelser.com/audio-downloader" },
          { "@type": "SiteNavigationElement", position: 5, name: "Instagram Profile & DP Viewer", url: "https://reelser.com/profile-downloader" },
          { "@type": "SiteNavigationElement", position: 6, name: "تحميل من الانستقرام (Arabic)", url: "https://reelser.com/ar" },
          { "@type": "SiteNavigationElement", position: 7, name: "Descargar de Instagram (Español)", url: "https://reelser.com/es" },
          { "@type": "SiteNavigationElement", position: 8, name: "Baixar do Instagram (Português)", url: "https://reelser.com/pt" },
          { "@type": "SiteNavigationElement", position: 9, name: "Télécharger Instagram (Français)", url: "https://reelser.com/fr" },
          { "@type": "SiteNavigationElement", position: 10, name: "Instagram Herunterladen (Deutsch)", url: "https://reelser.com/de" },
          { "@type": "SiteNavigationElement", position: 11, name: "Instagram İndirici (Türkçe)", url: "https://reelser.com/tr" },
          { "@type": "SiteNavigationElement", position: 12, name: "Download Instagram (Indonesia)", url: "https://reelser.com/id" },
          { "@type": "SiteNavigationElement", position: 13, name: "Скачать с Инстаграма (Русский)", url: "https://reelser.com/ru" },
        ],
      },
    ],
  };

  return (
    <html lang="en" className={`${inter.variable} ${amiri.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased selection:bg-pink-500 selection:text-white">
        <LanguageProvider>
          <SiteSettings>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </SiteSettings>
        </LanguageProvider>
      </body>
    </html>
  );
}
