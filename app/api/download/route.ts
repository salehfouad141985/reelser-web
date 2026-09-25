import { NextRequest, NextResponse } from "next/server";
import { Readable, Transform } from "node:stream";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const url = searchParams.get("url");
    const rawTitle = searchParams.get("title") || "Instagram_Reelser";
    const ext = (searchParams.get("ext") || "mp4").replace(/[^a-z0-9]/gi, "").toLowerCase();

    if (!url || !url.startsWith("http")) {
      return new NextResponse("Invalid URL parameter", { status: 400 });
    }

    const cleanTitle = rawTitle.replace(/[\x00-\x1f\x7f/\\?%*:|"<>]/g, "_").slice(0, 100);
    const filename = `${cleanTitle}.${ext}`;

    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Accept: "*/*",
      "Accept-Encoding": "identity",
    };

    const range = req.headers.get("range");
    if (range) {
      headers["Range"] = range;
    }

    const upstreamRes = await fetch(url, {
      headers,
      signal: req.signal,
    });

    if (!upstreamRes.ok && upstreamRes.status !== 206) {
      return new NextResponse(`Upstream media fetch failed with status ${upstreamRes.status}`, {
        status: upstreamRes.status,
      });
    }

    let contentType = upstreamRes.headers.get("content-type") || "";
    if (!contentType || contentType.includes("octet-stream") || contentType.includes("text/html")) {
      if (ext === "mp4") contentType = "video/mp4";
      else if (ext === "mp3") contentType = "audio/mpeg";
      else if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg";
      else contentType = "application/octet-stream";
    }

    const responseHeaders = new Headers({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-cache, no-store, must-revalidate",
    });

    const contentLength = upstreamRes.headers.get("content-length");
    if (contentLength) responseHeaders.set("Content-Length", contentLength);

    const contentRange = upstreamRes.headers.get("content-range");
    if (contentRange) responseHeaders.set("Content-Range", contentRange);

    if (!upstreamRes.body) {
      return new NextResponse("Empty response body from media source", { status: 502 });
    }

    return new NextResponse(upstreamRes.body as any, {
      status: upstreamRes.status === 206 ? 206 : 200,
      headers: responseHeaders,
    });
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return new NextResponse(null, { status: 499 });
    }
    console.error("Download proxy error:", err);
    return new NextResponse("Error downloading media", { status: 500 });
  }
}
