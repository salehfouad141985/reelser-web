import type { Metadata } from "next";
import Link from "next/link";
import { REELSER_TR_PSEO_PAGES } from "@/lib/pseo-tr-data";
import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { ArrowRight, CheckCircle2, Layers, Sparkles, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "Instagram Reels, Video ve Hikaye (Story) İndirme — Ücretsiz & Filigransız | Reelser",
  },
  description:
    "Instagram Reels videolarını, MP4 gönderileri, gizli hikayeleri (Story), çoklu fotoğraf albümlerini ve MP3 sesleri Full HD 1080p kalitede ücretsiz ve şifresiz indirin.",
  keywords: [
    "instagram reels indirme",
    "instagram video indirme",
    "instagram hikaye indirme",
    "instagram gizli hikaye izleme",
    "instagram mp3 indirme",
    "instagram profil fotoğrafı büyütme",
  ],
  alternates: {
    canonical: "https://reelser.com/tr",
    languages: {
      tr: "https://reelser.com/tr",
      en: "https://reelser.com",
      ar: "https://reelser.com/ar",
      es: "https://reelser.com/es",
      pt: "https://reelser.com/pt",
      fr: "https://reelser.com/fr",
      id: "https://reelser.com/id",
      de: "https://reelser.com/de",
      ru: "https://reelser.com/ru",
      "x-default": "https://reelser.com",
    },
  },
  openGraph: {
    title: "Instagram Reels, Video ve Hikaye İndirme (Ücretsiz & HD) | Reelser",
    description:
      "Instagram Reels, Video, Hikaye, Fotoğraf ve MP3 ses dosyalarını telefonunuza veya bilgisayarınıza orijinal kalitede kaydedin.",
    url: "https://reelser.com/tr",
    siteName: "Reelser",
    locale: "tr_TR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Reelser — Instagram İndirici" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instagram Reels ve Video İndirme | Reelser",
    description: "Instagram Reels, Story ve fotoğrafları filigransız ve orijinal kalitede ücretsiz indirin.",
    images: ["/opengraph-image"],
  },
};

export default function TurkishHomePage() {
  const pages = Object.values(REELSER_TR_PSEO_PAGES);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://reelser.com/tr#webpage",
        url: "https://reelser.com/tr",
        inLanguage: "tr",
        name: "Instagram Reels, Video ve Hikaye İndirme | Reelser",
        description:
          "Herkese açık Instagram hesaplarından Reels, video, hikaye, fotoğraf ve MP3 ses indirmek için ücretsiz online platform.",
      },
      {
        "@type": "WebApplication",
        "@id": "https://reelser.com/tr#app",
        name: "Reelser Türkçe - Instagram Video ve Reels İndirici",
        url: "https://reelser.com/tr",
        inLanguage: "tr",
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
        "@id": "https://reelser.com/tr#faq",
        inLanguage: "tr",
        mainEntity: [
          {
            "@type": "Question",
            name: "Instagram Reels videoları filigransız nasıl indirilir?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Instagram uygulamasından Reels bağlantısını kopyalayın, Reelser arama kutusuna yapıştırın ve 'Video İndir (MP4)' butonuna tıklayarak Full HD 1080p kalitede filigransız kaydedin.",
            },
          },
          {
            "@type": "Question",
            name: "Instagram hikayelerini karşı taraf görmeden gizlice izleyebilir miyim?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Evet. Herkese açık herhangi bir profilin @kullaniciadini yazarak aktif hikayelerini ve öne çıkanlarını giriş yapmadan ve izleyenler listesinde görünmeden izleyip indirebilirsiniz.",
            },
          },
          {
            "@type": "Question",
            name: "Reelser iPhone ve Android'de uygulama kurmadan çalışır mı?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Evet, iPhone/iPad'de Safari ve Android'de Chrome üzerinden hiçbir uygulama yüklemeden doğrudan çalışır.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div lang="tr">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection
        initialTab="reels"
        customTitle="Instagram Reels, Video ve Hikaye (Story) İndirme"
        customDescription="Full HD MP4 Reels videolarını, gizli hikayeleri, çoklu fotoğraf albümlerini ve MP3 sesleri filigransız ve şifresiz olarak ücretsiz indirin."
      />

      <div className="bg-gray-50 border-b border-gray-100 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrossLanguageLinksBar currentLocale="tr" />
        </div>
      </div>

      {/* Turkish Value Propositions */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-pink-50/40 via-white to-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Eksiksiz Instagram İndirme Paketi</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900">
              Tüm Instagram İndirme Araçları Tek Bir Yerde
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Uygulama veya eklenti kurmanıza gerek yok: Reelser doğrudan kaynak sunuculara bağlanarak size temiz, hızlı ve güvenli indirmeler sunar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Filigransız Orijinal 1080p Kalite
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ek sıkıştırma veya logo olmadan doğrudan orijinal MP4 ve JPG dosyasını cihazınıza indirin.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                @kullaniciadi ile Gizli Story İzleme
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Herkese açık hesapların günlük hikayelerini ve öne çıkanlarını %100 görünmez modda izleyin ve kaydedin.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Dahili Reels MP3 Ses Dönüştürücü
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Herhangi bir Reels videosundaki müziği veya sesi çevrimdışı dinlemek için MP3 formatında ayıklayın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Turkish Tools Directory (All 15 Turkish pSEO Pages) */}
      <section className="py-12 sm:py-16 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-pink-700 border border-pink-100">
              <Layers className="w-3.5 h-3.5" />
              <span>Türkçe Araçlar Dizini ({pages.length} Araç)</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
              İhtiyacınız Olan Özel Aracı Seçin
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              iPhone, Android, gizli hikaye izleme, çoklu fotoğraf albümleri ve MP3 için adım adım rehberler ve indiriciler
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((item) => (
              <Link
                key={item.slug}
                href={`/tr/${item.slug}`}
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

      {/* Turkish FAQ Section */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Sıkça Sorulan Sorular</span>
            </span>
            <h2 className="text-2xl font-black text-gray-900">
              Reelser Türkçe Hakkında Sık Sorulanlar
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Instagram Reels videoları filigransız nasıl indirilir?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Instagram uygulamasından Reels bağlantısını kopyalayın, yukarıdaki arama kutusuna yapıştırın ve MP4 indirme butonuna basarak videoyu Full HD kalitede filigransız kaydedin.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Instagram hikayelerini karşı taraf görmeden gizlice izleyebilir miyim?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Evet. Herkese açık herhangi bir profilin @kullaniciadini yazarak aktif hikayelerini ve öne çıkanlarını giriş yapmadan ve izleyenler listesinde görünmeden izleyip indirebilirsiniz.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Reelser iPhone ve Android&apos;de uygulama kurmadan çalışır mı?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Evet, iPhone/iPad&apos;de Safari ve Android&apos;de Chrome üzerinden hiçbir uygulama yüklemeden doğrudan çalışır.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
