import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/adminStore";
import sitemap from "@/app/sitemap";

const INDEXNOW_KEY = "d2d6601146b940e29a2a0a7337c93bbb";
const HOST = "reelser.com";
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("reelser_admin_session")?.value;
    if (!token || !(await verifyAdminToken(token))) {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 401 });
    }

    const entries = sitemap();
    const urlList = Array.from(new Set(entries.map((entry) => entry.url).filter(Boolean)));

    const payload = {
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    };

    const endpoints = [
      "https://api.indexnow.org/indexnow",
      "https://www.bing.com/indexnow",
      "https://yandex.com/indexnow",
    ];

    const results: { endpoint: string; status: number; ok: boolean }[] = [];

    await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 10000);
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(payload),
            signal: controller.signal,
          });
          clearTimeout(timer);
          results.push({
            endpoint,
            status: res.status,
            ok: res.status === 200 || res.status === 202,
          });
        } catch {
          results.push({
            endpoint,
            status: 0,
            ok: false,
          });
        }
      })
    );

    const anySucceeded = results.some((r) => r.ok);

    return NextResponse.json(
      {
        success: anySucceeded,
        totalUrls: urlList.length,
        results,
        message: anySucceeded
          ? `تم إرسال ${urlList.length} رابطاً بنجاح إلى محركات البحث (IndexNow / Bing / Yandex)`
          : "تعذر الاتصال ببعض نقاط IndexNow، يرجى المحاولة مرة أخرى.",
      },
      { status: anySucceeded ? 200 : 502, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء إرسال روابط IndexNow" },
      { status: 500 }
    );
  }
}
