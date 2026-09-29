import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, updateAdminSettings, updateAdminPassword, type AdminSettings } from "@/lib/adminStore";
import { assertSameOrigin, errorResponse, readJson, RequestError } from "@/lib/requestPolicy";

function containsDangerousBannerMarkup(html: string): boolean {
  const lower = html.toLowerCase();
  if (/<\s*script\b/i.test(html)) return true;
  if (/\bon\w+\s*=/i.test(html)) return true;
  if (/javascript\s*:/i.test(lower)) return true;
  if (/data\s*:\s*text\/html/i.test(lower)) return true;
  if (/<\s*iframe\b[^>]*\bsrc\s*=\s*["'][^"']*javascript:/i.test(lower)) return true;
  if (/<\s*object\b/i.test(html) || /<\s*embed\b/i.test(html)) return true;
  return false;
}
export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req);
    const token = req.cookies.get("reelser_admin_session")?.value;
    if (!token || !verifyAdminToken(token)) throw new RequestError("غير مصرح", 401);
    const body = await readJson(req);
    if (body.action === "change_password") {
      if (typeof body.newPassword !== "string" || !updateAdminPassword(body.newPassword)) throw new RequestError("كلمة المرور يجب أن تكون بين 16 و1024 حرفاً");
      const response = NextResponse.json({ success: true, message: "تم تغيير كلمة المرور. سجّل الدخول مجدداً." });
      response.cookies.delete("reelser_admin_session");
      return response;
    }
    const update: Partial<AdminSettings> = {};
    for (const key of ["maintenance_mode", "ad_top_banner_enabled", "ad_results_banner_enabled", "ad_bottom_banner_enabled"] as const) {
      if (key in body) { if (typeof body[key] !== "boolean") throw new RequestError("Invalid setting"); update[key] = body[key]; }
    }
    for (const key of ["ad_top_banner_code", "ad_results_banner_code", "ad_bottom_banner_code"] as const) {
      if (key in body) {
        if (typeof body[key] !== "string" || body[key].length > 8000) throw new RequestError("Invalid banner");
        if (containsDangerousBannerMarkup(body[key])) throw new RequestError("Banner contains disallowed markup or protocol");
        update[key] = body[key];
      }
    }
    if ("max_downloads_per_ip_hour" in body) {
      const value = body.max_downloads_per_ip_hour;
      if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 600) throw new RequestError("Download limit must be between 1 and 600");
      update.max_downloads_per_ip_hour = value;
    }
    const settings = updateAdminSettings(update);
    return NextResponse.json({ success: true, message: "تم حفظ الإعدادات", settings });
  } catch (error) { return errorResponse(error); }
}
