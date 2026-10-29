"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ShieldAlert,
  Activity,
  Settings,
  DollarSign,
  Lock,
  User,
  Key,
  ExternalLink,
  LogOut,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Save,
  Sliders,
  Radio,
  Download,
  Film,
  Music,
  Image as ImageIcon,
  Clock,
  Globe,
  Cpu,
  HardDrive,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Play,
  Sparkles,
  ShieldCheck,
  Filter,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "video" | "audio" | "image" | "extract";
  title: string;
  timestamp: string;
  success: boolean;
}

interface AdminData {
  success: boolean;
  user: { username: string; role: string };
  settings: {
    maintenance_mode: boolean;
    ad_top_banner_enabled: boolean;
    ad_top_banner_code: string;
    ad_results_banner_enabled: boolean;
    ad_results_banner_code: string;
    ad_bottom_banner_enabled: boolean;
    ad_bottom_banner_code: string;
    max_downloads_per_ip_hour: number;
  };
  stats: {
    totalExtractions: number;
    successfulExtractions: number;
    failedExtractions: number;
    totalDownloads: number;
    videoDownloads: number;
    audioDownloads: number;
    photoDownloads: number;
    lastUpdated: string;
    recentActivities: ActivityItem[];
  };
  system: {
    platform: string;
    nodeVersion: string;
    uptime: number;
    timestamp: string;
    indexedPages?: number;
    memoryRssMB?: number;
    memoryHeapMB?: number;
    activeSessionsCount?: number;
    activeRateLimitIps?: number;
    selfHostedConfigured?: boolean;
  };
}

interface DiagnosticResult {
  ok: boolean;
  latencyMs: number;
  title?: string;
  author?: string;
  formatsCount?: number;
  hasProfileData?: boolean;
  error?: string;
}

const LANGUAGE_HUBS_INFO = [
  { code: "en", name: "الإنجليزية (English)", flag: "🇺🇸", path: "/", pages: 52, region: "Global / US / UK" },
  { code: "ar", name: "العربية (Arabic)", flag: "🇸🇦", path: "/ar", pages: 16, region: "MENA & Gulf" },
  { code: "es", name: "الإسبانية (Español)", flag: "🇪🇸", path: "/es", pages: 16, region: "Spain & LATAM" },
  { code: "pt", name: "البرتغالية (Português)", flag: "🇧🇷", path: "/pt", pages: 16, region: "Brazil & Portugal" },
  { code: "fr", name: "الفرنسية (Français)", flag: "🇫🇷", path: "/fr", pages: 16, region: "France, Canada & Africa" },
  { code: "de", name: "الألمانية (Deutsch)", flag: "🇩🇪", path: "/de", pages: 16, region: "Germany, Austria & Switzerland" },
  { code: "tr", name: "التركية (Türkçe)", flag: "🇹🇷", path: "/tr", pages: 16, region: "Turkey & Europe" },
  { code: "id", name: "الإندونيسية (Indonesia)", flag: "🇮🇩", path: "/id", pages: 16, region: "Indonesia & SE Asia" },
  { code: "ru", name: "الروسية (Русский)", flag: "🇷🇺", path: "/ru", pages: 16, region: "CIS & Eastern Europe" },
];

