import { NextRequest, NextResponse } from "next/server";
import { extractInstagramMedia, isValidInstagramUrl } from "@/lib/instagramExtractor";
import { recordExtractionStat } from "@/lib/adminStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = body?.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter a valid Instagram URL / الرجاء إدخال رابط إنستغرام صالح" },
        { status: 400 }
      );
    }

    if (!isValidInstagramUrl(url)) {
      recordExtractionStat(false, "رابط غير صالح");
      return NextResponse.json(
        {
          success: false,
          error: "The provided URL is not a recognized Instagram link. Please paste a link from Reels, Stories, or Posts.",
        },
        { status: 400 }
      );
    }

    const result = await extractInstagramMedia(url);

    if (!result || result.formats.length === 0) {
      recordExtractionStat(false, "فشل استخراج الرابط");
      return NextResponse.json(
        {
          success: false,
          error: "Unable to extract media from this Instagram link. Make sure the post is public and try again.",
        },
        { status: 422 }
      );
    }

    // Record successful extraction
    recordExtractionStat(true, result.title);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("API extract error:", error);
    recordExtractionStat(false, "خطأ في السيرفر");
    return NextResponse.json(
      { success: false, error: error?.message || "Server error processing request" },
      { status: 500 }
    );
  }
}
