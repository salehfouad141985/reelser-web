import crypto from "node:crypto";
import { promisify } from "node:util";
import { readSnapshot, transaction } from "./storage";
const pbkdf2 = promisify(crypto.pbkdf2);

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

const ACTIVITY_LOG_MAX_ENTRIES = 200;
const configuredRetentionDays = Number(process.env.ACTIVITY_LOG_RETENTION_DAYS || "30");
const ACTIVITY_LOG_RETENTION_DAYS = Number.isFinite(configuredRetentionDays)
  ? Math.min(90, Math.max(1, Math.floor(configuredRetentionDays)))
  : 30;

function activityTimestamp(value: string): number {
  const ts = Date.parse(value.includes("T") ? value : value.replace(" ", "T") + "Z");
  return Number.isFinite(ts) ? ts : Date.now();
}

function activityTitle(type: ActivityItem["type"]): string {
  return type === "extract"
    ? "استخراج بيانات الرابط"
    : type === "video"
    ? "تحميل فيديو MP4"
    : type === "audio"
    ? "تحميل صوت MP3"
    : "تحميل صورة HD";
}

function minimizeActivities(activities: ActivityItem[]): ActivityItem[] {
  const cutoff = Date.now() - ACTIVITY_LOG_RETENTION_DAYS * 86_400_000;
  return activities
    .filter((entry) => activityTimestamp(entry.timestamp) >= cutoff)
    .slice(0, ACTIVITY_LOG_MAX_ENTRIES)
    .map((entry) => ({
      ...entry,
      title:
        !entry.title || /^Media (request|download|extraction)$/i.test(entry.title)
          ? activityTitle(entry.type)
          : entry.title,
      timestamp: new Date(activityTimestamp(entry.timestamp)).toISOString(),
    }));
}

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

function initialData(): AdminData {
  return {
    password_hash: "",
    salt: "",
    iterations: 210000,
    sessions: {},
    settings: { ...DEFAULT_SETTINGS },
    stats: { ...DEFAULT_STATS, recentActivities: [] },
  };
}

function normalizeData(data: AdminData): AdminData {
  if (
    !data ||
    typeof data.password_hash !== "string" ||
    typeof data.salt !== "string" ||
    !data.settings ||
    !data.stats ||
    !Array.isArray(data.stats.recentActivities) ||
    (data.password_hash && (!/^[a-f0-9]{128}$/.test(data.password_hash) || !/^[a-f0-9]{32}$/.test(data.salt))) ||
    (data.iterations !== undefined && ![10000, 210000].includes(data.iterations)) ||
    !Number.isInteger(data.settings.max_downloads_per_ip_hour) ||
    data.settings.max_downloads_per_ip_hour < 1 ||
    data.settings.max_downloads_per_ip_hour > 600 ||
    typeof data.settings.maintenance_mode !== "boolean"
  ) {
    throw new Error("Invalid administration storage; restore a valid backup");
  }
  data.settings = { ...DEFAULT_SETTINGS, ...data.settings };
  data.sessions ??= {};
  data.stats.recentActivities = minimizeActivities(data.stats.recentActivities);
  return data;
}

async function snapshot() {
  return normalizeData(await readSnapshot("admin-config", initialData));
}

function change<R>(fn: (data: AdminData) => R | Promise<R>): Promise<R> {
  return transaction<AdminData, R>("admin-config", initialData, async (data) => {
    normalizeData(data);
    const result = await fn(data);
    data.stats.recentActivities = minimizeActivities(data.stats.recentActivities);
    return result;
  });
}

async function hashPassword(password: string, salt: string, iterations: number) {
  return (await pbkdf2(password, salt, iterations, 64, "sha512")).toString("hex");
}

export async function getAdminSettings() {
  return { ...(await snapshot()).settings };
}
export async function getAdminStats() {
  return (await snapshot()).stats;
}
export async function getActiveAdminSessionsCount() {
  const sessions = (await snapshot()).sessions ?? {};
  const now = Date.now();
  return Object.values(sessions).filter((exp) => Number.isFinite(exp) && exp > now).length;
}
export function clearAdminActivities() {
  return change((data) => {
    data.stats.recentActivities = [];
    data.stats.lastUpdated = new Date().toISOString();
    return data.stats;
  });
}
export function revokeOtherAdminSessions(currentToken: string) {
  const currentHash = sessionHash(currentToken);
  return change((data) => {
    const exp = data.sessions?.[currentHash];
    data.sessions = exp && exp > Date.now() ? { [currentHash]: exp } : {};
  });
}
export function updateAdminSettings(partial: Partial<AdminSettings>) {
  return change((data) => {
    data.settings = { ...data.settings, ...partial };
    return data.settings;
  });
}

