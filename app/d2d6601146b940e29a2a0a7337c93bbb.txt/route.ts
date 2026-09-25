import { NextResponse } from "next/server";

export const dynamic = "force-static";

export function GET() {
  return new NextResponse("d2d6601146b940e29a2a0a7337c93bbb", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