function formatUptime(seconds?: number): string {
  if (!seconds || !Number.isFinite(seconds)) return "—";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d} يوم و ${h} ساعة`;
  if (h > 0) return `${h} ساعة و ${m} دقيقة`;
  return `${Math.max(1, m)} دقيقة`;
}

function formatExactActivityTime(rawTimestamp: string) {
  const normalized = rawTimestamp.includes("T") ? rawTimestamp : rawTimestamp.replace(" ", "T") + "Z";
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) {
    return { dateStr: "—", time24: rawTimestamp, time12: "", relative: "" };
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh24 = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const sec = String(d.getSeconds()).padStart(2, "0");
  const hours12 = d.getHours() % 12 || 12;
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  const time12 = `${String(hours12).padStart(2, "0")}:${min}:${sec} ${ampm}`;

  const diffSec = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  let relative = "الآن";
  if (diffSec >= 86400) {
    const days = Math.floor(diffSec / 86400);
    relative = days === 1 ? "منذ يوم واحد" : days === 2 ? "منذ يومين" : `منذ ${days} أيام`;
  } else if (diffSec >= 3600) {
    const hours = Math.floor(diffSec / 3600);
    const mins = Math.floor((diffSec % 3600) / 60);
    relative = mins > 0 ? `منذ ${hours} س و ${mins} د` : `منذ ${hours} ساعة`;
  } else if (diffSec >= 60) {
    const mins = Math.floor(diffSec / 60);
    const secs = diffSec % 60;
    relative = secs > 0 && mins < 10 ? `منذ ${mins} د و ${secs} ث` : `منذ ${mins} دقيقة`;
  } else if (diffSec > 0) {
    relative = `منذ ${diffSec} ثانية`;
  }

  return {
    dateStr: `${yyyy}-${mm}-${dd}`,
    time24: `${hh24}:${min}:${sec}`,
    time12,
    relative,
  };
}

function formatActivityTitle(act: ActivityItem): string {
  if (!act.title || /^Media (request|download|extraction)$/i.test(act.title)) {
    if (act.type === "video") return "محاولة تحميل فيديو MP4";
    if (act.type === "audio") return "محاولة تحميل صوت MP3";
    if (act.type === "image") return "محاولة تحميل صورة HD";
    return "محاولة فحص واستخراج رابط";
  }
  return act.title;
}

export default function ReelserAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<"stats" | "seo" | "ads" | "settings" | "security">("stats");
  const [data, setData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Activity filter & search
  const [activityFilter, setActivityFilter] = useState<"all" | "video" | "audio" | "image" | "extract" | "failed">("all");
  const [activitySearch, setActivitySearch] = useState("");
  const [isClearingLogs, setIsClearingLogs] = useState(false);

  // Settings form
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxPerHour, setMaxPerHour] = useState(60);
  const [adTopEnabled, setAdTopEnabled] = useState(false);
  const [adTopCode, setAdTopCode] = useState("");
  const [adResultsEnabled, setAdResultsEnabled] = useState(false);
  const [adResultsCode, setAdResultsCode] = useState("");
  const [adBottomEnabled, setAdBottomEnabled] = useState(false);
  const [adBottomCode, setAdBottomCode] = useState("");
  const [previewAdSlot, setPreviewAdSlot] = useState<"top" | "results" | "bottom" | null>(null);

  // Password & sessions
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  // IndexNow instant submission
  const [isSubmittingIndexNow, setIsSubmittingIndexNow] = useState(false);
  const [indexNowStatus, setIndexNowStatus] = useState<{
    ok: boolean;
    text: string;
    results?: { endpoint: string; status: number; ok: boolean }[];
  } | null>(null);

  // Live Extractor Diagnostic Tool
  const [diagUrl, setDiagUrl] = useState("https://www.instagram.com/instagram/");
  const [diagType, setDiagType] = useState<"reels" | "story" | "photo" | "audio" | "profile">("profile");
  const [isRunningDiag, setIsRunningDiag] = useState(false);
  const [diagResult, setDiagResult] = useState<DiagnosticResult | null>(null);

  const loadData = useCallback((syncForm = true) => {
    return fetch("/api/admin/data", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        const json: AdminData = await response.json();
        if (!json.success) throw new Error("Unauthorized");
        setIsAuthenticated(true);
        setData(json);
        if (syncForm) {
          setMaintenanceMode(json.settings.maintenance_mode);
          setMaxPerHour(json.settings.max_downloads_per_ip_hour);
          setAdTopEnabled(json.settings.ad_top_banner_enabled);
          setAdTopCode(json.settings.ad_top_banner_code);
          setAdResultsEnabled(json.settings.ad_results_banner_enabled);
          setAdResultsCode(json.settings.ad_results_banner_code);
          setAdBottomEnabled(json.settings.ad_bottom_banner_enabled);
          setAdBottomCode(json.settings.ad_bottom_banner_code);
        }
      })
      .catch(() => setIsAuthenticated(false))
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }, []);

  useEffect(() => {
    void loadData(true);
  }, [loadData]);

  useEffect(() => {
    if (!autoRefresh || !isAuthenticated) return;
    const interval = setInterval(() => {
      void loadData(false);
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, isAuthenticated, loadData]);

  const handleIndexNowSubmit = async () => {
    setIsSubmittingIndexNow(true);
    setIndexNowStatus(null);
    try {
      const res = await fetch("/api/admin/indexnow", { method: "POST" });
      const json = await res.json();
      if (res.ok && json.success) {
        setIndexNowStatus({
          ok: true,
          text: json.message || `تم إرسال ${json.totalUrls} صفحة بنجاح`,
          results: json.results,
        });
      } else {
        setIndexNowStatus({
          ok: false,
          text: json.message || json.error || "فشل الإرسال",
          results: json.results,
        });
      }
    } catch {
      setIndexNowStatus({ ok: false, text: "تعذر الاتصال بالخادم" });
    } finally {
      setIsSubmittingIndexNow(false);
    }
  };

  const handleRunDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagUrl.trim()) return;
    setIsRunningDiag(true);
    setDiagResult(null);
    const start = performance.now();
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: diagUrl.trim(), toolType: diagType }),
      });
      const latencyMs = Math.round(performance.now() - start);
      const json = await res.json();
      if (res.ok && json.success && json.data) {
        setDiagResult({
          ok: true,
          latencyMs,
          title: json.data.title,
          author: json.data.author,
          formatsCount: Array.isArray(json.data.formats) ? json.data.formats.length : 0,
          hasProfileData: Boolean(json.data.profileData),
        });
        void loadData(false);
      } else {
        setDiagResult({
          ok: false,
          latencyMs,
          error: json.error || `HTTP ${res.status}`,
        });
      }
    } catch {
      setDiagResult({
        ok: false,
        latencyMs: Math.round(performance.now() - start),
        error: "تعذر الاتصال بنقطة الاستخراج /api/extract",
      });
    } finally {
      setIsRunningDiag(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        setIsAuthenticated(true);
        void loadData(true);
      } else {
        setLoginError(result.error || "بيانات الدخول غير صحيحة");
      }
    } catch {
      setLoginError("تعذر الاتصال بالسيرفر");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setData(null);
  };

  const handleSaveSettings = async () => {
    setSaveMessage(null);
    setSaveError(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenance_mode: maintenanceMode,
          max_downloads_per_ip_hour: maxPerHour,
          ad_top_banner_enabled: adTopEnabled,
          ad_top_banner_code: adTopCode,
          ad_results_banner_enabled: adResultsEnabled,
          ad_results_banner_code: adResultsCode,
          ad_bottom_banner_enabled: adBottomEnabled,
          ad_bottom_banner_code: adBottomCode,
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSaveMessage("تم حفظ وتطبيق التغييرات بنجاح!");
        void loadData(false);
        setTimeout(() => setSaveMessage(null), 4000);
      } else {
        setSaveError(result.error || "حدث خطأ أثناء الحفظ");
      }
    } catch {
      setSaveError("تعذر الاتصال بالسيرفر");
    }
  };

  const handleResetRateLimits = async () => {
    setSaveMessage(null);
    setSaveError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_rate_limits" }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSaveMessage(result.message || "تم تصفير قيود الطلبات بنجاح!");
        void loadData(false);
        setTimeout(() => setSaveMessage(null), 4000);
      } else {
        setSaveError(result.error || "فشل تصفير قيود الطلبات");
      }
    } catch {
      setSaveError("تعذر الاتصال بالسيرفر");
    }
  };

  const handleClearActivityLogs = async () => {
    setIsClearingLogs(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear_activity_logs" }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        void loadData(false);
      }
    } finally {
      setIsClearingLogs(false);
    }
  };

  const handleRevokeOtherSessions = async () => {
    setPwMessage(null);
    setPwError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revoke_other_sessions" }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setPwMessage(result.message || "تم إنهاء الجلسات الأخرى بنجاح");
        void loadData(false);
        setTimeout(() => setPwMessage(null), 4000);
      } else {
        setPwError(result.error || "فشل إنهاء الجلسات الأخرى");
      }
    } catch {
      setPwError("تعذر الاتصال بالسيرفر");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);
    setPwError(null);

    if (newPassword !== confirmPassword) {
      setPwError("كلمتا المرور غير متطابقتين");
      return;
    }
    if (newPassword.length < 16) {
      setPwError("كلمة المرور يجب أن لا تقل عن 16 حرفاً");
      return;
    }

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "change_password", newPassword }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setIsAuthenticated(false);
        setLoginError("تم تغيير كلمة المرور. سجّل الدخول مجدداً.");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPwMessage(null), 5000);
      } else {
        setPwError(result.error || "فشل تغيير كلمة المرور");
      }
    } catch {
      setPwError("تعذر الاتصال بالسيرفر");
    }
  };

  const stats = data?.stats || {
    totalExtractions: 0,
    successfulExtractions: 0,
    failedExtractions: 0,
    totalDownloads: 0,
    videoDownloads: 0,
    audioDownloads: 0,
    photoDownloads: 0,
    lastUpdated: "",
    recentActivities: [],
  };

  const filteredActivities = useMemo(() => {
    const list = stats.recentActivities || [];
    return list.filter((item) => {
      if (activityFilter === "failed" && item.success) return false;
      if (activityFilter !== "all" && activityFilter !== "failed" && item.type !== activityFilter) {
        return false;
      }
      if (activitySearch.trim()) {
        const q = activitySearch.trim().toLowerCase();
        const t = formatExactActivityTime(item.timestamp);
        const title = formatActivityTitle(item).toLowerCase();
        return (
          title.includes(q) ||
          (item.title || "").toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          t.dateStr.toLowerCase().includes(q) ||
          t.time24.toLowerCase().includes(q) ||
          t.time12.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [stats.recentActivities, activityFilter, activitySearch]);

  if (isLoading && isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <RefreshCw className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  // Login view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12" dir="rtl">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 text-white shadow-lg mb-3">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">لوحة تحكم Reelser.com</h1>
            <p className="text-slate-400 text-sm mt-1">سجل الدخول لإدارة الموقع والإعلانات والإحصائيات الحية</p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">اسم المستخدم</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-4 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
                <User className="w-5 h-5 text-slate-500 absolute right-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
                <Lock className="w-5 h-5 text-slate-500 absolute right-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? <RefreshCw className="w-5 h-5 animate-spin" /> : "تسجيل الدخول"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <a
              href="https://saveyou2be.com/admin"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <span>الانتقال إلى لوحة تحكم SaveYou2be</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  const successRate =
    stats.totalExtractions > 0
      ? ((stats.successfulExtractions / stats.totalExtractions) * 100).toFixed(1)
      : "100.0";

  const totalDl = Math.max(1, stats.totalDownloads);
  const videoPct = Math.round((stats.videoDownloads / totalDl) * 100);
  const audioPct = Math.round((stats.audioDownloads / totalDl) * 100);
  const photoPct = Math.round((stats.photoDownloads / totalDl) * 100);

  const activeAdsCount = [adTopEnabled, adResultsEnabled, adBottomEnabled].filter(Boolean).length;

  const passwordStrength =
    newPassword.length === 0
      ? { label: "لم يتم الإدخال", color: "bg-slate-700", pct: 0 }
      : newPassword.length < 16
      ? { label: `قصيرة (${newPassword.length}/16 حرفاً كحد أدنى)`, color: "bg-red-500", pct: 30 }
      : newPassword.length < 24
      ? { label: "قوية (مقبولة)", color: "bg-amber-500", pct: 70 }
      : { label: "قوية جداً ومشفرة بـ PBKDF2-SHA512", color: "bg-emerald-500", pct: 100 };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 text-white shadow-md shadow-pink-600/20">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base sm:text-lg flex flex-wrap items-center gap-2">
              <span>مركز قيادة Reelser.com</span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                v2.5 Pro
              </span>
              {maintenanceMode && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  ⚠️ وضع الصيانة مفعّل
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400">
              إدارة شاملة للإحصائيات الحية، 9 بوابات لغوية (172 صفحة)، الإعلانات، والأمان
            </p>
          </div>
        </div>

        {/* Global Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setAutoRefresh((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              autoRefresh
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
            }`}
            title="تحديث البيانات تلقائياً كل 15 ثانية"
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-400 animate-ping" : "bg-slate-500"}`} />
            <span>{autoRefresh ? "تحديث تلقائي (15ث)" : "تحديث تلقائي: متوقف"}</span>
          </button>

          <button
            onClick={() => {
              setIsRefreshing(true);
              void loadData(false);
            }}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            title="تحديث الإحصائيات الآن"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>تحديث الآن</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <span>معاينة الموقع</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://saveyou2be.com/admin"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors"
          >
            <span>🌐 SaveYou2be</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "stats"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>الإحصائيات والنشاط الحي</span>
          </button>

          <button
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "seo"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>الـ SEO والفاحص الحي (9 لغات)</span>
          </button>

          <button
            onClick={() => setActiveTab("ads")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "ads"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>الإعلانات ({activeAdsCount}/3)</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات النظام والحماية</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "security"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Key className="w-4 h-4" />
            <span>الأمان والجلسات</span>
          </button>
        </div>

        {/* Tab 1: Stats & Live Overview */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>إجمالي التحميلات الفعلية</span>
                  <Download className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-black text-emerald-400 mt-2">
                  {stats.totalDownloads.toLocaleString()}
                </p>
                <div className="flex flex-wrap items-center gap-2.5 mt-2.5 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-pink-400 font-semibold">
                    <Film className="w-3 h-3" /> {stats.videoDownloads} فيديو
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-purple-400 font-semibold">
                    <Music className="w-3 h-3" /> {stats.audioDownloads} صوت
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-sky-400 font-semibold">
                    <ImageIcon className="w-3 h-3" /> {stats.photoDownloads} صور
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>عمليات فحص واستخراج الروابط</span>
                  <Activity className="w-4 h-4 text-pink-400" />
                </div>
                <p className="text-3xl font-black text-white mt-2">
                  {stats.totalExtractions.toLocaleString()}
                </p>
                <span className="text-[11px] text-pink-400 font-medium block mt-2">
                  ريلز، فيديو، ستوري، صور، بروفايل
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>نسبة نجاح الاستخراج</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-black text-emerald-400 mt-2">{successRate}%</p>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, Number(successRate)))}%` }}
                  />
                </div>
                <span className="text-[11px] text-emerald-500 font-medium block mt-1.5">
                  {stats.successfulExtractions} ناجحة / {stats.failedExtractions} فاشلة
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>الصفحات المفهرسة (9 لغات)</span>
                  <Globe className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-3xl font-black text-blue-400 mt-2">
                  {data?.system?.indexedPages ?? 172} صفحة
                </p>
                <span className="text-[11px] text-blue-300 font-medium block">
                  Google + Bing + Yandex Sitemap
                </span>
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                  <button
                    type="button"
                    onClick={handleIndexNowSubmit}
                    disabled={isSubmittingIndexNow}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSubmittingIndexNow ? "animate-spin" : ""}`} />
                    <span>{isSubmittingIndexNow ? "جاري الإرسال..." : "إرسال فوري لـ IndexNow"}</span>
                  </button>
                  {indexNowStatus && (
                    <p
                      className={`text-[10px] font-semibold leading-snug ${
                        indexNowStatus.ok ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {indexNowStatus.text}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* System Health & Media Breakdown Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Server Resources Card */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-pink-400" />
                    <span>حالة الخادم والموارد الحية (Server Telemetry)</span>
                  </h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                    يعمل بكفاءة • {data?.system?.nodeVersion || "Node.js"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">مدة التشغيل (Uptime)</span>
                    <p className="text-sm font-bold text-white mt-1">
                      {formatUptime(data?.system?.uptime)}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">الذاكرة (RAM RSS / Heap)</span>
                    <p className="text-sm font-bold text-emerald-400 mt-1">
                      {data?.system?.memoryRssMB ?? "—"} MB{" "}
                      <span className="text-xs text-slate-500">({data?.system?.memoryHeapMB ?? "—"} MB)</span>
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">عناوين IP النشطة (آخر ساعة)</span>
                    <p className="text-sm font-bold text-amber-400 mt-1">
                      {data?.system?.activeRateLimitIps ?? 0} عنوان IP
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block">محرك الاستخراج الخلفي</span>
                    <p className="text-sm font-bold text-blue-400 mt-1">
                      {data?.system?.selfHostedConfigured ? "Self-Hosted + Fallback" : "Multi-Layer Cloud"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Media Type Distribution Card */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3.5">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  <span>توزيع التحميلات حسب الصيغة</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Film className="w-3.5 h-3.5 text-pink-400" /> فيديو وريلز (MP4)
                      </span>
                      <span className="font-bold text-pink-400">
                        {stats.videoDownloads} ({stats.totalDownloads > 0 ? videoPct : 0}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-pink-500 rounded-full transition-all"
                        style={{ width: `${stats.totalDownloads > 0 ? videoPct : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <Music className="w-3.5 h-3.5 text-purple-400" /> صوت وموسيقى (MP3)
                      </span>
                      <span className="font-bold text-purple-400">
                        {stats.audioDownloads} ({stats.totalDownloads > 0 ? audioPct : 0}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all"
                        style={{ width: `${stats.totalDownloads > 0 ? audioPct : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <ImageIcon className="w-3.5 h-3.5 text-sky-400" /> صور وألبومات (JPG/HD)
                      </span>
                      <span className="font-bold text-sky-400">
                        {stats.photoDownloads} ({stats.totalDownloads > 0 ? photoPct : 0}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all"
                        style={{ width: `${stats.totalDownloads > 0 ? photoPct : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Activity Feed with Filters & Search */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-500" />
                    <span>سجل النشاط المباشر ({filteredActivities.length} عملية)</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    يتم حفظ آخر 200 عملية تلقائياً مع إمكانية التصفية حسب نوع الوسائط أو الحالة
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      placeholder="بحث في السجل..."
                      className="pl-3 pr-8 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2" />
                  </div>

                  {stats.recentActivities && stats.recentActivities.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearActivityLogs}
                      disabled={isClearingLogs}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>مسح السجل</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-1">
                  <Filter className="w-3 h-3" /> تصفية:
                </span>
                {[
                  { id: "all", label: "الكل" },
                  { id: "video", label: "فيديو MP4" },
                  { id: "audio", label: "صوت MP3" },
                  { id: "image", label: "صور HD" },
                  { id: "extract", label: "عمليات الفحص" },
                  { id: "failed", label: "الفاشلة فقط" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActivityFilter(f.id as typeof activityFilter)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      activityFilter === f.id
                        ? "bg-pink-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {filteredActivities.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  لا توجد عمليات مطابقة للفلتر المحدد حالياً.
                </div>
              ) : (
                <div className="divide-y divide-slate-800 overflow-hidden rounded-xl border border-slate-800/80 max-h-[420px] overflow-y-auto">
                  {filteredActivities.map((act) => {
                    const isAudio = act.type === "audio";
                    const isVideo = act.type === "video";
                    const isImage = act.type === "image";
                    const timeInfo = formatExactActivityTime(act.timestamp);
                    const displayTitle = formatActivityTitle(act);

                    return (
                      <div
                        key={act.id}
                        className="p-3.5 bg-slate-900/60 hover:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`p-2 rounded-lg shrink-0 ${
                              isAudio
                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                : isVideo
                                ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                                : isImage
                                ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            }`}
                          >
                            {isAudio ? (
                              <Music className="w-3.5 h-3.5" />
                            ) : isVideo ? (
                              <Film className="w-3.5 h-3.5" />
                            ) : isImage ? (
                              <ImageIcon className="w-3.5 h-3.5" />
                            ) : (
                              <Activity className="w-3.5 h-3.5" />
                            )}
                          </span>

                          <div className="min-w-0">
                            <p className="font-bold text-white truncate">
                              {displayTitle}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                              <span>
                                {isAudio
                                  ? "تحميل صوت MP3"
                                  : isVideo
                                  ? "تحميل فيديو MP4"
                                  : isImage
                                  ? "تحميل صورة HD"
                                  : "استخراج بيانات الرابط"}
                              </span>
                              <span className="text-slate-600">•</span>
                              <span className="text-pink-400/90 font-semibold">
                                {timeInfo.relative}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-end gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              act.success
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {act.success ? "ناجح ✓" : "فشل ✕"}
                          </span>

                          <div
                            dir="ltr"
                            title={act.timestamp}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-200"
                          >
                            <Clock className="w-3 h-3 text-pink-400 shrink-0" />
                            <span className="text-slate-400">{timeInfo.dateStr}</span>
                            <span className="text-slate-600">|</span>
                            <span className="font-bold text-white">{timeInfo.time24}</span>
                            {timeInfo.time12 && (
                              <span className="text-[10px] text-slate-400">({timeInfo.time12})</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: SEO & Live Extractor Diagnostic Tool */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            {/* Live Extractor Diagnostic Tool */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-400" />
                    <span>فاحص الاستخراج الحي (Live Extractor Diagnostics)</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    اختبر سرعة واستجابة محرك استخراج إنستغرام مباشرة من داخل لوحة التحكم لأي رابط أو @username
                  </p>
                </div>
              </div>

              <form onSubmit={handleRunDiagnostic} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={diagUrl}
                    onChange={(e) => setDiagUrl(e.target.value)}
                    placeholder="الصق رابط ريلز / ستوري أو اكتب @username..."
                    dir="ltr"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <select
                    value={diagType}
                    onChange={(e) => setDiagType(e.target.value as typeof diagType)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="reels">فحص ريلز وفيديو (Reels)</option>
                    <option value="story">فحص ستوري (Story)</option>
                    <option value="photo">فحص صور وألبوم (Photo)</option>
                    <option value="audio">فحص صوت (Audio MP3)</option>
                    <option value="profile">فحص بروفايل (@username)</option>
                  </select>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isRunningDiag}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isRunningDiag ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>جاري الفحص...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>تشغيل الفحص الحي</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {diagResult && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    diagResult.ok
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-sm">
                      {diagResult.ok ? "✓ نجح الاستخراج المباشر" : "✕ فشل الاستخراج"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950/60 font-mono text-[11px]">
                      زمن الاستجابة: {diagResult.latencyMs} ms
                    </span>
                  </div>
                  {diagResult.ok ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-200">
                      <div>
                        <span className="text-slate-400">العنوان: </span>
                        <span className="font-semibold">{diagResult.title || "—"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">الحساب: </span>
                        <span className="font-semibold">{diagResult.author || "—"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">الصيغ المستخرجة: </span>
                        <span className="font-bold text-emerald-400">
                          {diagResult.formatsCount} صيغة جاهزة للتحميل
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p>{diagResult.error}</p>
                  )}
                </div>
              )}
            </div>

            {/* 9 Language Hubs Overview */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    <span>خريطة البوابات اللغوية التسع (9-Way Hreflang Matrix — 172 صفحة)</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    جميع اللغات التسع في الموقع مفهرسة بالكامل ومرتبطة تبادلياً بوسوم hreflang وشريط روابط HTML مباشر
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5"
                  >
                    <span>فتح Sitemap.xml</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleIndexNowSubmit}
                    disabled={isSubmittingIndexNow}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSubmittingIndexNow ? "animate-spin" : ""}`} />
                    <span>إرسال 172 رابطاً لـ IndexNow الآن</span>
                  </button>
                </div>
              </div>

              {indexNowStatus && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    indexNowStatus.ok
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  }`}
                >
                  <p className="font-bold">{indexNowStatus.text}</p>
                  {indexNowStatus.results && (
                    <div className="flex flex-wrap gap-3 pt-1">
                      {indexNowStatus.results.map((r) => (
                        <span
                          key={r.endpoint}
                          className="px-2.5 py-1 rounded-lg bg-slate-950/70 font-mono text-[11px]"
                        >
                          {new URL(r.endpoint).hostname}: {r.ok ? `✓ ${r.status}` : `✕ ${r.status || "Timeout"}`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {LANGUAGE_HUBS_INFO.map((hub) => (
                  <div
                    key={hub.code}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-pink-500/40 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{hub.flag}</span>
                        <span className="font-bold text-white text-sm">{hub.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        السوق المستهدف: {hub.region}
                      </p>
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
                        {hub.pages} صفحة مفهرسة
                      </span>
                    </div>
                    <a
                      href={hub.path}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white transition-colors shrink-0"
                      title={`فتح بوابة ${hub.name}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Ads & Monetization */}
        {activeTab === "ads" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                    <span>إدارة المساحات الإعلانية (Monetization)</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    تحكم في تفعيل ومعاينة الوحدات الإعلانية الثلاث في جميع صفحات الموقع (172 صفحة)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAdTopEnabled(false);
                      setAdResultsEnabled(false);
                      setAdBottomEnabled(false);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 cursor-pointer"
                  >
                    إيقاف الكل مؤقتاً
                  </button>
                </div>
              </div>

              {saveMessage && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{saveMessage}</span>
                </div>
              )}

              {saveError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* Slot 1: Top Banner */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">1. إعلان أعلى الصفحة (Top Banner)</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        adTopEnabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {adTopEnabled ? "مفعّل" : "معطّل"}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adTopEnabled}
                      onChange={(e) => setAdTopEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>يظهر مباشرة تحت شريط التنقل وقبل صندوق إدخال الرابط.</span>
                  <span className="font-mono text-[11px]">{adTopCode.length} / 8000</span>
                </div>
                <textarea
                  rows={3}
                  value={adTopCode}
                  onChange={(e) => setAdTopCode(e.target.value)}
                  dir="ltr"
                  placeholder="<!-- الصق كود HTML آمن هنا (بدون وسم script) -->"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-pink-500"
                />
                {adTopCode.trim() && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setPreviewAdSlot(previewAdSlot === "top" ? null : "top")}
                      className="text-[11px] text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{previewAdSlot === "top" ? "إخفاء المعاينة" : "معاينة مظهر الإعلان"}</span>
                    </button>
                    {previewAdSlot === "top" && (
                      <div
                        className="mt-2 p-3 rounded-xl bg-white text-slate-900 overflow-x-auto text-center"
                        dangerouslySetInnerHTML={{ __html: adTopCode }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Slot 2: Mid-Results Banner */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">2. إعلان وسط النتائج (Results Banner)</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        adResultsEnabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {adResultsEnabled ? "مفعّل" : "معطّل"}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adResultsEnabled}
                      onChange={(e) => setAdResultsEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>يظهر فوق بطاقة الفيديو المستخرج وأزرار التحميل المباشر (أعلى نسبة نقر CTR).</span>
                  <span className="font-mono text-[11px]">{adResultsCode.length} / 8000</span>
                </div>
                <textarea
                  rows={3}
                  value={adResultsCode}
                  onChange={(e) => setAdResultsCode(e.target.value)}
                  dir="ltr"
                  placeholder="<!-- الصق كود HTML آمن هنا (بدون وسم script) -->"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-pink-500"
                />
                {adResultsCode.trim() && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setPreviewAdSlot(previewAdSlot === "results" ? null : "results")}
                      className="text-[11px] text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{previewAdSlot === "results" ? "إخفاء المعاينة" : "معاينة مظهر الإعلان"}</span>
                    </button>
                    {previewAdSlot === "results" && (
                      <div
                        className="mt-2 p-3 rounded-xl bg-white text-slate-900 overflow-x-auto text-center"
                        dangerouslySetInnerHTML={{ __html: adResultsCode }}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Slot 3: Bottom Banner */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">3. إعلان أسفل الصفحة (Bottom Banner)</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        adBottomEnabled ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {adBottomEnabled ? "مفعّل" : "معطّل"}
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adBottomEnabled}
                      onChange={(e) => setAdBottomEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>يظهر في أسفل قسم الأداة الرئيسية.</span>
                  <span className="font-mono text-[11px]">{adBottomCode.length} / 8000</span>
                </div>
                <textarea
                  rows={3}
                  value={adBottomCode}
                  onChange={(e) => setAdBottomCode(e.target.value)}
                  dir="ltr"
                  placeholder="<!-- الصق كود HTML آمن هنا (بدون وسم script) -->"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-pink-500"
                />
                {adBottomCode.trim() && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setPreviewAdSlot(previewAdSlot === "bottom" ? null : "bottom")}
                      className="text-[11px] text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{previewAdSlot === "bottom" ? "إخفاء المعاينة" : "معاينة مظهر الإعلان"}</span>
                    </button>
                    {previewAdSlot === "bottom" && (
                      <div
                        className="mt-2 p-3 rounded-xl bg-white text-slate-900 overflow-x-auto text-center"
                        dangerouslySetInnerHTML={{ __html: adBottomCode }}
                      />
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ وتطبيق إعدادات الإعلانات</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: System Settings */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-pink-400" />
                  <span>إعدادات النظام والحماية من الهجمات</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  التحكم في وضع الصيانة، سقف الطلبات لكل زائر، وتصفير الحصص المؤقتة
                </p>
              </div>

              {saveMessage && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{saveMessage}</span>
                </div>
              )}

              {saveError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white">وضع الصيانة (Maintenance Mode)</span>
                  <p className="text-slate-400 text-xs mt-0.5">
                    عند التفعيل، يعرض الموقع رسالة صيانة مؤقتة للزوار ويوقف عمليات التحميل والاستخراج.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                </label>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div>
                  <span className="text-sm font-bold text-white">
                    الحد الأقصى للتحميل لكل عنوان IP في الساعة
                  </span>
                  <p className="text-slate-400 text-xs mt-0.5">
                    حماية السيرفر من الروبوتات والاستخدام الجائر (المسموح بين 1 و 600 عملية/ساعة).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={600}
                    value={maxPerHour}
                    onChange={(e) => setMaxPerHour(Number(e.target.value))}
                    className="w-28 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-bold focus:outline-none focus:border-pink-500"
                  />
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { val: 30, label: "30 (صارم)" },
                      { val: 60, label: "60 (متوازن)" },
                      { val: 120, label: "120 (مرن)" },
                      { val: 300, label: "300 (مرتفع)" },
                    ].map((preset) => (
                      <button
                        key={preset.val}
                        type="button"
                        onClick={() => setMaxPerHour(preset.val)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          maxPerHour === preset.val
                            ? "bg-pink-600/20 border-pink-500 text-pink-300"
                            : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetRateLimits}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>تصفير قيود الطلبات والحصص المؤقتة ({data?.system?.activeRateLimitIps ?? 0} IP)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Security & Sessions */}
        {activeTab === "security" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Change Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-400" />
                  <span>تغيير كلمة مرور المشرف (Admin)</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  تُشفر كلمة المرور بخوارزمية PBKDF2-SHA512 (210,000 دورة) وتُنهي جميع الجلسات السابقة تلقائياً
                </p>
              </div>

              {pwMessage && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{pwMessage}</span>
                </div>
              )}

              {pwError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{pwError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      كلمة المرور الجديدة (16 حرفاً على الأقل)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPasswords((v) => !v)}
                      className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPasswords ? "إخفاء" : "إظهار"}</span>
                    </button>
                  </div>
                  <input
                    type={showPasswords ? "text" : "password"}
                    required
                    minLength={16}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                  />
                  <div className="mt-2 space-y-1">
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">{passwordStrength.label}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    required
                    minLength={16}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-600/20 transition-all cursor-pointer"
                >
                  تحديث كلمة المرور الآن
                </button>
              </form>
            </div>

            {/* Active Admin Sessions & Security Status */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>إدارة الجلسات النشطة وحماية اللوحة</span>
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  يتم تخزين جلسات المشرف بتوقيع HMAC-SHA256 مع صلاحية 24 ساعة لكل جلسة وحماية Same-Origin ضد هجمات CSRF.
                </p>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">الجلسات النشطة حالياً</span>
                    <p className="text-2xl font-black text-emerald-400 mt-1">
                      {data?.system?.activeSessionsCount ?? 1} جلسة نشطة
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    جلستك الحالية مؤمّنة
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRevokeOtherSessions}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 font-bold text-sm rounded-xl transition-all cursor-pointer"
              >
                إنهاء جميع الجلسات الأخرى والاحتفاظ بجلستي الحالية فقط
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
