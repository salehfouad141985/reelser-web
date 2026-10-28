import React from "react";
import Link from "next/link";
import { getEquivalentLanguageLinks, HubLocale } from "@/lib/localeRoutes";
import { Globe } from "lucide-react";

interface CrossLanguageLinksBarProps {
  enSlug?: string;
  currentLocale: HubLocale;
}

const BAR_LABELS: Record<HubLocale, string> = {
  en: "Available in:",
  ar: "متوفر بلغات أخرى:",
  es: "Disponible en:",
  pt: "Disponível em:",
  fr: "Disponible en :",
  tr: "Diğer diller:",
  id: "Tersedia dalam:",
  de: "Verfügbar in:",
  ru: "Доступно на:",
};

export function CrossLanguageLinksBar({ enSlug, currentLocale }: CrossLanguageLinksBarProps) {
  const links = getEquivalentLanguageLinks(enSlug);

  return (
    <div className="flex flex-wrap items-center gap-1.5 pt-2 mt-2 border-t border-gray-200/60 text-[11px] text-gray-500">
      <span className="inline-flex items-center gap-1 font-semibold text-gray-600">
        <Globe className="w-3.5 h-3.5 text-pink-600" />
        <span>{BAR_LABELS[currentLocale]}</span>
      </span>
      {links.map((item) => {
        const isCurrent = item.code === currentLocale;
        return (
          <Link
            key={item.code}
            href={item.href}
            hrefLang={item.code}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors ${
              isCurrent
                ? "bg-pink-100 text-pink-700 font-bold"
                : "bg-white border border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600 font-medium"
            }`}
          >
            <span>{item.flag}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
