"use client";

import React, { useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { MediaCard } from "./MediaCard";
import { MediaResult } from "@/lib/instagramExtractor";
import { Clipboard, Download, Loader2, Sparkles, X, Video, Image as ImageIcon, Music, UserCheck, AlertCircle } from "lucide-react";

interface HeroSectionProps {
  initialTab?: "reels" | "story" | "photo" | "audio" | "profile";
  customTitle?: string;
  customDescription?: string;
}

export function HeroSection({
  initialTab = "reels",
  customTitle,
  customDescription,
}: HeroSectionProps) {
  const { t, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaResult, setMediaResult] = useState<MediaResult | null>(null);

  const tabs = [
    { id: "reels", label: t("tabReels"), icon: Video },
    { id: "story", label: t("tabStory"), icon: Video },
    { id: "photo", label: t("tabPhoto"), icon: ImageIcon },
    { id: "audio", label: t("tabAudio"), icon: Music },
    { id: "profile", label: t("tabProfile"), icon: UserCheck },
  ];

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setError(null);
      }
    } catch {
      // Permission denied or not supported
    }
  };

  const handleClear = () => {
    setUrl("");
    setError(null);
    setMediaResult(null);
  };

  const getPlaceholder = () => {
    if (activeTab === "profile") return t("inputPlaceholderProfile");
    if (activeTab === "story") return t("inputPlaceholderStory");
    if (activeTab === "reels") return t("inputPlaceholderReels");
    return t("inputPlaceholder");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setMediaResult(null);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), tab: activeTab }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to extract Instagram media");
      }

      setMediaResult(data.data);
    } catch (err: any) {
      setError(
        err.message ||
          "Could not download this link. Please ensure it is a public Instagram post or account and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-radial from-pink-50/70 via-white to-orange-50/40">
      {/* Decorative gradient blur circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-pink-300/30 to-amber-200/30 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-pink-100 via-purple-100 to-amber-100 text-pink-700 border border-pink-200 shadow-2xs mb-6">
          <Sparkles className="w-3.5 h-3.5 text-pink-600" />
          <span>#1 Free Instagram Downloader HD</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto">
          {customTitle || (
            <>
              Download Instagram{" "}
              <span className="bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] bg-clip-text text-transparent">
                Reels & Videos
              </span>{" "}
              in Full HD
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
          {customDescription || t("tagline")}
        </p>

        {/* Media Category Tabs */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center p-1.5 bg-gray-100/80 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-inner max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-pink-600 shadow-sm shadow-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & URL Input Box */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 max-w-3xl mx-auto relative group"
        >
          <div className="relative flex flex-col sm:flex-row items-center bg-white p-2 rounded-2xl sm:rounded-full border-2 border-pink-200 focus-within:border-pink-500 shadow-xl shadow-pink-500/10 transition-all">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={getPlaceholder()}
              dir={isRtl ? "rtl" : "ltr"}
              className="w-full px-4 py-3.5 sm:py-3 text-base text-gray-900 placeholder-gray-600 bg-transparent border-0 focus:outline-hidden focus:ring-0"
              required
            />

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end px-2 pt-2 sm:pt-0 shrink-0">
              {url && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 text-gray-600 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  title="Clear"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              <button
                type="button"
                onClick={handlePaste}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>{t("btnPaste")}</span>
              </button>

              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl sm:rounded-full font-bold text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 shadow-lg shadow-pink-500/25 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t("btnDownloading")}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>{t("btnDownload")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="mt-4 max-w-2xl mx-auto flex items-center gap-2.5 p-3.5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl text-left animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Extracted Result Card */}
        {mediaResult && <MediaCard media={mediaResult} />}
      </div>
    </section>
  );
}
