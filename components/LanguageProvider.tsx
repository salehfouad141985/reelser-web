"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Detect stored language or browser language
    const saved = localStorage.getItem("reelser_locale") as Locale | null;
    if (saved && AVAILABLE_LOCALES.some((l) => l.code === saved)) {
      setLocaleState(saved);
      return;
    }

    const browserLang = navigator.language.slice(0, 2).toLowerCase() as Locale;
    if (AVAILABLE_LOCALES.some((l) => l.code === browserLang)) {
      setLocaleState(browserLang);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("reelser_locale", newLocale);
    const info = AVAILABLE_LOCALES.find((l) => l.code === newLocale);
    if (info) {
      document.documentElement.lang = info.code;
      document.documentElement.dir = info.dir;
    }
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
