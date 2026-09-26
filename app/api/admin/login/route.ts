import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, createAdminToken } from "@/lib/adminStore";
import { assertSameOrigin, clientKey, errorResponse, rateLimit, readJson, RequestError } from "@/lib/requestPolicy";
export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req);
    rateLimit(`login:${clientKey(req)}`, 5, 15 * 60_000);
    rateLimit("login:global", 30, 15 * 60_000);
    const { username, password } = await readJson(req, 4096);
    if (typeof username !== "string" || typeof password !== "string" || password.length > 1024) throw new RequestError("Invalid credentials");
    if (!verifyAdminCredentials(username, password)) throw new RequestError("بيانات الدخول غير صحيحة", 401);
    const response = NextResponse.json({ success: true, message: "تم تسجيل الدخول بنجاح" });
    response.cookies.set("reelser_admin_session", createAdminToken(), {
      httpOnly: true, secure: process.env.NODE_ENV === "production" || req.nextUrl.protocol === "https:",
      sameSite: "strict", maxAge: 86400, path: "/",
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) { return errorResponse(error); }
}
