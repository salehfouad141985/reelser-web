import { NextRequest } from "next/server";
import { acquireLease, assertSameOrigin, errorResponse, readJson, RequestError, servicePolicy } from "@/lib/requestPolicy";
import { authorizePage, getSourcePage, sourceEnabled, validateProfileQuery } from "@/lib/selfHostedSource";

export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  let release: (() => void) | undefined;
  try {
    assertSameOrigin(req);
    servicePolicy(req, "extract");
    if (!sourceEnabled()) throw new RequestError("Profile pagination is unavailable", 503);
    const body = await readJson(req, 8192);
    const { username, section, cursor } = validateProfileQuery(body.username, body.section, body.cursor);
    release = acquireLease("extract", 4);
    const signal = AbortSignal.any([req.signal, AbortSignal.timeout(25000)]);
    const page = await getSourcePage(username, section, signal, cursor);
    signal.throwIfAborted();
    return Response.json({ success: true, data: authorizePage(username, section, page) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return errorResponse(error); }
  finally { release?.(); }
}
