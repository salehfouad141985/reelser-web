import React from "react";
import Link from "next/link";
import { RuPseoPageConfig, REELSER_RU_PSEO_PAGES } from "@/lib/pseo-ru-data";
import { CrossLanguageLinksBar } from "./CrossLanguageLinksBar";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Info,
  ArrowRight,
  HelpCircle,
  BookOpen,
} from "lucide-react";

interface PseoRussianContentProps {
  config: RuPseoPageConfig;
}

export function PseoRussianContent({ config }: PseoRussianContentProps) {
  const categoryLabels: Record<string, string> = {
    reels: "Загрузчик Reels и Видео",
    story: "Загрузчик Сторис и Хайлайтс",
    photo: "Загрузчик Фото и Карусели",
    audio: "Конвертер Аудио MP3",
    profile: "Просмотр Профиля и Аватарки",
  };

  const categoryLabel = categoryLabels[config.category] || categoryLabels.reels;
  const allPages = Object.values(REELSER_RU_PSEO_PAGES).filter((p) => p.slug !== config.slug);

  return (
    <div className="bg-white" lang="ru">
      {/* Breadcrumb Navigation + Direct HTML Cross-Language Crawl Links */}
      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-xs text-gray-500">
            <li>
              <Link href="/ru" className="hover:text-pink-600 transition-colors font-medium">
                Главная (Русский)
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-600">{categoryLabel}</li>
            <li>/</li>
            <li className="font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">
              {config.h1}
            </li>
          </ol>
          <CrossLanguageLinksBar enSlug={config.enSlug} currentLocale="ru" />
        </div>
      </nav>

      {/* Featured Snippet / Quick Answer Callout */}
      <section className="py-8 sm:py-12 bg-gradient-to-b from-pink-50/40 via-white to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-amber-500/5 border border-pink-200/60 shadow-2xs relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{config.badge}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                  {config.introTitle}
                </h2>
                {config.introParagraphs.map((paragraph, idx) => (
                  <p key={idx} className="text-base text-gray-700 leading-relaxed font-medium">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step How-To Guide */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-3 py-1 rounded-full">
              Пошаговая Инструкция
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
              {config.stepsTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Выполните три простых действия для мгновенного сохранения в оригинальном качестве.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col p-6 rounded-2xl bg-gray-50/80 border border-gray-200/80 hover:border-pink-200 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="w-8 h-8 rounded-full bg-pink-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    0{idx + 1}
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits Grid */}
      <section className="py-12 sm:py-16 bg-gray-50/60 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-3 py-1 rounded-full">
              Преимущества и Возможности
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
              {config.benefitsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-gray-200/80 hover:border-pink-300 hover:shadow-xs transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-3 py-1 rounded-full">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Часто Задаваемые Вопросы (FAQ)</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
              Ответы на вопросы: {config.h1}
            </h2>
          </div>

          <div className="space-y-4">
            {config.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2"
              >
                <h3 className="text-base font-bold text-gray-900">{faq.question}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Russian Tools Internal Linking Grid */}
      <section className="py-12 sm:py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-200/80 px-3 py-1 rounded-full">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Все Инструменты на Русском ({allPages.length})</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-2">
              Другие Бесплатные Инструменты для Instagram
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Специализированные загрузчики для Reels, Сторис, Хайлайтс, Каруселей, MP3 и Профилей
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allPages.map((item) => (
              <Link
                key={item.slug}
                href={`/ru/${item.slug}`}
                className="flex flex-col p-5 rounded-2xl bg-white border border-gray-200 hover:border-pink-300 hover:shadow-xs transition-all group"
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
    </div>
  );
}
