"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageProvider";
import { AVAILABLE_LOCALES } from "@/lib/i18n";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navItems = [
    {
      href: "/reels",
      label: t("navReels") || "ريلز وفيديو (Reels / IG Video)",
      icon: Film,
      isExternal: false,
    },
    {
      href: "/story-saver",
      label: t("navStories") || "ستوري (Stories & Viewer)",
      icon: Video,
      isExternal: false,
    },
    {
      href: "/photo-downloader",
      label: t("navPhotos") || "صور (Photos)",
      icon: ImageIcon,
      isExternal: false,
    },
    {
      href: "/profile-downloader",
      label: t("navAvatar") || "صورة البروفايل (IG Avatar / DP)",
      icon: UserCheck,
      isExternal: false,
    },
    {
      href: "/audio-downloader",
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

  return (
    <header className="sticky top-0 z-50 shadow-md bg-gradient-to-r from-[#1d4ed8] via-[#0284c7] to-[#0891b2] text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Brand (Matching InstaSuperSave format) */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 border border-white/30 backdrop-blur-xs flex items-center justify-center text-white shadow-sm group-hover:bg-white/25 transition-all">
              <div className="relative">
                <Video className="w-5 h-5 fill-white/20 text-white" />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-pink-400 border border-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 font-black text-xl sm:text-2xl tracking-tight leading-none text-white">
                <span>REELSER</span>
              </div>
              <span className="text-[10px] text-cyan-100 font-semibold tracking-wider uppercase opacity-90">
                SuperSave Downloader
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Bar */}
          <nav className="hidden xl:flex items-center gap-1 lg:gap-1.5 flex-1 justify-center max-w-4xl mx-2">
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
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all bg-white/15 hover:bg-white/25 text-white border border-white/30 shadow-xs hover:scale-105 active:scale-95"
                  >
                    <Icon className="w-3.5 h-3.5 text-blue-200" />
                    <span>{item.label}</span>
                    <ExternalLink className="w-3 h-3 text-cyan-200 opacity-80" />
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-white/25 text-white shadow-inner font-extrabold border border-white/30"
                      : "text-white/90 hover:text-white hover:bg-white/15"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 opacity-90" />
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
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-white/25 text-white font-extrabold"
                      : "text-white/90 hover:text-white hover:bg-white/15"
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
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <span>Facebook</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </nav>

          {/* Right Actions: Language Switcher & Mobile Menu Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-white bg-white/15 border border-white/30 rounded-xl hover:bg-white/25 transition-all cursor-pointer backdrop-blur-xs shadow-xs"
                aria-expanded={langMenuOpen}
              >
                <span>{currentLocaleInfo.flag}</span>
                <span className="hidden sm:inline">{currentLocaleInfo.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-white/80" />
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
                        onClick={() => {
                          setLocale(item.code);
                          setLangMenuOpen(false);
                        }}
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
              className="md:hidden p-2 rounded-xl text-white hover:bg-white/20 focus:outline-hidden transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/15 bg-gradient-to-b from-[#1d4ed8] to-[#0369a1] px-4 pt-3 pb-5 space-y-1.5 shadow-xl animate-in slide-in-from-top-2">
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
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-cyan-200" />
                    <span>{item.label}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-cyan-200" />
                </a>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-white/25 text-white border border-white/30 shadow-inner"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
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
