import React from "react";
import Link from "next/link";
import { FrenchPseoPageConfig, REELSER_FR_PSEO_PAGES } from "@/lib/pseo-fr-data";
import { PseoFaqAccordion } from "./PseoFaqAccordion";
import { CrossLanguageLinksBar } from "./CrossLanguageLinksBar";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Info,
  ArrowRight,
  Sliders,
  BookOpen,
} from "lucide-react";

interface PseoFrenchContentProps {
  config: FrenchPseoPageConfig;
}

export function PseoFrenchContent({ config }: PseoFrenchContentProps) {
  const categoryLabels: Record<string, string> = {
    reels: "Outils Reels et Vidéo",
    story: "Téléchargeur de Stories et Highlights",
    photo: "Téléchargeur de Photos et Carrousels",
    audio: "Convertisseur Audio MP3",
    profile: "Visionneuse de Profil et Photo HD",
  };

  const categoryLabel = categoryLabels[config.category] || categoryLabels.reels;

  const relatedPages = config.relatedSlugs
    .map((slug) => REELSER_FR_PSEO_PAGES[slug])
    .filter(Boolean);

  return (
    <div className="bg-white" lang="fr">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 text-xs text-gray-500">
            <li>
              <Link href="/fr" className="hover:text-pink-600 transition-colors font-medium">
                Accueil (Français)
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-600">{categoryLabel}</li>
            <li>/</li>
            <li className="font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">
              {config.h1}
            </li>
          </ol>
          <CrossLanguageLinksBar enSlug={config.enSlug} currentLocale="fr" />
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
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Réponse Rapide</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                  {config.h1} : En Bref
                </h2>
                <p className="text-base text-gray-700 leading-relaxed font-medium">
                  {config.quickAnswer}
                </p>
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
              Guide Étape par Étape
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
              {config.howToTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Suivez ces étapes simples pour lancer votre téléchargement en quelques secondes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.howToSteps.map((step, idx) => (
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
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications & Capabilities Table */}
      <section className="py-12 bg-gray-50/60 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
              <Sliders className="w-3.5 h-3.5" />
              <span>Détails Techniques</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-2">
              Spécifications et Fonctionnalités
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
            <dl className="divide-y divide-gray-100">
              {config.specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-3 px-6 py-4 hover:bg-gray-50/50 transition-colors"
                >
                  <dt className="text-sm font-bold text-gray-600 sm:col-span-1">
                    {spec.label}
                  </dt>
                  <dd className="text-sm font-semibold text-gray-900 sm:col-span-2 mt-1 sm:mt-0">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-3 py-1 rounded-full">
              Pourquoi Choisir Reelser
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
              Avantages et Points Forts
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {config.features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-gray-50/60 border border-gray-200/80 hover:border-pink-300 hover:shadow-xs transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep-Dive Editorial Guide (Article) */}
      <section className="py-12 sm:py-16 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-pink-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-pink-700">
              Guide Complet et Astuces
            </span>
          </div>

          <article className="max-w-none space-y-8 text-gray-700">
            {config.article.map((sec, idx) => (
              <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                  {sec.heading}
                </h3>
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx} className="text-base text-gray-600 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </article>
        </div>
      </section>

      {/* Interactive FAQ Accordion */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-3 py-1 rounded-full">
              Questions Fréquentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
              Tout Savoir sur : {config.h1}
            </h2>
          </div>

          <PseoFaqAccordion faqs={config.faqs} />
        </div>
      </section>

      {/* Topic Clusters & Internal Links */}
      {relatedPages.length > 0 && (
        <section className="py-12 sm:py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-200/80 px-3 py-1 rounded-full">
                Plus d&apos;Outils en Français
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-2">
                Outils Instagram Associés
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Découvrez nos téléchargeurs et convertisseurs spécialisés pour tous les formats Instagram
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPages.map((item) => (
                <Link
                  key={item.slug}
                  href={`/fr/${item.slug}`}
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
      )}
    </div>
  );
}
