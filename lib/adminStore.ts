import fs from "fs";
import path from "path";
import crypto from "crypto";

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
  lastUpdated: string;
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
  totalExtractions: 142,
  successfulExtractions: 139,
  failedExtractions: 3,
  lastUpdated: new Date().toISOString(),
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
    return JSON.parse(content);
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

export function recordExtractionStat(success: boolean) {
  const data = loadData();
  data.stats.totalExtractions += 1;
  if (success) {
    data.stats.successfulExtractions += 1;
  } else {
    data.stats.failedExtractions += 1;
  }
  data.stats.lastUpdated = new Date().toISOString();
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
      exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
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
      return false; // expired
    }
    return data.user === "admin";
  } catch {
    return false;
  }
}
