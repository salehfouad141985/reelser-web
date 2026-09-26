import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, getAdminSettings, getAdminStats } from "@/lib/adminStore";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("reelser_admin_session")?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  const settings = getAdminSettings();
  const stats = getAdminStats();

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
    },
  });
}
