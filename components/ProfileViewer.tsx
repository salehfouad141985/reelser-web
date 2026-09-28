"use client";

import { saveMedia } from "@/lib/downloadClient";
import { mergeProfileItems, requestProfilePage, type Section } from "@/lib/profileClient";
import React, { useState, useEffect, useRef } from "react";
import { ProfileData } from "@/lib/instagramExtractor";
import { useLanguage } from "./LanguageProvider";
import {
  Download,
  ExternalLink,
  CheckCircle2,
  Maximize2,
  X,
  Play,
  Film,
  Heart,
  MessageCircle,
  Clock,
  Sparkles,
  Layers,
  Video,
} from "lucide-react";

interface ProfileViewerProps {
  profile: ProfileData;
}

export function ProfileViewer({ profile: initialProfile }: ProfileViewerProps) {
  const [profile, setProfile] = useState(initialProfile);
  const { t, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<"posts" | "stories" | "highlights" | "reels">(
    profile.initialSection || (profile.stories.length > 0 ? "stories" : "posts")
  );
  const [pageLoading, setPageLoading] = useState<Section | null>(null);
  const [pageError, setPageError] = useState<{ section: Section; message: string } | null>(null);
  const pageRequest = useRef<AbortController | null>(null);
  useEffect(() => () => { pageRequest.current?.abort(); }, []);
  const fetchPage = async (section: Section) => {
    if (pageRequest.current || profile[section].length >= 5000) return;
    const controller = new AbortController();
    pageRequest.current = controller;
    setPageLoading(section);
    setPageError(null);
    try {
      const page = await requestProfilePage(profile.username, section, profile.pagination?.[section]?.cursor || null, controller.signal);
      if (controller.signal.aborted) return;
      setProfile(previous => ({ ...previous, [section]: mergeProfileItems(previous[section], page.items),
        pagination: { ...previous.pagination, [section]: { loaded: true, cursor: page.nextCursor } } }));
      if (section === "posts") setPostsLimit(limit => Math.max(limit, profile.posts.length + page.items.length));
      if (section === "reels") setReelsLimit(limit => Math.max(limit, profile.reels.length + page.items.length));
    } catch (error) {
      if (!controller.signal.aborted) setPageError({ section, message: error instanceof Error ? error.message : "Could not load more results. Try again." });
    } finally {
      if (pageRequest.current === controller) { pageRequest.current = null; setPageLoading(null); }
    }
  };
  const selectTab = (section: "posts" | "stories" | "reels" | "highlights") => {
    pageRequest.current?.abort();
    pageRequest.current = null;
    setPageLoading(null);
    setPageError(null);
    setActiveTab(section);
    if (profile.source === "selfHosted" && section !== "highlights" && !profile.pagination?.[section]?.loaded) void fetchPage(section);
  };
  const loaded = (section: Section) => profile.source !== "selfHosted" || profile.pagination?.[section]?.loaded;
  const remoteMore = (section: Section) => profile.source === "selfHosted" && Boolean(profile.pagination?.[section]?.cursor) && profile[section].length < 5000;
  const dialogRef = useRef<HTMLDivElement>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [zoomModalOpen, setZoomModalOpen] = useState(false);
  const [postsLimit, setPostsLimit] = useState(12);
  const [reelsLimit, setReelsLimit] = useState(12);
  const loadMorePostsRef = useRef<HTMLDivElement>(null);
  const loadMoreReelsRef = useRef<HTMLDivElement>(null);
  const postsDisplayed = profile.posts.slice(0, postsLimit);
  const reelsDisplayed = profile.reels.slice(0, reelsLimit);
  const hasMorePosts = postsLimit < profile.posts.length || remoteMore("posts");
  const hasMoreReels = reelsLimit < profile.reels.length || remoteMore("reels");

  // The provider returns a finite batch without continuation cursors.
  // Reveal that batch progressively instead of requesting a nonexistent endpoint.
  useEffect(() => {
    if (profile.source === "selfHosted" || typeof IntersectionObserver === "undefined") return;
    const target = activeTab === "posts" ? loadMorePostsRef.current
      : activeTab === "reels" ? loadMoreReelsRef.current : null;
    if (!target) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      if (activeTab === "posts") {
        setPostsLimit(limit => Math.min(limit + 12, profile.posts.length));
      } else {
        setReelsLimit(limit => Math.min(limit + 12, profile.reels.length));
      }
    }, { rootMargin: "200px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, [activeTab, postsLimit, reelsLimit, profile.posts.length, profile.reels.length, profile.source]);

  useEffect(() => {
    if (!zoomModalOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLButtonElement>("button")?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomModalOpen(false);
      if (event.key === "Tab" && dialog) {
        const buttons = [...dialog.querySelectorAll<HTMLButtonElement>("button:not(:disabled)")];
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => { document.removeEventListener("keydown", closeOnEscape); previous?.focus(); };
  }, [zoomModalOpen]);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const downloadPending = useRef(false);

  const handleDownload = async (downloadUrl: string, filename: string, _ext = "jpg") => {
    if (downloadPending.current) return;
    downloadPending.current = true;
    setDownloadError(null);
    setDownloadingId(downloadUrl);
    try { await saveMedia(downloadUrl, `${filename}.${_ext}`); }
    catch (error) { setDownloadError(t(error instanceof Error ? error.message : "Download failed")); }
    finally { downloadPending.current = false; setDownloadingId(null); }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left" dir={isRtl ? "rtl" : "ltr"}>
      {downloadError && <p role="alert" className="text-red-700 text-center">{downloadError}</p>}
      {pageLoading === activeTab && <p role="status" className="text-center">{t("Loading results...")}</p>}
      {pageError?.section === activeTab && <div role="alert" className="text-center text-red-700">
        <p>{t(pageError.message)}</p>
        <button type="button" disabled={pageLoading !== null} onClick={() => void fetchPage(pageError.section)} className="px-4 py-2 rounded-xl bg-gray-100">{t("Try again")}</button>
      </div>}
      {activeTab !== "highlights" && profile[activeTab].length >= 5000 && <p role="status">{t("Result limit reached. Start a new search to refresh the results.")}</p>}
      {profile.mediaCoverage === "partial" && (
        <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {t("These results may not include all posts, reels or active stories. Try a direct link to retrieve a missing item.")}
        </p>
      )}
      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {t("Search result")}
        </h2>
      </div>

      {/* ================= PROFILE HEADER CARD ================= */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8">
          {/* Avatar with Zoom button */}
          <div className="relative shrink-0 group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-[3px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-lg group-hover:scale-105 transition-transform duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover bg-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/icon.svg";
                }}
              />
            </div>

            {/* Expand / Zoom Button */}
            {profile.avatarDownloadUrl && (
              <button
                type="button"
                title={t("Zoom avatar")}
                onClick={() => setZoomModalOpen(true)}
                className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#00d084] text-white flex items-center justify-center shadow-md hover:bg-emerald-600 transition-colors border-2 border-white cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Account Details & Stats */}
          <div className="flex-1 text-center sm:text-left space-y-3">
            {/* Username + External link */}
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                @{profile.username}
              </span>
              {profile.isVerified && (
                <CheckCircle2 className="w-5 h-5 text-blue-500 fill-current inline" />
              )}
              <a
                href={`https://www.instagram.com/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                title={t("Open in Instagram")}
                className="text-gray-400 hover:text-pink-600 transition-colors p-1"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Stats Row (Posts, Followers, Following) */}
            <div className="flex items-center justify-center sm:justify-start gap-6 sm:gap-8 py-1 text-sm font-medium text-gray-600">
              <div>
                <span className="font-extrabold text-base text-gray-900 block">
                  {profile.postsCount}
                </span>
                <span className="text-xs text-gray-500">{t("posts")}</span>
              </div>
              <div>
                <span className="font-extrabold text-base text-gray-900 block">
                  {profile.followersCount}
                </span>
                <span className="text-xs text-gray-500">{t("followers")}</span>
              </div>
              <div>
                <span className="font-extrabold text-base text-gray-900 block">
                  {profile.followingCount}
                </span>
                <span className="text-xs text-gray-500">{t("following")}</span>
              </div>
            </div>

            {/* Full Name & Bio */}
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">
                {profile.fullName}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 whitespace-pre-line leading-relaxed max-w-xl font-normal">
                {profile.biography}
              </p>
            </div>

            {/* Quick Action: Download Avatar Button */}
            {profile.avatarDownloadUrl && <div className="pt-2 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <button
                type="button"
                onClick={() =>
                  handleDownload(
                    profile.avatarDownloadUrl || "",
                    `${profile.username}_avatar_hd`,
                    "jpg"
                  )
                }
                disabled={!profile.avatarDownloadUrl || downloadingId !== null}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#00d084] hover:bg-emerald-600 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloadingId === profile.avatarDownloadUrl
                    ? (t("Downloading..."))
                    : (t("Download Profile DP (Original)"))}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setZoomModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{t("Zoom Avatar")}</span>
              </button>
            </div>}
          </div>
        </div>

        {/* ================= INTERACTIVE 4 SUB-TABS ================= */}
        <div className="mt-8 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-around sm:justify-center sm:gap-12">
            {([
              { id: "posts", label: t("POSTS"), icon: Layers },
              { id: "stories", label: t("tabStory"), icon: Clock },
              { id: "highlights", label: t("HIGHLIGHTS"), icon: Sparkles },
              { id: "reels", label: t("tabReels"), icon: Video },
            ] as const).map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => selectTab(tab.id)}
                  className={`flex items-center gap-2 py-3 px-3 sm:px-5 font-black text-xs sm:text-sm uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                    isSelected
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-400 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= TAB 1: POSTS GRID (Screenshot 2) ================= */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {postsDisplayed.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Image / Video Preview */}
                <div className="relative aspect-square w-full bg-gray-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    loading="lazy"
                    decoding="async"
                    alt={item.caption || "Instagram Post"}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    <span className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-xs">
                      <Play className="w-4 h-4 fill-white" />
                    </span>
                  </div>
                </div>

                {/* Caption & Stats */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed font-medium">
                    {item.caption}
                  </p>

                  <div className="space-y-3">
                    {/* Likes & Comments Metrics */}
                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold pt-1 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                          <span>{item.likes}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                          <span>{item.comments}</span>
                        </span>
                      </div>
                      <span className="text-gray-400">{item.timestamp}</span>
                    </div>

                    {/* Prominent Green Download Button */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(
                          item.downloadUrl,
                          `${profile.username}_post_${idx + 1}`,
                          item.type === "video" ? "mp4" : "jpg"
                        )
                      }
                      disabled={downloadingId !== null}
                      aria-busy={downloadingId === item.downloadUrl}
                      className="w-full py-2.5 px-4 rounded-xl font-black text-xs text-white bg-[#00d084] hover:bg-emerald-600 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {downloadingId === item.downloadUrl
                          ? (t("Downloading..."))
                          : (t("btnDownload"))}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
            {hasMorePosts && <div ref={loadMorePostsRef} className="text-center">
              <button type="button" disabled={pageLoading !== null} onClick={() => postsLimit < profile.posts.length ? setPostsLimit(limit => limit + 12) : void fetchPage("posts")} className="px-4 py-2 rounded-xl bg-gray-100 font-bold">
                {t("Show more")}
              </button>
            </div>}
            {loaded("posts") && profile.posts.length === 0 && !pageLoading && <p className="text-center text-gray-500 py-8">{t("No posts available to display.")}</p>}
          </div>
      )}

      {/* ================= TAB 2: STORIES GRID (Screenshot 3) ================= */}
      {activeTab === "stories" && (
        <div className="space-y-6">
          {profile.stories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {profile.stories.map((story, idx) => (
                <div
                  key={story.id || idx}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Portrait 9:16 Story Frame */}
                  <div className="relative aspect-[9/16] w-full bg-gray-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={story.thumbnail}
                      loading="lazy"
                      decoding="async"
                      alt="Instagram Story"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-xs">
                        <Play className="w-4 h-4 fill-white" />
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 text-[10px] text-white font-mono bg-black/60 px-2 py-0.5 rounded-md">
                      {story.timestamp || "Active Story"}
                    </div>
                  </div>

                  {/* Download button */}
                  <div className="p-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(
                          story.downloadUrl,
                          `${profile.username}_story_${idx + 1}`,
                          story.type === "video" ? "mp4" : "jpg"
                        )
                      }
                      disabled={downloadingId !== null}
                      aria-busy={downloadingId === story.downloadUrl}
                      className="w-full py-2.5 px-4 rounded-xl font-black text-xs text-white bg-[#00d084] hover:bg-emerald-600 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t(downloadingId === story.downloadUrl ? "Downloading..." : "btnDownload")}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : loaded("stories") && !pageLoading ? (
            <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {t("No Active Stories Right Now")}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t("No stories were available from the source. They may have expired or could not be retrieved.")}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => selectTab("posts")}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {t("View Posts")}
                </button>
                <button
                  type="button"
                  onClick={() => selectTab("reels")}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-pink-700 bg-pink-50 hover:bg-pink-100 transition-colors cursor-pointer"
                >
                  {t("View Reels")}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ================= TAB 3: HIGHLIGHTS (Screenshot 4) ================= */}
      {activeTab === "highlights" && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t("Story Highlights")}</span>
          </h3>

          <div className="flex items-center gap-6 overflow-x-auto pb-4 justify-start sm:justify-center">
            {profile.highlights.length === 0 && <p className="text-center text-gray-500">{t("No highlights available to display.")}</p>}
            {profile.highlights.map((hl) => (
              <div
                key={hl.id}
                onClick={() =>
                  handleDownload(
                    hl.cover,
                    `${profile.username}_highlight_${hl.title}`,
                    "jpg"
                  )
                }
                className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-[2px] bg-gradient-to-tr from-gray-200 to-gray-300 group-hover:from-pink-500 group-hover:to-amber-500 transition-all shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={hl.cover}
                    loading="lazy"
                    decoding="async"
                    alt={hl.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover bg-gray-100"
                  />
                </div>
                <span className="text-xs font-bold text-gray-700 max-w-[80px] truncate text-center group-hover:text-pink-600 transition-colors">
                  {hl.title}
                </span>
                <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Download className="w-3 h-3" /> {t("btnDownload")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: REELS (Screenshot 5) ================= */}
      {activeTab === "reels" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {reelsDisplayed.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Portrait 9:16 Reel Video Frame */}
                <div className="relative aspect-[9/16] w-full bg-gray-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    loading="lazy"
                    decoding="async"
                    alt="Instagram Reel"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                      <Film className="w-3.5 h-3.5 fill-white" />
                      <span className="text-[10px] font-mono">MP4</span>
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white/90 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Caption & Download */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed font-medium">
                    {item.caption}
                  </p>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold pt-1 border-t border-gray-50">
                      <span>{item.likes ? `${item.likes} ${t("likes")}` : ""}</span>
                      <span className="text-gray-400">{item.timestamp}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(
                          item.downloadUrl,
                          `${profile.username}_reel_${idx + 1}`,
                          "mp4"
                        )
                      }
                      disabled={downloadingId !== null}
                      aria-busy={downloadingId === item.downloadUrl}
                      className="w-full py-2.5 px-4 rounded-xl font-black text-xs text-white bg-[#00d084] hover:bg-emerald-600 shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{t(downloadingId === item.downloadUrl ? "Downloading..." : "btnDownload")}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            </div>
            {hasMoreReels && <div ref={loadMoreReelsRef} className="text-center">
              <button type="button" disabled={pageLoading !== null} onClick={() => reelsLimit < profile.reels.length ? setReelsLimit(limit => limit + 12) : void fetchPage("reels")} className="px-4 py-2 rounded-xl bg-gray-100 font-bold">
                {t("Show more")}
              </button>
            </div>}
            {loaded("reels") && profile.reels.length === 0 && !pageLoading && <p className="text-center text-gray-500 py-8">{t("No reels available to display.")}</p>}
        </div>
      )}

      {/* ================= AVATAR ZOOM MODAL ================= */}
      {zoomModalOpen && (
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={t("Profile picture")} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setZoomModalOpen(false)}
          />

          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 text-center space-y-4">
            <button
              type="button"
              onClick={() => setZoomModalOpen(false)}
              aria-label={t("Close")}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-gray-900">
              @{profile.username}
            </h3>

            {/* High Res Avatar */}
            <div className="w-full max-w-64 aspect-square mx-auto rounded-2xl overflow-hidden shadow-md bg-gray-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.hdAvatarUrl}
                alt={profile.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/icon.svg";
                }}
              />
            </div>

            <p className="text-xs text-gray-500 font-medium">
              {t("Highest resolution profile picture (Original)")}
            </p>

            <button
              type="button"
              onClick={() =>
                handleDownload(
                  profile.avatarDownloadUrl || "",
                  `${profile.username}_avatar_original`,
                  "jpg"
                )
              }
              disabled={!profile.avatarDownloadUrl || downloadingId !== null}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#00d084] hover:bg-emerald-600 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{t("Download Original Avatar")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
