import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, createAdminToken } from "@/lib/adminStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "اسم المستخدم وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    const token = createAdminToken();
    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
    });

    response.cookies.set("reelser_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || req.nextUrl.protocol === "https:",
      sameSite: "strict",
      maxAge: 86400 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
