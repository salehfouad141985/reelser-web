import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "تم تسجيل الخروج" });
  response.cookies.delete("reelser_admin_session");
  return response;
}
