import { getAdminSettings } from "@/lib/adminStore";
export const dynamic = "force-dynamic";
export function GET() {
  try {
    const settings = getAdminSettings();
    return Response.json({ maintenance: settings.maintenance_mode, banners: {
      top: settings.ad_top_banner_enabled ? settings.ad_top_banner_code : "",
      results: settings.ad_results_banner_enabled ? settings.ad_results_banner_code : "",
      bottom: settings.ad_bottom_banner_enabled ? settings.ad_bottom_banner_code : "",
    } }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ maintenance: true, banners: {} }, { status: 503 }); }
}
