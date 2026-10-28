"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import { AVAILABLE_LOCALES, Locale } from "@/lib/i18n";
import { detectPathnameLocale, resolveLocalizedPath } from "@/lib/localeRoutes";
import {
  Video,
  Image as ImageIcon,
  Music,
  UserCheck,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  Film,
  Share2,
} from "lucide-react";

export function Navbar() {
  const { locale, setLocale, t, currentLocaleInfo, isRtl } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const activeHubLocale = pathname ? detectPathnameLocale(pathname) : null;
  const homeHref = activeHubLocale ? `/${activeHubLocale}` : "/";

  const localizedNavPaths: Record<string, Record<string, string>> = {
    ar: {
      reels: "/ar/instagram-reels-download",
      story: "/ar/instagram-story-saver",
      photo: "/ar/instagram-photo-download",
      profile: "/ar/instagram-dp-viewer",
      audio: "/ar/instagram-audio-mp3",
    },
    es: {
      reels: "/es/descargar-reels-instagram",
      story: "/es/descargar-historias-instagram",
      photo: "/es/descargar-fotos-instagram",
      profile: "/es/descargar-foto-perfil-instagram",
      audio: "/es/convertir-instagram-a-mp3",
    },
    pt: {
      reels: "/pt/baixar-reels-instagram",
      story: "/pt/baixar-stories-instagram",
      photo: "/pt/baixar-fotos-instagram",
      profile: "/pt/baixar-foto-perfil-instagram",
      audio: "/pt/converter-instagram-para-mp3",
    },
    fr: {
      reels: "/fr/telecharger-reel-instagram",
      story: "/fr/telecharger-story-instagram",
      photo: "/fr/telecharger-photo-instagram",
      profile: "/fr/telecharger-photo-profil-instagram",
      audio: "/fr/convertir-instagram-en-mp3",
    },
    tr: {
      reels: "/tr/instagram-reels-indirme",
      story: "/tr/instagram-hikaye-indirme",
      photo: "/tr/instagram-fotograf-indirme",
      profile: "/tr/instagram-profil-fotografi-buyutme",
      audio: "/tr/instagram-mp3-ses-indirme",
    },
    id: {
      reels: "/id/download-reels-ig",
      story: "/id/download-story-ig",
      photo: "/id/download-foto-ig",
      profile: "/id/download-foto-profil-ig-hd",
      audio: "/id/convert-instagram-ke-mp3",
    },
    de: {
      reels: "/de/instagram-reels-herunterladen",
      story: "/de/instagram-story-herunterladen",
      photo: "/de/instagram-fotos-herunterladen",
      profile: "/de/instagram-profilbild-vergroessern-hd",
      audio: "/de/instagram-in-mp3-umwandeln",
    },
    ru: {
      reels: "/ru/skachat-reels-instagram",
      story: "/ru/skachat-storis-instagram",
      photo: "/ru/skachat-foto-instagram",
      profile: "/ru/skachat-avatarku-instagram-hd",
      audio: "/ru/konvertirovat-instagram-v-mp3",
    },
  };

  const navMap = activeHubLocale ? localizedNavPaths[activeHubLocale] : null;

  const navItems = [
    {
      href: navMap?.reels || "/reels",
      label: t("navReels") || "ريلز وفيديو (Reels / IG Video)",
      icon: Film,
      isExternal: false,
    },
    {
      href: navMap?.story || "/story-saver",
      label: t("navStories") || "ستوري (Stories & Viewer)",
      icon: Video,
      isExternal: false,
    },
    {
      href: navMap?.photo || "/photo-downloader",
      label: t("navPhotos") || "صور (Photos)",
      icon: ImageIcon,
      isExternal: false,
    },
    {
      href: navMap?.profile || "/profile-downloader",
      label: t("navAvatar") || "صورة البروفايل (IG Avatar / DP)",
      icon: UserCheck,
      isExternal: false,
    },
    {
      href: navMap?.audio || "/audio-downloader",
      label: t("navAudio") || "صوت (Audio MP3)",
      icon: Music,
      isExternal: false,
    },
    {
      href: "https://saveyou2be.com/facebook",
      label: t("navFacebook") || "تحميل فيسبوك (Facebook Downloader)",
      icon: Share2,
      isExternal: true,
      highlight: true,
    },
  ];

  const handleLanguageSelect = (targetCode: Locale) => {
    setLocale(targetCode);
    setLangMenuOpen(false);
    const targetPath = resolveLocalizedPath(pathname || "/", targetCode);
    if (targetPath && targetPath !== pathname) {
      router.push(targetPath);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px] gap-2">
          {/* Logo & Brand — same palette as Hero/Footer */}
          <Link href={homeHref} className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:shadow-pink-500/30 transition-all">
              <Video className="w-5 h-5 fill-white/20 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl sm:text-[22px] tracking-tight leading-none text-gray-900">
                REELSER
              </span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
                SuperSave Downloader
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Bar — light, fits Hero/Features */}
          <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center max-w-4xl mx-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = !item.isExternal && pathname === item.href;

              if (item.isExternal) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="تحميل فيديوهات فيسبوك مجاناً عبر SaveYou2be"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all bg-gray-900 text-white hover:bg-black border border-gray-900 shadow-sm hover:shadow active:scale-95"
                  >
                    <Icon className="w-3.5 h-3.5 text-white/80" />
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3 text-white/60" />
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-80" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Medium Screens Navigation (Compact) */}
          <nav className="hidden md:flex xl:hidden items-center gap-1 flex-1 justify-center">
            {navItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label.split("(")[0].trim()}</span>
                </Link>
              );
            })}
            <a
              href="https://saveyou2be.com/facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold bg-gray-900 text-white border border-gray-900"
            >
              <span>Facebook</span>
              <ExternalLink className="w-3 h-3 text-white/60" />
            </a>
          </nav>

          {/* Right Actions: Language Switcher & Mobile Menu Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-all cursor-pointer shadow-xs"
                aria-expanded={langMenuOpen}
              >
                <span>{currentLocaleInfo.flag}</span>
                <span className="hidden sm:inline">{currentLocaleInfo.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div
                    className={`absolute ${
                      isRtl ? "left-0" : "right-0"
                    } mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 py-1.5 max-h-80 overflow-y-auto text-gray-900 animate-in fade-in zoom-in-95`}
                  >
                    {AVAILABLE_LOCALES.map((item) => (
                      <button
                        key={item.code}
                        onClick={() => handleLanguageSelect(item.code)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-left hover:bg-gray-50 transition-colors cursor-pointer ${
                          locale === item.code ? "text-blue-600 font-bold bg-blue-50/70" : "text-gray-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm">{item.flag}</span>
                          <span>{item.nativeName}</span>
                        </span>
                        {locale === item.code && (
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-hidden transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer — light like Hero */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-1.5 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = !item.isExternal && pathname === item.href;

            if (item.isExternal) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold bg-gray-900 text-white hover:bg-black border border-gray-900 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-white/80" />
                    <span>{item.label}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/60" />
                </a>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-full text-sm font-bold transition-all ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
