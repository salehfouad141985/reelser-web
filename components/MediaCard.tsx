"use client";

import { saveMedia } from "@/lib/downloadClient";
import React, { useState } from "react";
import { MediaResult, MediaFormat } from "@/lib/instagramExtractor";
import { Download, Film, Music, Image as ImageIcon, Check } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { ProfileViewer } from "./ProfileViewer";

interface MediaCardProps {
  media: MediaResult;
}

export function MediaCard({ media }: MediaCardProps) {
  const { t } = useLanguage();
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloadingFormatId, setDownloadingFormatId] = useState<string | null>(null);

  // If the result is a full Instagram profile, render the StoriesIG Profile Viewer experience
  if (media.isProfile && media.profileData) {
    return <ProfileViewer key={media.profileData.username} profile={media.profileData} />;
  }

  const getFormatIcon = (type: MediaFormat["type"]) => {
    switch (type) {
      case "video":
        return <Film className="w-4 h-4 text-pink-600" />;
      case "audio":
        return <Music className="w-4 h-4 text-purple-600" />;
      case "image":
        return <ImageIcon className="w-4 h-4 text-amber-600" />;
      default:
        return <Download className="w-4 h-4" />;
    }
  };

  const handleDownload = async (format: MediaFormat) => {
    setDownloadError(null);
    setDownloadingFormatId(format.formatId);
    try { await saveMedia(format.downloadUrl, media.title || "reelser-media"); }
    catch (error) { setDownloadError(error instanceof Error ? error.message : "Download failed"); }
    finally { setDownloadingFormatId(null); }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {downloadError && <p role="alert" className="text-red-700 p-4">{downloadError}</p>}
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Thumbnail / Preview Area */}
          <div className="relative w-full md:w-56 h-64 md:h-72 rounded-xl overflow-hidden bg-gray-900 shrink-0 shadow-md group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={media.thumbnail}
              alt={media.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback placeholder if image load fails
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23ccc'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3C/svg%3E";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
              <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md font-medium">
                {media.platform}
              </span>
              {media.duration && (
                <span className="bg-pink-600/80 backdrop-blur-xs px-2.5 py-1 rounded-md font-semibold">
                  {media.duration}
                </span>
              )}
            </div>
          </div>

          {/* Details & Formats */}
          <div className="flex-1 w-full flex flex-col justify-between">
            <div>
              <span className="inline-block px-2.5 py-0.5 text-xs font-semibold text-pink-600 bg-pink-50 rounded-full mb-2">
                ✓ {t("Ready for Download")}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-snug line-clamp-2">
                {media.title}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {t("Source")}: <span className="font-semibold text-gray-700">{media.author}</span>
              </p>
            </div>

            {/* Formats list */}
            <div className="mt-5 space-y-2.5">
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                {t("Available Downloads")} ({media.formats.length})
              </h4>
              {media.formats.map((fmt) => {
                const isDownloading = downloadingFormatId === fmt.formatId;
                return (
                  <div
                    key={fmt.formatId}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/60 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-2xs border border-gray-100">
                        {getFormatIcon(fmt.type)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                          <span>{fmt.ext.toUpperCase()}</span>
                          <span className="text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                            .{fmt.ext}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(fmt)}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 shadow-md shadow-pink-500/20 active:scale-95 transition-all cursor-pointer"
                    >
                      {isDownloading ? (
                        <>
                          <Check className="w-4 h-4 animate-bounce" />
                          <span>{t("Downloading...")}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>{t("btnDownload")}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
