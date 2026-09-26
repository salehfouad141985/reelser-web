import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const rawUrl = searchParams.get("url");

  if (!rawUrl || !rawUrl.startsWith("http")) {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  try {
    const upstreamUrl = decodeURIComponent(rawUrl);
    const domain = new URL(upstreamUrl).hostname;

    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    };

    if (domain.includes("iqsaved.com")) {
      headers["Referer"] = "https://insta-stories-viewer.com/";
    } else if (domain.includes("cdninstagram.com") || domain.includes("instagram.com")) {
      headers["Referer"] = "https://www.instagram.com/";
    }

    const upstreamRes = await fetch(upstreamUrl, {
      headers,
      signal: AbortSignal.timeout(10000),
    });

    if (!upstreamRes.ok) {
      return new NextResponse(`Upstream failed: ${upstreamRes.status}`, {
        status: upstreamRes.status,
      });
    }

    const contentType = upstreamRes.headers.get("content-type") || "image/jpeg";
    const cacheControl =
      upstreamRes.headers.get("cache-control") ||
      "public, max-age=86400, stale-while-revalidate=604800";

    const responseHeaders = new Headers({
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
      "Access-Control-Allow-Origin": "*",
    });

    return new NextResponse(upstreamRes.body, {
      status: 200,
      headers: responseHeaders,
    });
  } catch (err: any) {
    console.error("Proxy error:", err?.message || err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
