"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { Video, ExternalLink, ShieldCheck } from "lucide-react";

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
              The world&apos;s leading fast & free Instagram media downloader. Save Reels, Stories, Photos, and Audio in available quality without watermark.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>100% Free & No Registration</span>
            </div>
          </div>

          {/* Dedicated Tools */}
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Instagram Tools
            </h2>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/reels" className="hover:text-pink-400 transition-colors">
                  Instagram Reels Downloader
                </Link>
              </li>
              <li>
                <Link href="/story-saver" className="hover:text-pink-400 transition-colors">
                  Instagram Story Saver
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
              <li>
                <Link href="/ar" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  النسخة العربية (Arabic Downloader)
                </Link>
              </li>
              <li>
                <Link href="/es" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  Versión en Español (Spanish Hub)
                </Link>
              </li>
              <li>
                <Link href="/pt" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  Versão em Português (Portuguese Hub)
                </Link>
              </li>
              <li>
                <Link href="/fr" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  Version en Français (French Hub)
                </Link>
              </li>
              <li>
                <Link href="/tr" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  Türkçe Sürüm (Turkish Hub)
                </Link>
              </li>
              <li>
                <Link href="/id" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  Versi Bahasa Indonesia (Indonesian Hub)
                </Link>
              </li>
              <li>
                <Link href="/de" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  Deutsche Version (German Hub)
                </Link>
              </li>
              <li>
                <Link href="/ru" className="text-pink-400 hover:text-pink-300 font-semibold transition-colors">
                  Русская Версия (Russian Hub)
                </Link>
              </li>
            </ul>
          </div>

          {/* Sister Network & Partners */}
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Multi-Platform Network
            </h2>
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
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Legal & Policy
            </h2>
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

        {/* Popular Programmatic SEO Topics & Tool Hubs */}
        <div className="mt-12 pt-8 border-t border-gray-900">
          <div className="text-center md:text-left mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Popular Tools & Topics
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <Link href="/instagram-reels-without-watermark" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
              Reels Without Watermark
            </Link>
            <Link href="/instagram-to-mp4" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
              Instagram to MP4
            </Link>
            <Link href="/reels-download-hd" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
              Reels Download HD (1080p)
            </Link>
            <Link href="/storiesig-viewer" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
              StoriesIG Viewer
            </Link>
            <Link href="/instagram-story-download-with-music" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
              Story Download with Music
            </Link>
            <Link href="/instagram-carousel-download" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
              Instagram Carousel Downloader
            </Link>
            <Link href="/instagram-audio-download" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
              Instagram Audio & MP3
            </Link>
            <Link href="/instagram-dp-download" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
              Profile Picture (DP) Full HD
            </Link>
            <Link href="/saveinsta-alternative" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
              SaveInsta Alternative
            </Link>
            <Link href="/snapinsta-alternative" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
              SnapInsta Alternative
            </Link>
            <Link href="/ssinstagram-alternative" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
              SSInstagram Alternative
            </Link>
            <Link href="/save-instagram-reels" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
              Save Reels to Camera Roll
            </Link>
          </div>

          {/* Arabic Programmatic SEO Topics */}
          <div className="mt-6 pt-6 border-t border-gray-900/80" dir="rtl" lang="ar">
            <div className="text-center md:text-right mb-3">
              <h3 className="text-xs font-bold text-pink-400">
                أدوات التحميل العربية (Arabic Tools)
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <Link href="/ar" className="px-2.5 py-1 rounded-md bg-pink-950/40 border border-pink-800/40 text-pink-300 hover:text-white hover:bg-pink-900/50 transition-colors font-semibold">
                الرئيسية العربية
              </Link>
              <Link href="/ar/instagram-reels-download" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                تحميل ريلز انستقرام بدون علامة مائية
              </Link>
              <Link href="/ar/instagram-story-saver" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                تحميل ستوري انستا سري
              </Link>
              <Link href="/ar/instagram-video-downloader" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                تحميل فيديو من الانستقرام MP4
              </Link>
              <Link href="/ar/instagram-photo-download" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                تحميل صور انستقرام HD
              </Link>
              <Link href="/ar/instagram-audio-mp3" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                تحميل صوت ريلز MP3
              </Link>
              <Link href="/ar/instagram-dp-viewer" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                تكبير صورة بروفايل انستا
              </Link>
              <Link href="/ar/download-reels-iphone" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                تحميل ريلز للايفون
              </Link>
              <Link href="/ar/download-reels-android" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                تحميل ريلز للاندرويد
              </Link>
              <Link href="/ar/anonymous-story-viewer" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                مشاهدة ستوري مخفي
              </Link>
              <Link href="/ar/story-download-with-music" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                حفظ ستوري مع الموسيقى
              </Link>
              <Link href="/ar/instagram-highlights-download" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                تحميل هايلايت انستقرام
              </Link>
              <Link href="/ar/instagram-profile-viewer" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                تصفح انستقرام بدون حساب
              </Link>
              <Link href="/ar/instagram-carousel-downloader" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                تحميل ألبوم صور انستا
              </Link>
              <Link href="/ar/reels-download-4k-hd" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                تنزيل ريلز 1080p HD
              </Link>
              <Link href="/ar/saveinsta-arabic-alternative" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                بديل SaveInsta العربي
              </Link>
            </div>
          </div>

          {/* Spanish Programmatic SEO Topics */}
          <div className="mt-6 pt-6 border-t border-gray-900/80" lang="es">
            <div className="text-center md:text-left mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Herramientas en Español (Spanish Tools)
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <Link href="/es" className="px-2.5 py-1 rounded-md bg-pink-950/40 border border-pink-800/40 text-pink-300 hover:text-white hover:bg-pink-900/50 transition-colors font-semibold">
                Inicio Español
              </Link>
              <Link href="/es/descargar-reels-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Descargar Reels sin Marca de Agua
              </Link>
              <Link href="/es/descargar-historias-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Descargar Historias Anónimo
              </Link>
              <Link href="/es/descargar-videos-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Descargar Videos MP4
              </Link>
              <Link href="/es/descargar-fotos-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Descargar Fotos HD
              </Link>
              <Link href="/es/convertir-instagram-a-mp3" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Convertir Reels a MP3
              </Link>
              <Link href="/es/descargar-foto-perfil-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Foto de Perfil en Grande
              </Link>
              <Link href="/es/descargar-reels-iphone" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Descargar Reels en iPhone
              </Link>
              <Link href="/es/descargar-reels-android" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Descargar Reels en Android
              </Link>
              <Link href="/es/ver-historias-instagram-anonimo" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Ver Historias sin Cuenta
              </Link>
              <Link href="/es/descargar-historias-con-musica" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Historias con Música
              </Link>
              <Link href="/es/descargar-destacadas-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Descargar Destacadas
              </Link>
              <Link href="/es/visor-perfiles-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Visor de Perfiles
              </Link>
              <Link href="/es/descargar-carrusel-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Descargar Carrusel
              </Link>
              <Link href="/es/descargar-reels-hd-1080p" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Reels Full HD 1080p
              </Link>
              <Link href="/es/alternativa-saveinsta-snapinsta" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Alternativa a SaveInsta
              </Link>
            </div>
          </div>

          {/* Portuguese Programmatic SEO Topics */}
          <div className="mt-6 pt-6 border-t border-gray-900/80" lang="pt">
            <div className="text-center md:text-left mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Ferramentas em Português (Portuguese Tools)
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <Link href="/pt" className="px-2.5 py-1 rounded-md bg-pink-950/40 border border-pink-800/40 text-pink-300 hover:text-white hover:bg-pink-900/50 transition-colors font-semibold">
                Início Português
              </Link>
              <Link href="/pt/baixar-reels-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Baixar Reels sem Marca d&apos;Água
              </Link>
              <Link href="/pt/baixar-stories-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Baixar Stories Anônimo
              </Link>
              <Link href="/pt/baixar-videos-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Baixar Vídeos MP4
              </Link>
              <Link href="/pt/baixar-fotos-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Baixar Fotos HD
              </Link>
              <Link href="/pt/converter-instagram-para-mp3" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Converter Reels para MP3
              </Link>
              <Link href="/pt/baixar-foto-perfil-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Foto de Perfil em HD
              </Link>
              <Link href="/pt/baixar-reels-iphone" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Baixar Reels no iPhone
              </Link>
              <Link href="/pt/baixar-reels-android" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Baixar Reels no Android
              </Link>
              <Link href="/pt/ver-stories-instagram-anonimo" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Ver Stories sem Conta
              </Link>
              <Link href="/pt/baixar-stories-com-musica" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Stories com Música
              </Link>
              <Link href="/pt/baixar-destaques-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Baixar Destaques
              </Link>
              <Link href="/pt/visualizador-perfis-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Visualizador de Perfis
              </Link>
              <Link href="/pt/baixar-carrossel-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Baixar Carrossel
              </Link>
              <Link href="/pt/baixar-reels-hd-1080p" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Reels Full HD 1080p
              </Link>
              <Link href="/pt/alternativa-saveinsta-snapinsta" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Alternativa ao SaveInsta
              </Link>
            </div>
          </div>

          {/* French Programmatic SEO Topics */}
          <div className="mt-6 pt-6 border-t border-gray-900/80" lang="fr">
            <div className="text-center md:text-left mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Outils en Français (French Tools)
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <Link href="/fr" className="px-2.5 py-1 rounded-md bg-pink-950/40 border border-pink-800/40 text-pink-300 hover:text-white hover:bg-pink-900/50 transition-colors font-semibold">
                Accueil Français
              </Link>
              <Link href="/fr/telecharger-reel-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Télécharger Reel Sans Filigrane
              </Link>
              <Link href="/fr/telecharger-story-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Télécharger Story Anonyme
              </Link>
              <Link href="/fr/telecharger-video-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Télécharger Vidéo MP4
              </Link>
              <Link href="/fr/telecharger-photo-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Télécharger Photo HD
              </Link>
              <Link href="/fr/convertir-instagram-en-mp3" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Convertir Reel en MP3
              </Link>
              <Link href="/fr/telecharger-photo-profil-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Photo de Profil en HD
              </Link>
              <Link href="/fr/telecharger-reel-iphone" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Télécharger Reel sur iPhone
              </Link>
              <Link href="/fr/telecharger-reel-android" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Télécharger Reel sur Android
              </Link>
              <Link href="/fr/voir-story-instagram-anonymement" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Voir Story Sans Compte
              </Link>
              <Link href="/fr/telecharger-story-instagram-avec-musique" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Story Avec Musique
              </Link>
              <Link href="/fr/telecharger-story-a-la-une-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Télécharger Story à la Une
              </Link>
              <Link href="/fr/visionneuse-profil-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Visionneuse de Profil
              </Link>
              <Link href="/fr/telecharger-carrousel-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Télécharger Carrousel
              </Link>
              <Link href="/fr/telecharger-reel-hd-1080p" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Reel Full HD 1080p
              </Link>
              <Link href="/fr/alternative-saveinsta-snapinsta" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Alternative à SaveInsta
              </Link>
            </div>
          </div>

          {/* Turkish Programmatic SEO Topics */}
          <div className="mt-6 pt-6 border-t border-gray-900/80" lang="tr">
            <div className="text-center md:text-left mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Türkçe Araçlar (Turkish Tools)
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <Link href="/tr" className="px-2.5 py-1 rounded-md bg-pink-950/40 border border-pink-800/40 text-pink-300 hover:text-white hover:bg-pink-900/50 transition-colors font-semibold">
                Türkçe Ana Sayfa
              </Link>
              <Link href="/tr/instagram-reels-indirme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Filigransız Reels İndirme
              </Link>
              <Link href="/tr/instagram-hikaye-indirme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Hikaye (Story) İndirme
              </Link>
              <Link href="/tr/instagram-video-indirme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Instagram Video İndirme MP4
              </Link>
              <Link href="/tr/instagram-fotograf-indirme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                HD Fotoğraf İndirme
              </Link>
              <Link href="/tr/instagram-mp3-ses-indirme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Reels MP3 Ses İndirme
              </Link>
              <Link href="/tr/instagram-profil-fotografi-buyutme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Profil Fotoğrafı Büyütme
              </Link>
              <Link href="/tr/iphone-instagram-reels-indirme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                iPhone Reels İndirme
              </Link>
              <Link href="/tr/android-instagram-reels-indirme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Android Reels İndirme
              </Link>
              <Link href="/tr/instagram-gizli-hikaye-izleme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Gizli Hikaye İzleme
              </Link>
              <Link href="/tr/instagram-muzikli-hikaye-indirme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Müzikli Hikaye İndirme
              </Link>
              <Link href="/tr/instagram-one-cikanlar-indirme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Öne Çıkanlar İndirme
              </Link>
              <Link href="/tr/instagram-profil-goruntuleme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Hesapsız Profil Görüntüleme
              </Link>
              <Link href="/tr/instagram-coklu-fotograf-indirme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Çoklu Fotoğraf İndirme
              </Link>
              <Link href="/tr/instagram-reels-hd-1080p-indirme" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Full HD 1080p Reels
              </Link>
              <Link href="/tr/saveinsta-snapinsta-alternatifi" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                SaveInsta Alternatifi
              </Link>
            </div>
          </div>

          {/* Indonesian Programmatic SEO Topics */}
          <div className="mt-6 pt-6 border-t border-gray-900/80" lang="id">
            <div className="text-center md:text-left mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Alat Bahasa Indonesia (Indonesian Tools)
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <Link href="/id" className="px-2.5 py-1 rounded-md bg-pink-950/40 border border-pink-800/40 text-pink-300 hover:text-white hover:bg-pink-900/50 transition-colors font-semibold">
                Beranda Indonesia
              </Link>
              <Link href="/id/download-reels-ig" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Download Reels IG Tanpa Watermark
              </Link>
              <Link href="/id/download-story-ig" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Download Story IG Anonim
              </Link>
              <Link href="/id/download-video-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Download Video IG MP4
              </Link>
              <Link href="/id/download-foto-ig" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Download Foto IG HD
              </Link>
              <Link href="/id/convert-instagram-ke-mp3" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Convert Reels ke MP3
              </Link>
              <Link href="/id/download-foto-profil-ig-hd" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Foto Profil IG Full HD
              </Link>
              <Link href="/id/download-reels-ig-iphone" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Download Reels di iPhone
              </Link>
              <Link href="/id/download-reels-ig-android" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Download Reels di Android
              </Link>
              <Link href="/id/lihat-story-ig-anonim" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Lihat Story IG Tanpa Akun
              </Link>
              <Link href="/id/download-story-ig-dengan-musik" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Story IG Dengan Musik
              </Link>
              <Link href="/id/download-highlight-ig" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Download Highlight IG
              </Link>
              <Link href="/id/lihat-profil-ig-tanpa-login" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Lihat Profil Tanpa Login
              </Link>
              <Link href="/id/download-carousel-ig" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Download Carousel IG
              </Link>
              <Link href="/id/download-reels-ig-hd-1080p" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Reels IG Full HD 1080p
              </Link>
              <Link href="/id/alternatif-saveinsta-snapinsta" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Alternatif SaveInsta
              </Link>
            </div>
          </div>

          {/* German Programmatic SEO Topics */}
          <div className="mt-6 pt-6 border-t border-gray-900/80" lang="de">
            <div className="text-center md:text-left mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Deutsche Werkzeuge (German Tools)
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <Link href="/de" className="px-2.5 py-1 rounded-md bg-pink-950/40 border border-pink-800/40 text-pink-300 hover:text-white hover:bg-pink-900/50 transition-colors font-semibold">
                Startseite Deutsch
              </Link>
              <Link href="/de/instagram-reels-herunterladen" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Reels Herunterladen Ohne Wasserzeichen
              </Link>
              <Link href="/de/instagram-story-herunterladen" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Instagram Story Herunterladen
              </Link>
              <Link href="/de/instagram-video-herunterladen" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Instagram Video MP4 Download
              </Link>
              <Link href="/de/instagram-fotos-herunterladen" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Instagram Fotos Herunterladen HD
              </Link>
              <Link href="/de/instagram-in-mp3-umwandeln" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Instagram in MP3 Umwandeln
              </Link>
              <Link href="/de/instagram-profilbild-vergroessern-hd" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Profilbild Vergrößern HD
              </Link>
              <Link href="/de/instagram-reels-auf-iphone-speichern" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Reels auf iPhone Speichern
              </Link>
              <Link href="/de/instagram-reels-auf-android-herunterladen" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Reels auf Android Herunterladen
              </Link>
              <Link href="/de/instagram-story-anonym-anschauen" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Story Anonym Anschauen
              </Link>
              <Link href="/de/instagram-story-mit-musik-speichern" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Story Mit Musik Speichern
              </Link>
              <Link href="/de/instagram-highlights-herunterladen" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Highlights Herunterladen
              </Link>
              <Link href="/de/instagram-profil-anschauen-ohne-konto" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Profil Anschauen Ohne Konto
              </Link>
              <Link href="/de/instagram-karussell-herunterladen" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Karussell Herunterladen
              </Link>
              <Link href="/de/instagram-reels-hd-1080p-download" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Reels Full HD 1080p
              </Link>
              <Link href="/de/saveinsta-snapinsta-alternative" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                SaveInsta Alternative
              </Link>
            </div>
          </div>
          {/* Russian Programmatic SEO Topics */}
          <div className="mt-6 pt-6 border-t border-gray-900/80" lang="ru">
            <div className="text-center md:text-left mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Инструменты на Русском (Russian Tools)
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <Link href="/ru" className="px-2.5 py-1 rounded-md bg-pink-950/40 border border-pink-800/40 text-pink-300 hover:text-white hover:bg-pink-900/50 transition-colors font-semibold">
                Главная Русский
              </Link>
              <Link href="/ru/skachat-reels-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Скачать Рилс Без Водяного Знака
              </Link>
              <Link href="/ru/skachat-storis-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Скачать Сторис Анонимно
              </Link>
              <Link href="/ru/skachat-video-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Скачать Видео Инстаграм MP4
              </Link>
              <Link href="/ru/skachat-foto-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Скачать Фото Инстаграм HD
              </Link>
              <Link href="/ru/konvertirovat-instagram-v-mp3" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Скачать Музыку из Рилс MP3
              </Link>
              <Link href="/ru/skachat-avatarku-instagram-hd" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Скачать Аватарку в HD
              </Link>
              <Link href="/ru/skachat-reels-na-ajfon" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Скачать Рилс на Айфон
              </Link>
              <Link href="/ru/skachat-reels-na-android" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Скачать Рилс на Андроид
              </Link>
              <Link href="/ru/smotret-storis-anonimno" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Смотреть Сторис Анонимно
              </Link>
              <Link href="/ru/skachat-storis-s-muzykoj" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Сторис с Музыкой в Галерею
              </Link>
              <Link href="/ru/skachat-aktualnoe-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Скачать Актуальное (Highlights)
              </Link>
              <Link href="/ru/smotret-profil-instagram-bez-vhoda" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Смотреть Профиль Без Входа
              </Link>
              <Link href="/ru/skachat-karusel-instagram" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Скачать Карусель Инстаграм
              </Link>
              <Link href="/ru/skachat-reels-hd-1080p" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Рилс в Full HD 1080p
              </Link>
              <Link href="/ru/analog-saveinsta-snapinsta" className="px-2.5 py-1 rounded-md bg-gray-900 text-gray-400 hover:text-pink-400 hover:bg-gray-800 transition-colors">
                Аналог SaveInsta на Русском
              </Link>
            </div>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
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
