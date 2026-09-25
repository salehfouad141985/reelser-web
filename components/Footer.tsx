"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { Video, Heart, ExternalLink, ShieldCheck } from "lucide-react";

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white">
                <Video className="w-4 h-4 fill-white/20" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Reelser
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              The world&apos;s leading fast & free Instagram media downloader. Save Reels, Stories, Photos, and Audio in pristine HD 1080p without watermark.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Free & No Registration</span>
            </div>
          </div>

          {/* Dedicated Tools */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Instagram Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/reels" className="hover:text-pink-400 transition-colors">
                  Instagram Reels Downloader
                </Link>
              </li>
              <li>
                <Link href="/story-saver" className="hover:text-pink-400 transition-colors">
                  Instagram Story & Highlights Saver
                </Link>
              </li>
              <li>
                <Link href="/photo-downloader" className="hover:text-pink-400 transition-colors">
                  Instagram Photo & Carousel Downloader
                </Link>
              </li>
              <li>
                <Link href="/audio-downloader" className="hover:text-pink-400 transition-colors">
                  Instagram Audio & MP3 Extractor
                </Link>
              </li>
              <li>
                <Link href="/profile-downloader" className="hover:text-pink-400 transition-colors">
                  Instagram Profile Picture (DP) Downloader
                </Link>
              </li>
            </ul>
          </div>

          {/* Sister Network & Partners */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Multi-Platform Network
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="https://saveyou2be.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 font-semibold transition-colors"
                >
                  <span>SaveYou2be (All-in-One Downloader)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://saveyou2be.com/download-tiktok-video"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-colors"
                >
                  TikTok Video Downloader (No Watermark)
                </a>
              </li>
              <li>
                <a
                  href="https://saveyou2be.com/download-youtube-videos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-200 transition-colors"
                >
                  YouTube to MP4 & MP3 Converter
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Terms */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Legal & Policy
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/terms" className="hover:text-gray-200 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-200 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="hover:text-gray-200 transition-colors">
                  DMCA & Copyright Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="text-center md:text-left max-w-2xl">
            {t("footerDisclaimer")}
          </p>
          <p className="shrink-0">
            © {currentYear} Reelser.com. {t("footerRights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
