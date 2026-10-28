import type { Metadata } from "next";
import Link from "next/link";
import { REELSER_RU_PSEO_PAGES } from "@/lib/pseo-ru-data";
import { buildHreflangMap } from "@/lib/localeRoutes";
import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { ArrowRight, CheckCircle2, Layers, Sparkles, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "Скачать Рилс, Видео, Сторис и Фото с Инстаграма Бесплатно (Без Водяного Знака) | Reelser",
  },
  description:
    "Бесплатный онлайн-сервис Reelser для скачивания Instagram Reels (MP4 Full HD), сторис анонимно, актуального, фото, каруселей, музыки MP3 и аватарок без регистрации.",
  keywords: [
    "скачать рилс с инстаграма",
    "скачать видео с инстаграма",
    "скачать сторис инстаграм анонимно",
    "смотреть сторис инстаграм анонимно",
    "скачать фото с инстаграма hd",
    "скачать музыку с инстаграма mp3",
    "скачать аватарку инстаграм",
  ],
  alternates: {
    canonical: "https://reelser.com/ru",
    languages: buildHreflangMap(),
  },
  openGraph: {
    title: "Скачать Рилс, Видео и Сторис с Инстаграма (Full HD) | Reelser",
    description:
      "Сохраняйте публичные ролики Reels, видео, сторис, фотографии и аудио MP3 из Instagram бесплатно в оригинальном качестве.",
    url: "https://reelser.com/ru",
    siteName: "Reelser",
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Reelser — Загрузчик Instagram на Русском" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Скачать Рилс и Сторис с Инстаграма Бесплатно | Reelser",
    description: "Скачивайте Instagram Reels, видео и сторис со звуком без водяного знака.",
    images: ["/opengraph-image"],
  },
};

export default function RussianHomePage() {
  const pages = Object.values(REELSER_RU_PSEO_PAGES);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://reelser.com/ru#webpage",
        url: "https://reelser.com/ru",
        inLanguage: "ru",
        name: "Скачать Рилс, Видео, Сторис и Фото с Инстаграма Бесплатно (Без Водяного Знака) | Reelser",
        description:
          "Русскоязычный портал Reelser для бесплатного сохранения видео Reels, историй, фотографий, аудио MP3 и полноразмерных аватарок из Instagram.",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://reelser.com/ru#app",
        name: "Reelser — Загрузчик Инстаграм на Русском",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "iOS, Android, Windows, macOS, Linux",
        url: "https://reelser.com/ru",
        inLanguage: "ru",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://reelser.com/ru#faq",
        inLanguage: "ru",
        mainEntity: [
          {
            "@type": "Question",
            name: "Бесплатно ли пользоваться сервисом Reelser?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Да, Reelser на 100% бесплатен. Регистрация или вход в личный аккаунт Instagram не требуются.",
            },
          },
          {
            "@type": "Question",
            name: "Можно ли через Reelser смотреть и скачивать сторис анонимно?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Да. Просто введите публичный @никнейм профиля, чтобы тайно посмотреть активные истории и актуальное и скачать их в формате MP4 или JPG.",
            },
          },
          {
            "@type": "Question",
            name: "Работает ли скачивание на iPhone и Android без установки приложений?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Да, сервис открывается прямо в браузере Safari на iPhone/iPad, а также в Chrome и Яндекс Браузере на Android, Windows и Mac.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div lang="ru" className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection
        initialTab="reels"
        customTitle="Скачать Рилс, Видео, Сторис и Фото с Инстаграма Бесплатно"
        customDescription="Вставьте ссылку на публикацию Instagram или введите @никнейм, чтобы скачать Reels без водяного знака (1080p MP4), сторис анонимно, фото, карусели и MP3."
      />

      {/* Direct HTML Cross-Language Crawl Links Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrossLanguageLinksBar currentLocale="ru" />
        </div>
      </div>

      {/* Russian Overview & Core Advantages */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-pink-50/40 via-white to-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reelser на Русском — Платформа 5-в-1</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              Универсальный Загрузчик Instagram в Оригинальном Качестве Full HD
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Reelser объединяет пять специализированных инструментов в одном быстром и чистом интерфейсе: скачивайте ролики Reels без водяного знака со звуком, смотрите сторис тайно по @нику, распаковывайте альбомы-карусели, увеличивайте аватарки и извлекайте музыку в MP3.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Исходное Качество 1080p MP4 и JPG
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Прямое получение файлов с серверов CDN Instagram без повторного сжатия, без потери резкости и без водяных знаков.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                100% Анонимно и Без Авторизации
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Просматривайте и сохраняйте сторис, актуальное и открытые профили по @нику, не оставляя следов в списке зрителей.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Для iPhone, Android, Windows и Mac
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Мгновенно работает в любом браузере (Safari, Chrome, Яндекс Браузер) без установки сторонних программ и APK.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All 15 Russian Programmatic SEO Tools Directory */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-pink-700">
              <Layers className="w-3.5 h-3.5" />
              <span>Все Инструменты на Русском ({pages.length})</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
              Выберите Нужный Инструмент Загрузки Instagram
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Быстрый доступ ко всем специализированным загрузчикам, конвертерам и инструкциям
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((item) => (
              <Link
                key={item.slug}
                href={`/ru/${item.slug}`}
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

      {/* Russian Hub FAQ */}
      <section className="py-12 sm:py-16 bg-gray-50/60 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Частые Вопросы (FAQ)</span>
            </span>
            <h2 className="text-2xl font-black text-gray-900">
              Ответы на Главные Вопросы о Скачивании с Instagram
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Бесплатно ли пользоваться сервисом Reelser?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Да, Reelser на 100% бесплатен. Регистрация или вход в личный аккаунт Instagram не требуются.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Можно ли через Reelser смотреть и скачивать сторис анонимно?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Да. Просто введите публичный @никнейм профиля, чтобы тайно посмотреть активные истории и актуальное и скачать их в формате MP4 или JPG.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Работает ли скачивание на iPhone и Android без установки приложений?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Да, сервис открывается прямо в браузере Safari на iPhone/iPad, а также в Chrome и Яндекс Браузере на Android, Windows и Mac.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
