import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, getAdminSettings, getAdminStats } from "@/lib/adminStore";
import sitemap from "@/app/sitemap";

export async function GET(req: NextRequest) {
  try {
  const token = req.cookies.get("reelser_admin_session")?.value;
  if (!token || !await verifyAdminToken(token)) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  const settings = await getAdminSettings();
  const stats = await getAdminStats();

  return NextResponse.json({
    success: true,
    user: { username: "admin", role: "SUPER_ADMIN" },
    settings,
    stats,
    system: {
      platform: "Instagram (Reelser.com)",
      nodeVersion: process.version,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      indexedPages: sitemap().length,
    },
  }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ success: false, error: "Storage unavailable" }, { status: 503 }); }
}
