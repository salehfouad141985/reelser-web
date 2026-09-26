import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminToken,
  updateAdminSettings,
  updateAdminPassword,
} from "@/lib/adminStore";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("reelser_admin_session")?.value;
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Check if updating password
    if (body.action === "change_password") {
      const { newPassword } = body;
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "كلمة المرور يجب أن لا تقل عن 6 أحرف" },
          { status: 400 }
        );
      }
      const updated = updateAdminPassword(newPassword);
      return NextResponse.json({
        success: updated,
        message: updated ? "تم تغيير كلمة المرور بنجاح" : "تعذر تغيير كلمة المرور",
      });
    }

    // Otherwise update settings
    const updatedSettings = updateAdminSettings({
      maintenance_mode: Boolean(body.maintenance_mode),
      ad_top_banner_enabled: Boolean(body.ad_top_banner_enabled),
      ad_top_banner_code: String(body.ad_top_banner_code || ""),
      ad_results_banner_enabled: Boolean(body.ad_results_banner_enabled),
      ad_results_banner_code: String(body.ad_results_banner_code || ""),
      ad_bottom_banner_enabled: Boolean(body.ad_bottom_banner_enabled),
      ad_bottom_banner_code: String(body.ad_bottom_banner_code || ""),
      max_downloads_per_ip_hour: Number(body.max_downloads_per_ip_hour) || 60,
    });

    return NextResponse.json({
      success: true,
      message: "تم حفظ الإعدادات بنجاح",
      settings: updatedSettings,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء حفظ الإعدادات" },
      { status: 500 }
    );
  }
}