export async function recordExtractionStat(success: boolean, timestamp?: string) {
  await recordActivity("extract", success, timestamp);
}
export async function recordDownloadStat(type: "video" | "audio" | "image", success = true, timestamp?: string) {
  await recordActivity(type, success, timestamp);
}
async function recordActivity(type: ActivityItem["type"], success: boolean, attemptTimestamp?: string) {
  // Telemetry must never turn a completed transfer into a failed one.
  try {
    await change((data) => {
      const stats = data.stats;
      if (type === "extract") {
        stats.totalExtractions++;
        if (success) stats.successfulExtractions++;
        else stats.failedExtractions++;
      } else if (success) {
        stats.totalDownloads++;
        if (type === "video") stats.videoDownloads++;
        else if (type === "audio") stats.audioDownloads++;
        else stats.photoDownloads++;
      }
      stats.lastUpdated = new Date().toISOString();
      stats.recentActivities = minimizeActivities([
        {
          id: crypto.randomUUID(),
          type,
          success,
          title: activityTitle(type),
          timestamp: attemptTimestamp || stats.lastUpdated,
        },
        ...stats.recentActivities,
      ]);
    });
  } catch {
    console.error("Unable to persist request statistics");
  }
}

export async function verifyAdminCredentials(username: string, password: string) {
  secret();
  if (username !== "admin" || password === "Admin@Reelser2026!" || password.length > 1024) return false;
  return change((data) => credentialsMatch(data, password));
}

async function credentialsMatch(data: AdminData, password: string) {
  if (!data.password_hash) {
    const initial = process.env.REELSER_ADMIN_PASS;
    if (!initial || initial.length < 16 || initial === "Admin@Reelser2026!") {
      throw new Error("Administration disabled: configure REELSER_ADMIN_PASS (16+ characters)");
    }
    data.salt = crypto.randomBytes(16).toString("hex");
    data.iterations = 210000;
    data.password_hash = await hashPassword(initial, data.salt, data.iterations);
  }
  const actual = await hashPassword(password, data.salt, data.iterations ?? 10000);
  return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(data.password_hash, "hex"));
}

// Verification and session issuance share a transaction, so a concurrent
// password change cannot grant a fresh session to the previous password.
export async function authenticateAdmin(username: string, password: string) {
  secret();
  if (username !== "admin" || password === "Admin@Reelser2026!" || password.length > 1024) return null;
  return change(async (data) => {
    if (!(await credentialsMatch(data, password))) return null;
    return issueSession(data);
  });
}

export async function updateAdminPassword(password: string) {
  secret();
  if (typeof password !== "string" || password.length < 16 || password.length > 1024) return false;
  return change(async (data) => {
    data.salt = crypto.randomBytes(16).toString("hex");
    data.iterations = 210000;
    data.password_hash = await hashPassword(password, data.salt, data.iterations);
    data.sessions = {};
    return true;
  });
}

function sessionHash(token: string) {
  return crypto.createHmac("sha256", secret()).update(token).digest("hex");
}
export async function createAdminToken() {
  secret();
  return change(issueSession);
}

function issueSession(data: AdminData) {
  const token = crypto.randomBytes(32).toString("base64url");
  const hash = sessionHash(token);
  data.sessions = Object.fromEntries(
    Object.entries(data.sessions!)
      .filter(([, exp]) => exp > Date.now())
      .slice(-19)
  );
  data.sessions[hash] = Date.now() + 86400_000;
  return token;
}
export async function verifyAdminToken(token: string) {
  try {
    if (!/^[\w-]{43}$/.test(token)) return false;
    const hash = sessionHash(token);
    const exp = (await snapshot()).sessions![hash];
    return Number.isFinite(exp) && exp > Date.now();
  } catch {
    return false;
  }
}
export async function revokeAdminToken(token: string) {
  const hash = sessionHash(token);
  await change((data) => {
    delete data.sessions![hash];
  });
}
