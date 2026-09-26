import { NextRequest } from "next/server";
import { extractInstagramMedia, extractInstagramUsername, isValidInstagramUrl } from "@/lib/instagramExtractor";
import { recordExtractionStat } from "@/lib/adminStore";
import { authorizeMedia } from "@/lib/mediaTickets";
import { acquireLease, errorResponse, readJson, RequestError, servicePolicy } from "@/lib/requestPolicy";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  let release: (() => void) | undefined;
  try {
    servicePolicy(req, "extract");
    const body = await readJson(req, 4096);
    if (typeof body.url !== "string" || body.url.length > 2048 || !isValidInstagramUrl(body.url)) {
      throw new RequestError("Please enter a valid Instagram URL or @username / أدخل رابط إنستغرام أو اسم حساب صالح");
    }
    release = acquireLease("extract", 4);
    const username = extractInstagramUsername(body.url);
    const input = body.tab === "story" && username ? `https://www.instagram.com/stories/${username}/` : body.url;
    const signal = AbortSignal.any([req.signal, AbortSignal.timeout(25000)]);
    const result = await extractInstagramMedia(input, signal);
    signal.throwIfAborted();
    if (!result || !result.formats.length) throw new RequestError("No public media could be retrieved. Try again later. / تعذّر جلب وسائط عامة، حاول لاحقاً", 422);
    const data = authorizeMedia(result);
    if (!data.formats.length) throw new RequestError("The media source is not supported", 422);
    recordExtractionStat(true);
    return Response.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    recordExtractionStat(false);
    return errorResponse(error);
  } finally { release?.(); }
}
