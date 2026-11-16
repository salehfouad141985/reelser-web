import { NextRequest, NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/adminStore";
import { assertSameOrigin, clientKey, errorResponse, rateLimit, readJson, RequestError } from "@/lib/requestPolicy";
export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req);
    const client = clientKey(req);
    // Without a verified visitor IP every visitor shares the "shared" key, so a
    // per-client limit of 5 would let anyone lock the administrator out. In that
    // case only the global ceiling applies; configure REELSER_TRUSTED_IP_HEADER.
    if (client !== "shared") await rateLimit(`login:${client}`, 5, 15 * 60_000);
    await rateLimit("login:global", 30, 15 * 60_000);
    const { username, password } = await readJson(req, 4096);
    if (typeof username !== "string" || typeof password !== "string" || password.length > 1024) throw new RequestError("Invalid credentials");
    const token = await authenticateAdmin(username, password);
    if (!token) throw new RequestError("بيانات الدخول غير صحيحة", 401);
    const response = NextResponse.json({ success: true, message: "تم تسجيل الدخول بنجاح" });
    response.cookies.set("reelser_admin_session", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production" || req.nextUrl.protocol === "https:",
      sameSite: "strict", maxAge: 86400, path: "/",
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) { return errorResponse(error); }
}
