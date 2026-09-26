"use client";

import React from "react";
import { useLanguage } from "./LanguageProvider";
import {
  Copy,
  Link2,
  Download,
  Sparkles,
  CheckCircle2,
  Share2,
  Heart,
  MessageCircle,
  Play,
  Music,
  Film,
  Check,
  Zap,
} from "lucide-react";

interface HowToSectionProps {
  customTitle?: string;
  customSubtitle?: string;
}

export function HowToSection({ customTitle, customSubtitle }: HowToSectionProps) {
  const { t, isRtl } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50/70 via-white to-gray-50/50 overflow-hidden relative">
      {/* Background soft ambient glows */}
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-pink-200/20 blur-3xl rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-200/20 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-pink-100/70 text-pink-700 border border-pink-200/70 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span>3 Simple Steps • 3 خطوات بسيطة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            {customTitle || t("howToTitle")}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-medium">
            {customSubtitle ||
              (isRtl
                ? "دليل توضيحي مرئي لكيفية تحميل مقاطع الريلز، الستوري، الصور والحسابات بأسهل طريقة."
                : "Illustrated step-by-step guide to download Reels, Stories, Photos & Profile DP in full quality.")}
          </p>
        </div>

        {/* 3 Step Visual Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative items-stretch">
          {/* ================= STEP 1: COPY LINK OR NICKNAME ================= */}
          <div className="flex flex-col bg-white rounded-3xl border border-gray-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-7 relative overflow-hidden group">
            {/* Top Badge & Number */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-50 text-pink-700 border border-pink-200">
                <Copy className="w-3.5 h-3.5" />
                <span>{t("stepBadge1") || "Step 01"}</span>
              </span>
              <span className="text-4xl font-black text-gray-200 group-hover:text-pink-200 transition-colors">
                01
              </span>
            </div>

            {/* Text description */}
            <h3 className="text-xl font-black text-gray-900 mb-2 leading-snug">
              {t("step1Title")}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
              {t("step1Desc")}
            </p>

            {/* VISUAL ILLUSTRATION: Instagram Post & Share Menu Mockup */}
            <div className="mt-auto pt-2">
              <div className="bg-gray-900 text-white rounded-2xl p-4 shadow-inner border border-gray-800 relative select-none">
                {/* Simulated Instagram Post Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-800/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600">
                      <div className="w-full h-full rounded-full bg-gray-950 flex items-center justify-center text-[10px] font-bold text-pink-300">
                        IG
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1">
                        <span>instagram_creator</span>
                        <CheckCircle2 className="w-3 h-3 text-blue-400 inline" />
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">Original Audio</span>
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs font-black tracking-widest">•••</span>
                </div>

                {/* Simulated Reel Preview */}
                <div className="relative my-3 h-28 rounded-xl bg-gradient-to-br from-purple-900/60 via-pink-900/40 to-amber-900/40 border border-white/5 flex items-center justify-center overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white/90">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/60 text-white">
                    00:30
                  </span>
                </div>

                {/* Post Action Icons Bar */}
                <div className="flex items-center justify-between text-gray-400 pt-1">
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                    <MessageCircle className="w-4 h-4" />
                    {/* Highlighted Share Plane */}
                    <div className="relative">
                      <div className="p-1 rounded-full bg-pink-500/20 text-pink-400 ring-2 ring-pink-500 animate-pulse">
                        <Share2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">
                    {isRtl ? "اضغط مشاركة" : "Tap Share"}
                  </span>
                </div>

                {/* Simulated Floating "Copy Link" Action Sheet */}
                <div className="mt-3 bg-gray-800/95 border border-pink-500/40 rounded-xl p-2.5 shadow-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-pink-600 flex items-center justify-center text-white shadow-xs">
                      <Copy className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">
                        {isRtl ? "نسخ الرابط / اسم الحساب" : "Copy Link / @nickname"}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {isRtl ? "تم النسخ للحافظة ✓" : "Copied to clipboard ✓"}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/30">
                    Copied
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= STEP 2: PASTE IN REELSER ================= */}
          <div className="flex flex-col bg-white rounded-3xl border-2 border-pink-500/40 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 sm:p-7 relative overflow-hidden group">
            {/* Top Badge & Number */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xs">
                <Link2 className="w-3.5 h-3.5" />
                <span>{t("stepBadge2") || "Step 02"}</span>
              </span>
              <span className="text-4xl font-black text-pink-500/30 group-hover:text-pink-500/50 transition-colors">
                02
              </span>
            </div>

            {/* Text description */}
            <h3 className="text-xl font-black text-gray-900 mb-2 leading-snug">
              {t("step2Title")}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
              {t("step2Desc")}
            </p>

            {/* VISUAL ILLUSTRATION: Reelser Search Input Mockup */}
            <div className="mt-auto pt-2">
              <div className="bg-gradient-to-b from-gray-50 to-white rounded-2xl p-4 shadow-inner border border-gray-200/90 relative select-none">
                {/* Reelser Brand Bar */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <div className="flex items-center gap-1.5 font-black bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] bg-clip-text text-transparent">
                    <Sparkles className="w-3.5 h-3.5 text-pink-600 inline" />
                    <span>Reelser Search</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-500">
                    <span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-700 font-bold">Reels</span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100">Story</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 font-bold">@User</span>
                  </div>
                </div>

                {/* Simulated Glowing Input Bar */}
                <div className="relative rounded-xl border-2 border-pink-500/80 bg-white p-2.5 shadow-lg shadow-pink-500/15 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden text-left flex-1" dir="ltr">
                    <div className="w-2 h-2 rounded-full bg-pink-500 animate-ping shrink-0" />
                    <span className="text-xs font-mono font-medium text-gray-800 truncate">
                      https://instagram.com/reel/... <span className="text-pink-600 font-bold">or @user</span>
                    </span>
                  </div>
                  <span className="shrink-0 px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold border border-gray-200">
                    {t("btnPaste") || "Paste"}
                  </span>
                </div>

                {/* Simulated Download Action Button */}
                <div className="mt-3">
                  <div className="w-full py-2.5 rounded-xl font-black text-xs text-white bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 cursor-default">
                    <Zap className="w-4 h-4 fill-current" />
                    <span>{isRtl ? "اضغط زر التحميل (Download)" : "Click Download Button"}</span>
                  </div>
                </div>

                {/* Auto Detection Badge */}
                <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-500">
                  <Check className="w-3 h-3 text-green-500" />
                  <span>
                    {isRtl
                      ? "تعرف تلقائي فوري على الروابط وأسماء المستخدمين (@)"
                      : "Auto-detects URLs, Stories & @usernames"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= STEP 3: DOWNLOAD HD MEDIA ================= */}
          <div className="flex flex-col bg-white rounded-3xl border border-gray-200/80 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 sm:p-7 relative overflow-hidden group">
            {/* Top Badge & Number */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                <Download className="w-3.5 h-3.5" />
                <span>{t("stepBadge3") || "Step 03"}</span>
              </span>
              <span className="text-4xl font-black text-gray-200 group-hover:text-green-200 transition-colors">
                03
              </span>
            </div>

            {/* Text description */}
            <h3 className="text-xl font-black text-gray-900 mb-2 leading-snug">
              {t("step3Title")}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 font-medium">
              {t("step3Desc")}
            </p>

            {/* VISUAL ILLUSTRATION: Result Card & HD Download Buttons Mockup */}
            <div className="mt-auto pt-2">
              <div className="bg-gray-50 rounded-2xl p-4 shadow-inner border border-gray-200/80 relative select-none">
                {/* Media Header Preview Info */}
                <div className="flex items-center gap-2.5 mb-3 bg-white p-2 rounded-xl border border-gray-100 shadow-2xs">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 shrink-0">
                    <Film className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-gray-900 block truncate">
                      Instagram Reel #HD1080p
                    </span>
                    <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready for Download
                    </span>
                  </div>
                </div>

                {/* Simulated Download Video Button (Primary) */}
                <div className="space-y-2">
                  <div className="w-full py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-pink-600 to-rose-600 shadow-sm flex items-center justify-between cursor-default">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4" />
                      <span>{isRtl ? "تحميل فيديو MP4 (Full HD)" : "Download Video (1080p MP4)"}</span>
                    </div>
                    <Download className="w-4 h-4 animate-bounce" />
                  </div>

                  {/* Simulated Download Audio Button (Secondary) */}
                  <div className="w-full py-2 px-3 rounded-xl font-bold text-xs text-gray-800 bg-white border border-gray-200 shadow-2xs flex items-center justify-between cursor-default hover:bg-gray-50">
                    <div className="flex items-center gap-2 text-purple-700">
                      <Music className="w-4 h-4" />
                      <span>{isRtl ? "تحميل الصوت النقي (MP3)" : "Download Clean Audio (MP3)"}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-400">192 kbps</span>
                  </div>
                </div>

                {/* Security and Quality Trust Seals */}
                <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500">
                  <span className="text-green-600">✓ بدون علامة مائية</span>
                  <span>•</span>
                  <span>مجاني 100%</span>
                  <span>•</span>
                  <span>سرعة فائقة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
