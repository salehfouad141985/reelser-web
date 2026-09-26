import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("u") || "dalia.ammar0";
  try {
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
    });

    const text = await res.text();
    return NextResponse.json({
      status: res.status,
      ok: res.ok,
      redirected: res.redirected,
      url: res.url,
      hasOgImage: text.includes("og:image"),
      hasOgTitle: text.includes("og:title"),
      textSnippet: text.slice(0, 1000),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
