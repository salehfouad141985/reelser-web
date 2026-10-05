import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Reelser - Instagram Reels & Video Downloader";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "72px",
            fontWeight: 900,
            letterSpacing: "-2px",
          }}
        >
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "24px",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            ▶
          </div>
          Reelser
        </div>
        <div style={{ fontSize: "28px", marginTop: "16px", opacity: 0.95, fontWeight: 600 }}>
          Instagram Reels & Video Downloader — source quality
        </div>
        <div style={{ fontSize: "18px", marginTop: "10px", opacity: 0.85 }}>
          reelser.com — Free · No login · HD
        </div>
      </div>
    ),
    { ...size },
  );
}
