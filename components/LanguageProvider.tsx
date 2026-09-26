"use client";

import React, { createContext, useContext, useSyncExternalStore, useEffect } from "react";
import { UI_TEXT } from "@/lib/uiText";
import { Locale, AVAILABLE_LOCALES, TRANSLATIONS, LocaleInfo } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  currentLocaleInfo: LocaleInfo;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
  currentLocaleInfo: AVAILABLE_LOCALES[0],
  isRtl: false,
});

function readLocale(): Locale {
  let saved: string | null = null;
  try { saved = localStorage.getItem("reelser_locale"); } catch {}
  const candidate = saved || navigator.language.slice(0, 2).toLowerCase();
  return AVAILABLE_LOCALES.some(item => item.code === candidate) ? candidate as Locale : "en";
}
function subscribeLocale(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("reelser-locale", listener);
  return () => { window.removeEventListener("storage", listener); window.removeEventListener("reelser-locale", listener); };
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribeLocale, readLocale, () => "en" as Locale);
  const setLocale = (next: Locale) => {
    try { localStorage.setItem("reelser_locale", next); } catch {}
    window.dispatchEvent(new Event("reelser-locale"));
  };

  useEffect(() => {
    const info = AVAILABLE_LOCALES.find((l) => l.code === locale) || AVAILABLE_LOCALES[0];
    document.documentElement.lang = info.code;
    document.documentElement.dir = info.dir;
  }, [locale]);

  const currentLocaleInfo =
    AVAILABLE_LOCALES.find((l) => l.code === locale) || AVAILABLE_LOCALES[0];
  const isRtl = currentLocaleInfo.dir === "rtl";

  const t = (key: string): string => {
    if (key === "faq1A") return UI_TEXT[locale]["Free with usage limits to keep the service available."];
    if (UI_TEXT[locale][key]) return UI_TEXT[locale][key];
    const localeDict = TRANSLATIONS[locale] || TRANSLATIONS.en;
    if (localeDict && localeDict[key]) return localeDict[key];
    const enDict = TRANSLATIONS.en;
    return enDict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, currentLocaleInfo, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
