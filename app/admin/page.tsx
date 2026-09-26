"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Clock,
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
  };
}

export default function ReelserAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<"stats" | "ads" | "settings" | "security">("stats");
  const [data, setData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Settings form
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maxPerHour, setMaxPerHour] = useState(60);
  const [adTopEnabled, setAdTopEnabled] = useState(false);
  const [adTopCode, setAdTopCode] = useState("");
  const [adResultsEnabled, setAdResultsEnabled] = useState(false);
  const [adResultsCode, setAdResultsCode] = useState("");
  const [adBottomEnabled, setAdBottomEnabled] = useState(false);
  const [adBottomCode, setAdBottomCode] = useState("");

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwMessage, setPwMessage] = useState<string | null>(null);
  const [pwError, setPwError] = useState<string | null>(null);

  const loadData = useCallback(() => {
    return fetch("/api/admin/data", { cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Unavailable");
        const json: AdminData = await response.json();
        if (!json.success) throw new Error("Unauthorized");
        setIsAuthenticated(true); setData(json);
        setMaintenanceMode(json.settings.maintenance_mode);
        setMaxPerHour(json.settings.max_downloads_per_ip_hour);
        setAdTopEnabled(json.settings.ad_top_banner_enabled); setAdTopCode(json.settings.ad_top_banner_code);
        setAdResultsEnabled(json.settings.ad_results_banner_enabled); setAdResultsCode(json.settings.ad_results_banner_code);
        setAdBottomEnabled(json.settings.ad_bottom_banner_enabled); setAdBottomCode(json.settings.ad_bottom_banner_code);
      }).catch(() => setIsAuthenticated(false))
      .finally(() => { setIsLoading(false); setIsRefreshing(false); });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        loadData();
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
        setTimeout(() => setSaveMessage(null), 4000);
      } else {
        setSaveError(result.error || "حدث خطأ أثناء الحفظ");
      }
    } catch {
      setSaveError("تعذر الاتصال بالسيرفر");
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

  // Authenticated view
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

  const successRate = stats.totalExtractions > 0
    ? ((stats.successfulExtractions / stats.totalExtractions) * 100).toFixed(1)
    : "100";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 text-white">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
              <span>Reelser.com</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                لوحة الإدارة الحية
              </span>
            </h1>
            <p className="text-xs text-slate-400">إحصائيات فورية، إدارة الإعلانات، ومتابعة الأداء</p>
          </div>
        </div>

        {/* Global Sites Switcher & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => { setIsRefreshing(true); void loadData(); }}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 hover:bg-pink-500/20 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
            title="تحديث الإحصائيات الآن"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>تحديث لحظي</span>
          </button>

          <a
            href="https://saveyou2be.com/admin"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors"
          >
            <span>🌐 SaveYou2be Admin</span>
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
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8">
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
            <span>الإحصائيات المباشرة</span>
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
            <span>الإعلانات والأرباح</span>
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
            <span>إعدادات النظام</span>
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
            <span>الأمان وكلمة المرور</span>
          </button>
        </div>

        {/* Tab 1: Stats & Overview */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>إجمالي التحميلات الفعلية</span>
                  <Download className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-black text-emerald-400 mt-2">{stats.totalDownloads.toLocaleString()}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-purple-400 font-semibold">
                    <Music className="w-3 h-3" /> {stats.audioDownloads} صوت
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-pink-400 font-semibold">
                    <Film className="w-3 h-3" /> {stats.videoDownloads} فيديو
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>عمليات فحص واستخراج الروابط</span>
                  <Activity className="w-4 h-4 text-pink-400" />
                </div>
                <p className="text-3xl font-black text-white mt-2">{stats.totalExtractions.toLocaleString()}</p>
                <span className="text-[11px] text-pink-400 font-medium">ريلز، فيديو، ستوري، صور</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>نسبة نجاح الاستخراج</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-black text-emerald-400 mt-2">{successRate}%</p>
                <span className="text-[11px] text-emerald-500 font-medium">
                  {stats.successfulExtractions} ناجحة / {stats.failedExtractions} فاشلة
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>الصفحات المفهرسة</span>
                  <Radio className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-3xl font-black text-blue-400 mt-2">45 صفحة</p>
                <span className="text-[11px] text-blue-300 font-medium">Google + Bing sitemap</span>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-pink-500" />
                    <span>سجل النشاط المباشر (آخر العمليات المسجلة)</span>
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">
                    يتم تسجيل كل عملية تحميل واستخراج لحظياً بدقة
                  </p>
                </div>
                <button
                  onClick={() => loadData()}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
                  <span>تحديث</span>
                </button>
              </div>

              {(!stats.recentActivities || stats.recentActivities.length === 0) ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  لا توجد عمليات مسجلة حتى الآن. بمجرد قيامك أو قيام أي زائر بالتحميل، ستظهر هنا فورياً!
                </div>
              ) : (
                <div className="divide-y divide-slate-800 overflow-hidden rounded-xl border border-slate-800/80">
                  {stats.recentActivities.map((act) => {
                    const isAudio = act.type === "audio";
                    const isVideo = act.type === "video";

                    return (
                      <div key={act.id} className="p-3.5 bg-slate-900/60 hover:bg-slate-800/40 flex items-center justify-between gap-3 text-xs transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`p-2 rounded-lg shrink-0 ${
                              isAudio
                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                : isVideo
                                ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            }`}
                          >
                            {isAudio ? <Music className="w-3.5 h-3.5" /> : isVideo ? <Film className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                          </span>

                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{act.title || "عملية بدون عنوان"}</p>
                            <span className="text-[11px] text-slate-400">
                              {isAudio ? "تحميل صوت MP3" : isVideo ? "تحميل فيديو MP4" : "استخراج بيانات الرابط"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              act.success
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {act.success ? "ناجح ✓" : "فشل ✕"}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {new Date(act.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Links Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-white text-base">لوحة تحكم الموقع الشقيق SaveYou2be</h3>
                <p className="text-slate-400 text-xs mt-1">
                  يمكنك التبديل مباشرة وإدارة تحميلات يوتيوب وتيك توك وفيسبوك من لوحة تحكم SaveYou2be.
                </p>
              </div>
              <a
                href="https://saveyou2be.com/admin"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0"
              >
                <span>فتح لوحة SaveYou2be</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Tab 2: Ads & Monetization */}
        {activeTab === "ads" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <span>إدارة المساحات الإعلانية (Monetization)</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  فعّل الإعلانات والصق كود Google AdSense أو Adsterra أو أي شبكة إعلانات تختارها:
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

              {/* Slot 1: Top Banner */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">1. إعلان أعلى الصفحة (Top Banner)</span>
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
                <p className="text-slate-400 text-xs">يظهر مباشرة تحت شريط التنقل وقبل صندوق إدخال الرابط.</p>
                <textarea
                  rows={3}
                  value={adTopCode}
                  onChange={(e) => setAdTopCode(e.target.value)}
                  placeholder="<!-- الصق كود HTML أو Script هنا -->"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Slot 2: Mid-Results Banner */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">2. إعلان وسط النتائج (Results Banner)</span>
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
                <p className="text-slate-400 text-xs">يظهر بين معاينة الفيديو وأزرار التحميل المباشر (أعلى نسبة نقر).</p>
                <textarea
                  rows={3}
                  value={adResultsCode}
                  onChange={(e) => setAdResultsCode(e.target.value)}
                  placeholder="<!-- الصق كود HTML أو Script هنا -->"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Slot 3: Bottom Banner */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">3. إعلان أسفل الصفحة (Bottom Banner)</span>
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
                <p className="text-slate-400 text-xs">يظهر في أسفل الصفحة قبل الفوتر مباشرة.</p>
                <textarea
                  rows={3}
                  value={adBottomCode}
                  onChange={(e) => setAdBottomCode(e.target.value)}
                  placeholder="<!-- الصق كود HTML أو Script هنا -->"
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ إعدادات الإعلانات</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: System Settings */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-pink-400" />
                  <span>إعدادات النظام والأمان</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1">التحكم في تشغيل الموقع وحدود الحماية من الهجمات</p>
              </div>

              {saveMessage && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{saveMessage}</span>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white">وضع الصيانة (Maintenance Mode)</span>
                  <p className="text-slate-400 text-xs mt-0.5">
                    عند التفعيل، يعرض الموقع رسالة صيانة مؤقتة للزوار ويوقف عمليات التحميل.
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

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <span className="text-sm font-bold text-white">الحد الأقصى للتحميل لكل عنوان IP في الساعة</span>
                <p className="text-slate-400 text-xs">
                  حماية السيرفر من الروبوتات وهجمات حجب الخدمة (الافتراضي 60 عملية/ساعة).
                </p>
                <input
                  type="number"
                  min={5}
                  max={500}
                  value={maxPerHour}
                  onChange={(e) => setMaxPerHour(Number(e.target.value))}
                  className="w-32 p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Security & Password */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-lg space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-purple-400" />
                  <span>تغيير كلمة مرور المشرف (Admin)</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1">تحديث كلمة مرور الدخول للوحة تحكم Reelser</p>
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    required
                    minLength={16}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">تأكيد كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    required
                    minLength={16}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-600/20 transition-all cursor-pointer"
                >
                  تحديث كلمة المرور
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
