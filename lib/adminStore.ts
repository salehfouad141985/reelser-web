import fs from "fs";
import path from "path";
import crypto from "crypto";

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

interface AdminData {
  password_hash: string;
  salt: string;
  settings: AdminSettings;
  stats: AdminStats;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "admin-config.json");
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "reelser-super-secret-key-2026-secure-jwt";

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

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

function initAdminData(): AdminData {
  const salt = crypto.randomBytes(16).toString("hex");
  const defaultPass = process.env.REELSER_ADMIN_PASS || "Admin@Reelser2026!";
  const password_hash = hashPassword(defaultPass, salt);

  const initialData: AdminData = {
    password_hash,
    salt,
    settings: { ...DEFAULT_SETTINGS },
    stats: { ...DEFAULT_STATS },
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing initial admin data:", err);
  }

  return initialData;
}

function loadData(): AdminData {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return initAdminData();
    }
    const content = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(content);

    // Ensure all stat fields exist
    parsed.stats = {
      ...DEFAULT_STATS,
      ...(parsed.stats || {}),
      recentActivities: parsed.stats?.recentActivities || [],
    };
    return parsed;
  } catch {
    return initAdminData();
  }
}

function saveData(data: AdminData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving admin data:", err);
  }
}

export function getAdminSettings(): AdminSettings {
  return loadData().settings;
}

export function updateAdminSettings(partial: Partial<AdminSettings>): AdminSettings {
  const data = loadData();
  data.settings = { ...data.settings, ...partial };
  saveData(data);
  return data.settings;
}

export function getAdminStats(): AdminStats {
  return loadData().stats;
}

export function recordExtractionStat(success: boolean, title?: string) {
  const data = loadData();
  data.stats.totalExtractions += 1;
  if (success) {
    data.stats.successfulExtractions += 1;
  } else {
    data.stats.failedExtractions += 1;
  }
  data.stats.lastUpdated = new Date().toISOString();

  // Add to recent activity
  const newActivity: ActivityItem = {
    id: crypto.randomBytes(4).toString("hex"),
    type: "extract",
    title: title ? title.slice(0, 60) : "استخراج رابط إنستغرام",
    timestamp: new Date().toISOString(),
    success,
  };

  data.stats.recentActivities = [newActivity, ...(data.stats.recentActivities || [])].slice(0, 30);
  saveData(data);
}

export function recordDownloadStat(type: "video" | "audio" | "image", title?: string) {
  const data = loadData();
  data.stats.totalDownloads += 1;
  if (type === "audio") {
    data.stats.audioDownloads += 1;
  } else if (type === "video") {
    data.stats.videoDownloads += 1;
  } else {
    data.stats.photoDownloads += 1;
  }
  data.stats.lastUpdated = new Date().toISOString();

  const newActivity: ActivityItem = {
    id: crypto.randomBytes(4).toString("hex"),
    type,
    title: title ? title.slice(0, 60) : (type === "audio" ? "تحميل صوت MP3" : "تحميل فيديو MP4"),
    timestamp: new Date().toISOString(),
    success: true,
  };

  data.stats.recentActivities = [newActivity, ...(data.stats.recentActivities || [])].slice(0, 30);
  saveData(data);
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  if (username.trim().toLowerCase() !== "admin") return false;
  const data = loadData();
  const calculated = hashPassword(password, data.salt);
  return crypto.timingSafeEqual(Buffer.from(calculated), Buffer.from(data.password_hash));
}

export function updateAdminPassword(newPassword: string): boolean {
  if (!newPassword || newPassword.length < 6) return false;
  const data = loadData();
  const newSalt = crypto.randomBytes(16).toString("hex");
  data.salt = newSalt;
  data.password_hash = hashPassword(newPassword, newSalt);
  saveData(data);
  return true;
}

export function createAdminToken(): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      user: "admin",
      role: "SUPER_ADMIN",
      exp: Math.floor(Date.now() / 1000) + 86400 * 7,
    })
  ).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");
  return `${header}.${payload}.${signature}`;
}

export function verifyAdminToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [header, payload, signature] = parts;
  const expectedSig = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest("base64url");
  if (signature !== expectedSig) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }
    return data.user === "admin";
  } catch {
    return false;
  }
}
