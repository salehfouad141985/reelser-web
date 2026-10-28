import type { Metadata } from "next";
import Link from "next/link";
import { REELSER_ES_PSEO_PAGES } from "@/lib/pseo-es-data";
import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { ArrowRight, CheckCircle2, Layers, Sparkles, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "Descargar Reels, Videos e Historias de Instagram Gratis (Sin Marca de Agua) | Reelser",
  },
  description:
    "Descarga Reels de Instagram, videos en MP4, historias anónimas, carruseles de fotos y audio MP3 en calidad original Full HD. Gratis, rápido y sin registro.",
  keywords: [
    "descargar reels de instagram",
    "descargar videos de instagram",
    "descargar historias de instagram anonimo",
    "bajar reels sin marca de agua",
    "convertir reels a mp3",
    "ver foto de perfil instagram hd",
  ],
  alternates: {
    canonical: "https://reelser.com/es",
    languages: {
      es: "https://reelser.com/es",
      en: "https://reelser.com",
      ar: "https://reelser.com/ar",
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
    title: "Descargar Reels, Videos e Historias de Instagram Gratis | Reelser",
    description:
      "Guarda Reels, Videos, Stories, Fotos y Audio MP3 de Instagram directamente en tu móvil o PC en calidad original.",
    url: "https://reelser.com/es",
    siteName: "Reelser",
    locale: "es_ES",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Reelser — Descargador de Instagram" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Descargar Reels y Videos de Instagram Gratis | Reelser",
    description: "Descarga Reels, Stories y fotos de Instagram en calidad original sin marca de agua.",
    images: ["/opengraph-image"],
  },
};

export default function SpanishHomePage() {
  const pages = Object.values(REELSER_ES_PSEO_PAGES);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://reelser.com/es#webpage",
        url: "https://reelser.com/es",
        inLanguage: "es",
        name: "Descargar Reels, Videos e Historias de Instagram Gratis | Reelser",
        description:
          "Plataforma online gratuita para descargar Reels, videos, historias, fotos y audio MP3 de cuentas públicas de Instagram.",
      },
      {
        "@type": "WebApplication",
        "@id": "https://reelser.com/es#app",
        name: "Reelser Español - Descargador de Instagram",
        url: "https://reelser.com/es",
        inLanguage: "es",
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
        "@id": "https://reelser.com/es#faq",
        inLanguage: "es",
        mainEntity: [
          {
            "@type": "Question",
            name: "¿Cómo descargar Reels de Instagram sin marca de agua?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Copia el enlace del Reel desde la app de Instagram, pégalo en el buscador de Reelser y pulsa 'Descargar Video (MP4)' para guardarlo en Full HD 1080p sin marca de agua.",
            },
          },
          {
            "@type": "Question",
            name: "¿Puedo ver y descargar historias de Instagram de forma anónima?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sí. Escribe el @usuario de cualquier perfil público para ver y descargar sus historias activas y destacadas sin iniciar sesión y sin aparecer en su lista de vistos.",
            },
          },
          {
            "@type": "Question",
            name: "¿Funciona Reelser en iPhone y Android sin instalar aplicaciones?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sí, Reelser funciona directamente desde el navegador Safari en iPhone/iPad y Chrome en Android, así como en Windows y Mac.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div lang="es">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection
        initialTab="reels"
        customTitle="Descargar Reels, Videos e Historias de Instagram Gratis"
        customDescription="Guarda Reels en MP4 Full HD, Historias anónimas, Fotos de carrusel y Audio MP3 en calidad original sin marca de agua y sin iniciar sesión."
      />

      {/* Spanish Value Propositions */}
      <div className="bg-gray-50 border-b border-gray-100 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrossLanguageLinksBar currentLocale="es" />
        </div>
      </div>
      <section className="py-12 sm:py-16 bg-gradient-to-b from-pink-50/40 via-white to-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suite Completa de Herramientas para Instagram</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900">
              Todas las Utilidades de Descarga en un Solo Lugar
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Sin instalar aplicaciones ni extensiones: Reelser se conecta directamente a los servidores de origen para ofrecerte descargas limpias, rápidas y seguras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Calidad Original 1080p sin Marca de Agua
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Descarga el archivo MP4 o JPG nativo sin compresión adicional ni logotipos superpuestos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Visor Anónimo de Stories por @usuario
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Mira y guarda historias diarias y destacadas de cuentas públicas en modo 100% incógnito.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Convertidor de Reels a MP3 Integrado
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Extrae la pista de audio o canción de cualquier Reel en formato MP3 listo para escuchar sin internet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Spanish Tools Directory (All 15 Spanish pSEO Pages) */}
      <section className="py-12 sm:py-16 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-pink-700 border border-pink-100">
              <Layers className="w-3.5 h-3.5" />
              <span>Directorio de Herramientas en Español ({pages.length})</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
              Elige la Herramienta Especializada que Necesitas
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Guías paso a paso y descargadores optimizados para iPhone, Android, Stories anónimas, carruseles y MP3
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((item) => (
              <Link
                key={item.slug}
                href={`/es/${item.slug}`}
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

      {/* Spanish FAQ Section */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Preguntas Frecuentes</span>
            </span>
            <h2 className="text-2xl font-black text-gray-900">
              Dudas Frecuentes sobre Reelser en Español
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                ¿Cómo descargar Reels de Instagram sin marca de agua?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Copia el enlace del Reel desde la app de Instagram, pégalo en el buscador superior y pulsa el botón de descarga MP4 para obtener el video en Full HD sin marcas de agua.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                ¿Puedo ver y descargar historias de Instagram de forma anónima?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sí. Escribe el @usuario de cualquier perfil público para ver y descargar sus historias activas y destacadas sin iniciar sesión y sin aparecer en su lista de vistos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                ¿Funciona Reelser en iPhone y Android sin instalar aplicaciones?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sí, funciona directamente desde Safari en iPhone/iPad y Chrome en Android, además de cualquier navegador en PC o Mac.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
