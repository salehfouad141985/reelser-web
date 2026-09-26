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
    default: "Reelser - Instagram Reels & Video Downloader",
    template: "%s | Reelser",
  },
  description:
    "Free online Instagram downloader. Save Instagram Reels, Videos, Stories, Photos, and Audio in high-definition MP4/JPG without watermark or login.",
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
  },
  openGraph: {
    title: "Reelser - Instagram Reels & Video Downloader (source quality)",
    description:
      "Save Instagram Reels, Videos, Stories, Photos, and Audio directly to your device for free in the quality available from the source.",
    url: "https://reelser.com",
    siteName: "Reelser",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reelser - Free Instagram Reels & Video Downloader",
    description: "Download Instagram Reels & Videos in source quality without watermark or login.",
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
        "@type": "WebSite",
        "@id": "https://reelser.com/#website",
        url: "https://reelser.com",
        name: "Reelser",
        description: "Best Instagram Reels & Video Downloader in source quality",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://reelser.com/?url={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebApplication",
        "@id": "https://reelser.com/#application",
        name: "Reelser - Instagram Downloader",
        url: "https://reelser.com",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "All (iOS, Android, Windows, macOS, Linux)",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
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
