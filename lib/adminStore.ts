import crypto from "node:crypto";
import { transaction } from "./storage";

export interface ActivityItem {
  id: string;
  type: "video" | "audio" | "image" | "extract";
  title: string;
  timestamp: string;
  success: boolean;
}

export interface AdminSettings {
  maintenance_mode: boolean;
  ad_top_banner_enabled: boolean;
  ad_top_banner_code: string;
  ad_results_banner_enabled: boolean;
  ad_results_banner_code: string;
  ad_bottom_banner_enabled: boolean;
  ad_bottom_banner_code: string;
  max_downloads_per_ip_hour: number;
}

export interface AdminStats {
  totalExtractions: number;
  successfulExtractions: number;
  failedExtractions: number;
  totalDownloads: number;
  videoDownloads: number;
  audioDownloads: number;
  photoDownloads: number;
  lastUpdated: string;
  recentActivities: ActivityItem[];
}

const DEFAULT_SETTINGS: AdminSettings = {
  maintenance_mode: false,
  ad_top_banner_enabled: false,
  ad_top_banner_code: "",
  ad_results_banner_enabled: false,
  ad_results_banner_code: "",
  ad_bottom_banner_enabled: false,
  ad_bottom_banner_code: "",
  max_downloads_per_ip_hour: 60,
};

const DEFAULT_STATS: AdminStats = {
  totalExtractions: 0,
  successfulExtractions: 0,
  failedExtractions: 0,
  totalDownloads: 0,
  videoDownloads: 0,
  audioDownloads: 0,
  photoDownloads: 0,
  lastUpdated: new Date().toISOString(),
  recentActivities: [],
};

interface AdminData {
  password_hash: string;
  salt: string;
  iterations?: number;
  sessions?: Record<string, number>;
  settings: AdminSettings;
  stats: AdminStats;
}

function secret() {
  const value = process.env.ADMIN_JWT_SECRET;
  if (!value || value.length < 32 || value === "reelser-super-secret-key-2026-secure-jwt") {
    throw new Error("Administration disabled: configure a new random ADMIN_JWT_SECRET (32+ characters)");
  }
  return value;
}

function change<R>(fn: (data: AdminData) => R): R {
  return transaction<AdminData, R>("admin-config", () => ({
    password_hash: "", salt: "", iterations: 210000, sessions: {},
    settings: { ...DEFAULT_SETTINGS }, stats: { ...DEFAULT_STATS, recentActivities: [] },
  }), data => {
    if (!data || typeof data.password_hash !== "string" || typeof data.salt !== "string" ||
        !data.settings || !data.stats || !Array.isArray(data.stats.recentActivities) ||
        (data.password_hash && (!/^[a-f0-9]{128}$/.test(data.password_hash) || !/^[a-f0-9]{32}$/.test(data.salt))) ||
        (data.iterations !== undefined && ![10000, 210000].includes(data.iterations)) ||
        !Number.isInteger(data.settings.max_downloads_per_ip_hour) || data.settings.max_downloads_per_ip_hour < 1 ||
        data.settings.max_downloads_per_ip_hour > 600 || typeof data.settings.maintenance_mode !== "boolean") {
      throw new Error("Invalid administration storage; restore a valid backup");
    }
    data.settings = { ...DEFAULT_SETTINGS, ...data.settings };
    data.sessions ??= {}; // Legacy JWTs are intentionally invalid after migration.
    return fn(data);
  });
}

function hashPassword(password: string, salt: string, iterations: number) {
  return crypto.pbkdf2Sync(password, salt, iterations, 64, "sha512").toString("hex");
}

export function getAdminSettings() { return change(data => ({ ...data.settings })); }
export function getAdminStats() { return change(data => data.stats); }
export function updateAdminSettings(partial: Partial<AdminSettings>) {
  return change(data => {
    data.settings = { ...data.settings, ...partial };
    return data.settings;
  });
}

export function recordExtractionStat(success: boolean) {
  recordActivity("extract", success);
}
export function recordDownloadStat(type: "video" | "audio" | "image") {
  recordActivity(type, true);
}
function recordActivity(type: ActivityItem["type"], success: boolean) {
  // Telemetry must never turn a completed transfer into a failed one.
  try {
    change(data => {
      const stats = data.stats;
      if (type === "extract") {
        stats.totalExtractions++;
        if (success) stats.successfulExtractions++; else stats.failedExtractions++;
      } else {
        stats.totalDownloads++;
        if (type === "video") stats.videoDownloads++;
        else if (type === "audio") stats.audioDownloads++;
        else stats.photoDownloads++;
      }
      stats.lastUpdated = new Date().toISOString();
      stats.recentActivities = [{ id: crypto.randomUUID(), type, success,
        title: type === "extract" ? "Media extraction" : "Media download", timestamp: stats.lastUpdated },
        ...stats.recentActivities.map(item => ({ ...item, title: "Media request" }))].slice(0, 30);
    });
  } catch { console.error("Unable to persist request statistics"); }
}

export function verifyAdminCredentials(username: string, password: string) {
  secret();
  if (username !== "admin" || password === "Admin@Reelser2026!" || password.length > 1024) return false;
  return change(data => {
    if (!data.password_hash) {
      const initial = process.env.REELSER_ADMIN_PASS;
      if (!initial || initial.length < 16 || initial === "Admin@Reelser2026!") {
        throw new Error("Administration disabled: configure REELSER_ADMIN_PASS (16+ characters)");
      }
      data.salt = crypto.randomBytes(16).toString("hex");
      data.iterations = 210000;
      data.password_hash = hashPassword(initial, data.salt, data.iterations);
    }
    const actual = hashPassword(password, data.salt, data.iterations ?? 10000);
    return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(data.password_hash, "hex"));
  });
}

export function updateAdminPassword(password: string) {
  secret();
  if (typeof password !== "string" || password.length < 16 || password.length > 1024) return false;
  return change(data => {
    data.salt = crypto.randomBytes(16).toString("hex");
    data.iterations = 210000;
    data.password_hash = hashPassword(password, data.salt, data.iterations);
    data.sessions = {};
    return true;
  });
}

function sessionHash(token: string) {
  return crypto.createHmac("sha256", secret()).update(token).digest("hex");
}
export function createAdminToken() {
  const token = crypto.randomBytes(32).toString("base64url");
  const hash = sessionHash(token);
  change(data => {
    data.sessions = Object.fromEntries(Object.entries(data.sessions!).filter(([, exp]) => exp > Date.now()).slice(-19));
    data.sessions[hash] = Date.now() + 86400_000;
  });
  return token;
}
export function verifyAdminToken(token: string) {
  try {
    if (!/^[\w-]{43}$/.test(token)) return false;
    const hash = sessionHash(token);
    return change(data => {
      const exp = data.sessions![hash];
      return Number.isFinite(exp) && exp > Date.now();
    });
  } catch { return false; }
}
export function revokeAdminToken(token: string) {
  const hash = sessionHash(token);
  change(data => { delete data.sessions![hash]; });
}
