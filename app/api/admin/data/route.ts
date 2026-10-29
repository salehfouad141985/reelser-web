import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, getAdminSettings, getAdminStats, getActiveAdminSessionsCount } from "@/lib/adminStore";
import { readSnapshot } from "@/lib/storage";
import sitemap from "@/app/sitemap";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("reelser_admin_session")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const [settings, stats, activeSessionsCount, rateLimitsStore] = await Promise.all([
      getAdminSettings(),
      getAdminStats(),
      getActiveAdminSessionsCount(),
      readSnapshot<Record<string, number[]>>("rate-limits", () => ({})),
    ]);

    const mem = process.memoryUsage();
    const allSitemapEntries = sitemap();
    const hourAgo = Date.now() - 3_600_000;
    const activeRateLimitIps = Object.values(rateLimitsStore || {}).filter(
      (timestamps) => Array.isArray(timestamps) && timestamps.some((t) => t > hourAgo)
    ).length;

    return NextResponse.json(
      {
        success: true,
        user: { username: "admin", role: "SUPER_ADMIN" },
        settings,
        stats,
        system: {
          platform: "Instagram (Reelser.com)",
          nodeVersion: process.version,
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          indexedPages: allSitemapEntries.length,
          memoryRssMB: Math.round(mem.rss / 1024 / 1024),
          memoryHeapMB: Math.round(mem.heapUsed / 1024 / 1024),
          activeSessionsCount,
          activeRateLimitIps,
          selfHostedConfigured: Boolean(process.env.INSTAGRAM_SOURCE_URL),
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json({ success: false, error: "Storage unavailable" }, { status: 503 });
  }
}
