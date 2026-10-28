import type { Metadata } from "next";
import Link from "next/link";
import { REELSER_PT_PSEO_PAGES } from "@/lib/pseo-pt-data";
import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { ArrowRight, CheckCircle2, Layers, Sparkles, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "Baixar Reels, Vídeos e Stories do Instagram Grátis (Sem Marca d'Água) | Reelser",
  },
  description:
    "Baixe Reels do Instagram, vídeos em MP4, stories anônimos, carrosséis de fotos e áudio MP3 em qualidade original Full HD. Grátis, rápido e sem login.",
  keywords: [
    "baixar reels instagram",
    "baixar videos do instagram",
    "baixar stories instagram anonimo",
    "baixar reels sem marca d agua",
    "converter reels para mp3",
    "ver foto de perfil instagram hd",
  ],
  alternates: {
    canonical: "https://reelser.com/pt",
    languages: {
      pt: "https://reelser.com/pt",
      en: "https://reelser.com",
      ar: "https://reelser.com/ar",
      es: "https://reelser.com/es",
      fr: "https://reelser.com/fr",
      tr: "https://reelser.com/tr",
      id: "https://reelser.com/id",
      de: "https://reelser.com/de",
      ru: "https://reelser.com/ru",
      "x-default": "https://reelser.com",
    },
  },
  openGraph: {
    title: "Baixar Reels, Vídeos e Stories do Instagram Grátis | Reelser",
    description:
      "Salve Reels, Vídeos, Stories, Fotos e Áudio MP3 do Instagram diretamente no celular ou PC na qualidade original.",
    url: "https://reelser.com/pt",
    siteName: "Reelser",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Reelser — Baixador do Instagram" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Baixar Reels e Vídeos do Instagram Grátis | Reelser",
    description: "Baixe Reels, Stories e fotos do Instagram na qualidade original sem marca d'água.",
    images: ["/opengraph-image"],
  },
};

export default function PortugueseHomePage() {
  const pages = Object.values(REELSER_PT_PSEO_PAGES);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://reelser.com/pt#webpage",
        url: "https://reelser.com/pt",
        inLanguage: "pt",
        name: "Baixar Reels, Vídeos e Stories do Instagram Grátis | Reelser",
        description:
          "Plataforma online gratuita para baixar Reels, vídeos, stories, fotos e áudio MP3 de contas públicas do Instagram.",
      },
      {
        "@type": "WebApplication",
        "@id": "https://reelser.com/pt#app",
        name: "Reelser Português - Baixador de Instagram",
        url: "https://reelser.com/pt",
        inLanguage: "pt",
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
        "@id": "https://reelser.com/pt#faq",
        inLanguage: "pt",
        mainEntity: [
          {
            "@type": "Question",
            name: "Como baixar Reels do Instagram sem marca d'água?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Copie o link do Reel no app do Instagram, cole na caixa de busca do Reelser e clique em 'Baixar Vídeo (MP4)' para salvá-lo em Full HD 1080p sem marca d'água.",
            },
          },
          {
            "@type": "Question",
            name: "Posso ver e baixar stories do Instagram de forma anônima?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim. Digite o @usuario de qualquer perfil público para assistir e baixar seus stories ativos e destaques sem fazer login e sem aparecer na lista de visualizações.",
            },
          },
          {
            "@type": "Question",
            name: "O Reelser funciona no iPhone e Android sem instalar aplicativos?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim, o Reelser funciona diretamente pelo navegador Safari no iPhone/iPad e Chrome no Android, além de computadores Windows e Mac.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div lang="pt">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection
        initialTab="reels"
        customTitle="Baixar Reels, Vídeos e Stories do Instagram Grátis"
        customDescription="Salve Reels em MP4 Full HD, Stories anônimos, Fotos de carrossel e Áudio MP3 na qualidade original sem marca d'água e sem precisar de login."
      />

      {/* Portuguese Value Propositions */}
      <div className="bg-gray-50 border-b border-gray-100 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrossLanguageLinksBar currentLocale="pt" />
        </div>
      </div>
      <section className="py-12 sm:py-16 bg-gradient-to-b from-pink-50/40 via-white to-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suíte Completa de Ferramentas para Instagram</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900">
              Todos os Utilitários de Download em um Só Lugar
            </h2>
            <p className="text-base text-gray-600 leading-relaxed">
              Sem instalar aplicativos ou extensões: o Reelser conecta-se diretamente aos servidores de origem para oferecer downloads limpos, rápidos e seguros.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Qualidade Original 1080p sem Marca d'Água
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Baixe o arquivo MP4 ou JPG nativo sem compressão adicional e sem logotipos sobrepostos.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Visualizador Anônimo de Stories por @usuario
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Assista e salve stories diários e destaques de contas públicas em modo 100% invisível.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Conversor de Reels para MP3 Integrado
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Extraia a faixa de áudio ou música de qualquer Reel em formato MP3 pronto para ouvir offline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Portuguese Tools Directory (All 15 Portuguese pSEO Pages) */}
      <section className="py-12 sm:py-16 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-pink-700 border border-pink-100">
              <Layers className="w-3.5 h-3.5" />
              <span>Diretório de Ferramentas em Português ({pages.length})</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3">
              Escolha a Ferramenta Especializada que Você Precisa
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Guias passo a passo e baixadores otimizados para iPhone, Android, Stories anônimos, carrosséis e MP3
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((item) => (
              <Link
                key={item.slug}
                href={`/pt/${item.slug}`}
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

      {/* Portuguese FAQ Section */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Perguntas Frequentes</span>
            </span>
            <h2 className="text-2xl font-black text-gray-900">
              Dúvidas Frequentes sobre o Reelser em Português
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Como baixar Reels do Instagram sem marca d&apos;água?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Copie o link do Reel no app do Instagram, cole na barra de pesquisa acima e clique no botão de download MP4 para obter o vídeo em Full HD sem marcas d&apos;água.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                Posso ver e baixar stories do Instagram de forma anônima?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sim. Digite o @usuario de qualquer perfil público para assistir e baixar seus stories ativos e destaques sem fazer login e sem aparecer na lista de visualizações.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50/70 border border-gray-200/80 space-y-2">
              <h3 className="text-base font-bold text-gray-900">
                O Reelser funciona no iPhone e Android sem instalar aplicativos?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sim, funciona diretamente pelo Safari no iPhone/iPad e Chrome no Android, além de qualquer navegador no PC ou Mac.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
