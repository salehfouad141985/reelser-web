import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken, revokeAdminToken } from "@/lib/adminStore";
import { assertSameOrigin, errorResponse } from "@/lib/requestPolicy";
export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req);
    const token = req.cookies.get("reelser_admin_session")?.value;
    if (token && verifyAdminToken(token)) revokeAdminToken(token);
    const response = NextResponse.json({ success: true, message: "تم تسجيل الخروج" });
    response.cookies.delete("reelser_admin_session");
    return response;
  } catch (error) { return errorResponse(error); }
}
