import type { Metadata } from "next";
import Link from "next/link";
import { REELSER_AR_PSEO_PAGES } from "@/lib/pseo-ar-data";
import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { ArrowLeft, CheckCircle2, Layers, Sparkles, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "تحميل ريلز وفيديو وستوري انستقرام بدون علامة مائية مجاناً | Reelser",
  },
  description:
    "موقع Reelser العربي لتحميل مقاطع ريلز انستقرام، الفيديوهات، الستوري والهايلايت سراً، الصور والألبومات، وتحويل الفيديو إلى MP3 بجودة أصلية Full HD وبدون تسجيل دخول.",
  keywords: [
    "تحميل ريلز انستقرام",
    "تنزيل فيديو من الانستقرام",
    "تحميل ستوري انستا بدون علم صاحبها",
    "تحميل ريلز بدون علامة مائية",
    "حفظ فيديو من الانستا للايفون",
    "تحميل صوت ريلز انستقرام mp3",
    "تكبير صورة بروفايل انستقرام",
  ],
  alternates: {
    canonical: "https://reelser.com/ar",
    languages: {
      ar: "https://reelser.com/ar",
      en: "https://reelser.com",
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
    title: "تحميل ريلز وفيديو وستوري انستقرام بدون علامة مائية | Reelser",
    description:
      "حمّل مقاطع ريلز، الفيديو، الستوري، الصور، والصوت MP3 من إنستغرام بالجودة الأصلية الكاملة مجاناً.",
    url: "https://reelser.com/ar",
    siteName: "Reelser",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Reelser — تحميل من الانستقرام" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "تحميل ريلز وفيديو وستوري انستقرام مجاناً | Reelser",
    description: "تنزيل مقاطع ريلز وفيديوهات وقصص إنستغرام بجودة أصلية بدون علامة مائية.",
    images: ["/opengraph-image"],
  },
};

export default function ArabicHomePage() {
  const pages = Object.values(REELSER_AR_PSEO_PAGES);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://reelser.com/ar#webpage",
        url: "https://reelser.com/ar",
        inLanguage: "ar",
        name: "تحميل ريلز وفيديو وستوري انستقرام بدون علامة مائية مجاناً | Reelser",
        description:
          "منصة عربية مجانية لتحميل مقاطع ريلز إنستغرام، الفيديوهات، الستوري، الصور، وملفات الصوت MP3 بجودة أصلية.",
      },
      {
        "@type": "WebApplication",
        "@id": "https://reelser.com/ar#app",
        name: "Reelser العربي - تحميل من الانستقرام",
        url: "https://reelser.com/ar",
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
        "@type": "FAQPage",
        "@id": "https://reelser.com/ar#faq",
        inLanguage: "ar",
        mainEntity: [
          {
            "@type": "Question",
            name: "كيف أحمل ريلز انستقرام بدون علامة مائية؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "انسخ رابط مقطع الريلز من تطبيق إنستغرام والصقه في صندوق البحث في موقع Reelser ثم اضغط على تحميل الفيديو (MP4) لحفظه بجودة Full HD بدون علامة مائية.",
            },
          },
          {
            "@type": "Question",
            name: "هل يمكن تحميل ستوري انستقرام بدون علم صاحب الحساب؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "نعم، يمكنك كتابة اسم المستخدم (@username) لأي حساب عام لمشاهدة وتحميل القصص النشطة والهايلايت بسرية تامة 100% دون ظهور اسمك في قائمة المشاهدين.",
            },
          },
          {
            "@type": "Question",
            name: "هل يعمل موقع Reelser على الآيفون والأندرويد بدون برامج؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "نعم، يعمل الموقع مباشرة عبر متصفح سفاري (Safari) على الآيفون ومتصفح كروم (Chrome) على الأندرويد دون الحاجة لتثبيت أي تطبيقات.",
            },
          },
        ],
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
        initialTab="reels"
        customTitle="تحميل ريلز وفيديو وستوري انستقرام بدون علامة مائية"
        customDescription="حمّل مقاطع الريلز (MP4)، القصص اليومية (Stories)، الصور والألبومات، والصوتيات (MP3) بالجودة الأصلية مجاناً وبدون تسجيل دخول."
      />

      {/* Arabic Value Propositions */}
      <div className="bg-gray-50 border-b border-gray-100 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrossLanguageLinksBar currentLocale="ar" />
        </div>
      </div>
      <section className="py-12 sm:py-16 bg-gradient-to-b from-pink-50/40 via-white to-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>المنصة العربية المتكاملة لتحميل وسائط إنستغرام</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900">
              جميع أدوات التحميل من إنستغرام في مكان واحد
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              لا حاجة لتثبيت عشرات التطبيقات على هاتفك؛ يوفر لك Reelser استخراجاً فورياً ومباشراً من خوادم إنستغرام بأعلى دقة متاحة وبخصوصية تامة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                جودة أصلية Full HD 1080p بدون علامة مائية
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                نستخرج ملفات الفيديو والصور الخام مباشرة من المصدر دون إعادة ضغط أو إضافة شعارات مزعجة.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                تصفح وحفظ الستوري سراً عبر @username
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                شاهد وحمّل قصص الحسابات العامة والهايلايت المثبت دون تسجيل دخول ودون ظهور اسمك لدى صاحب الحساب.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                تحويل الفيديو والريلز إلى صوت MP3
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                استخرج الموسيقى والمقاطع الصوتية من أي ريلز أو فيديو بصيغة MP3 نقية جاهزة للاستماع بدون إنترنت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Arabic Tools Directory (All 15 Arabic pSEO Pages) */}
      <section className="py-12 sm:py-16 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-700 border border-pink-100">
              <Layers className="w-3.5 h-3.5" />
              <span>دليل الأدوات العربية المتخصصة ({pages.length} أداة)</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
              اختر الأداة المناسبة لاحتياجك
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              شروحات مفصلة وأدوات مخصصة للآيفون، الأندرويد، الستوري المخفي، الألبومات، والصوتيات
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((item) => (
              <Link
                key={item.slug}
                href={`/ar/${item.slug}`}
                className="flex flex-col p-5 rounded-2xl bg-white border border-gray-200/90 hover:border-pink-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-pink-600">
                    {item.badge}
                  </span>
                  <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-pink-600 group-hover:-translate-x-1 transition-all" />
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

      {/* Arabic FAQ Section */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>أسئلة شائعة</span>
            </span>
            <h2 className="text-2xl font-black text-gray-900">
              الأسئلة الأكثر تكراراً حول التحميل من إنستغرام
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                كيف أحمل ريلز انستقرام بدون علامة مائية؟
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                انسخ رابط مقطع الريلز من تطبيق إنستغرام والصقه في صندوق البحث أعلى الصفحة ثم اضغط على زر تحميل الفيديو (MP4) لحفظه بجودة Full HD بدون أي علامة مائية.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                هل يمكن تحميل ستوري انستقرام بدون علم صاحب الحساب؟
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                نعم، يمكنك كتابة اسم المستخدم (@username) لأي حساب عام لمشاهدة وتحميل القصص النشطة والهايلايت بسرية تامة 100% دون ظهور اسمك في قائمة المشاهدين.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                هل يعمل موقع Reelser على الآيفون والأندرويد بدون برامج؟
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                نعم، يعمل الموقع مباشرة عبر متصفح سفاري (Safari) على الآيفون ومتصفح كروم (Chrome) على الأندرويد وأجهزة الكمبيوتر دون الحاجة لتثبيت أي تطبيقات.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
