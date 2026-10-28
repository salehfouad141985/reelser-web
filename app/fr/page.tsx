import type { Metadata } from "next";
import Link from "next/link";
import { REELSER_FR_PSEO_PAGES } from "@/lib/pseo-fr-data";
import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { ArrowRight, CheckCircle2, Layers, Sparkles, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "Télécharger Reels, Vidéos et Stories Instagram Gratuit (Sans Filigrane) | Reelser",
  },
  description:
    "Téléchargez des Reels Instagram, vidéos MP4, stories anonymes, carrousels photo et audio MP3 en qualité originale Full HD. Gratuit, rapide et sans inscription.",
  keywords: [
    "telecharger reel instagram",
    "telecharger video instagram",
    "voir story instagram anonymement",
    "telecharger reel sans filigrane",
    "convertir reel instagram en mp3",
    "photo de profil instagram hd",
  ],
  alternates: {
    canonical: "https://reelser.com/fr",
    languages: {
      fr: "https://reelser.com/fr",
      en: "https://reelser.com",
      ar: "https://reelser.com/ar",
      es: "https://reelser.com/es",
      pt: "https://reelser.com/pt",
      tr: "https://reelser.com/tr",
      id: "https://reelser.com/id",
      de: "https://reelser.com/de",
      ru: "https://reelser.com/ru",
      "x-default": "https://reelser.com",
    },
  },
  openGraph: {
    title: "Télécharger Reels, Vidéos et Stories Instagram Gratuit | Reelser",
    description:
      "Enregistrez des Reels, Vidéos, Stories, Photos et Audio MP3 Instagram directement sur mobile ou PC en qualité originale.",
    url: "https://reelser.com/fr",
    siteName: "Reelser",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Reelser — Téléchargeur Instagram" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Télécharger Reels et Vidéos Instagram Gratuit | Reelser",
    description: "Téléchargez des Reels, Stories et photos Instagram en qualité originale sans filigrane.",
    images: ["/opengraph-image"],
  },
};

export default function FrenchHomePage() {
  const pages = Object.values(REELSER_FR_PSEO_PAGES);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://reelser.com/fr#webpage",
        url: "https://reelser.com/fr",
        inLanguage: "fr",
        name: "Télécharger Reels, Vidéos et Stories Instagram Gratuit | Reelser",
        description:
          "Plateforme en ligne gratuite pour télécharger des Reels, vidéos, stories, photos et audio MP3 de comptes Instagram publics.",
      },
      {
        "@type": "WebApplication",
        "@id": "https://reelser.com/fr#app",
        name: "Reelser Français - Téléchargeur Instagram",
        url: "https://reelser.com/fr",
        inLanguage: "fr",
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
        "@id": "https://reelser.com/fr#faq",
        inLanguage: "fr",
        mainEntity: [
          {
            "@type": "Question",
            name: "Comment télécharger un Reel Instagram sans filigrane ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Copiez le lien du Reel depuis l'application Instagram, collez-le dans la barre de recherche Reelser et cliquez sur 'Télécharger la vidéo (MP4)' pour l'enregistrer en Full HD 1080p sans filigrane.",
            },
          },
          {
            "@type": "Question",
            name: "Puis-je regarder et télécharger des stories Instagram anonymement ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui. Entrez le @nomdutilisateur de n'importe quel profil public pour voir et télécharger ses stories actives et à la une sans vous connecter et sans apparaître dans ses vues.",
            },
          },
          {
            "@type": "Question",
            name: "Reelser fonctionne-t-il sur iPhone et Android sans application ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Oui, Reelser fonctionne directement dans le navigateur Safari sur iPhone/iPad et Chrome sur Android, ainsi que sur Windows et Mac.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div lang="fr">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection
        initialTab="reels"
        customTitle="Télécharger Reels, Vidéos et Stories Instagram Gratuitement"
        customDescription="Enregistrez des Reels en MP4 Full HD, des Stories anonymes, des Photos de carrousel et de l'Audio MP3 en qualité originale sans filigrane et sans compte."
      />

      {/* French Value Propositions */}
      <div className="bg-gray-50 border-b border-gray-100 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrossLanguageLinksBar currentLocale="fr" />
        </div>
      </div>
      <section className="py-12 sm:py-16 bg-gradient-to-b from-pink-50/40 via-white to-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suite Complète d&apos;Outils pour Instagram</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900">
              Tous les Outils de Téléchargement au Même Endroit
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Sans installer d&apos;application ni d&apos;extension : Reelser se connecte directement aux serveurs sources pour vous offrir des téléchargements propres, rapides et sécurisés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Qualité Originale 1080p Sans Filigrane
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Téléchargez le fichier MP4 ou JPG natif sans compression supplémentaire ni logo superposé.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Visionneuse Anonyme de Stories par @pseudo
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Regardez et sauvegardez les stories 24h et les stories à la une des comptes publics en mode 100 % furtif.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Convertisseur de Reels en MP3 Intégré
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Extrayez la piste audio ou la musique de n&apos;importe quel Reel au format MP3 prêt pour une écoute hors ligne.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete French Tools Directory (All 15 French pSEO Pages) */}
      <section className="py-12 sm:py-16 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-pink-700 border border-pink-100">
              <Layers className="w-3.5 h-3.5" />
              <span>Répertoire des Outils en Français ({pages.length})</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
              Choisissez l&apos;Outil Spécialisé dont Vous Avez Besoin
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Guides étape par étape et téléchargeurs optimisés pour iPhone, Android, Stories anonymes, carrousels et MP3
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((item) => (
              <Link
                key={item.slug}
                href={`/fr/${item.slug}`}
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

      {/* French FAQ Section */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions Fréquentes</span>
            </span>
            <h2 className="text-2xl font-black text-gray-900">
              Questions Fréquentes sur Reelser en Français
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Comment télécharger un Reel Instagram sans filigrane ?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Copiez le lien du Reel depuis l&apos;application Instagram, collez-le dans la barre de recherche ci-dessus et appuyez sur le bouton de téléchargement MP4 pour obtenir la vidéo en Full HD sans filigrane.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Puis-je regarder et télécharger des stories Instagram anonymement ?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Oui. Tapez le @nomdutilisateur de n&apos;importe quel profil public pour voir et télécharger ses stories actives et à la une sans vous connecter et sans apparaître dans sa liste de spectateurs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Reelser fonctionne-t-il sur iPhone et Android sans installer d&apos;application ?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Oui, il fonctionne directement depuis Safari sur iPhone/iPad et Chrome sur Android, ainsi que sur n&apos;importe quel navigateur sur PC ou Mac.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
