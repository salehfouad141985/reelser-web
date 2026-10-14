import { NextRequest } from "next/server";
import { EXTRACTION_CONCURRENCY, acquireLease, assertSameOrigin, errorResponse, readJson, RequestError, servicePolicy } from "@/lib/requestPolicy";
import { authorizePage, getSourcePage, sourceEnabled, validateProfileQuery } from "@/lib/selfHostedSource";

export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  let release: (() => Promise<void>) | undefined;
  try {
    assertSameOrigin(req);
    await servicePolicy(req, "extract");
    if (!sourceEnabled()) throw new RequestError("Profile pagination is unavailable", 503);
    const body = await readJson(req, 8192);
    const { username, section, cursor } = validateProfileQuery(body.username, body.section, body.cursor);
    release = await acquireLease("extract", EXTRACTION_CONCURRENCY);
    const signal = AbortSignal.any([req.signal, AbortSignal.timeout(25000)]);
    const page = await getSourcePage(username, section, signal, cursor);
    signal.throwIfAborted();
    return Response.json({ success: true, data: await authorizePage(username, section, page) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return errorResponse(error); }
  finally { await release?.(); }
}
