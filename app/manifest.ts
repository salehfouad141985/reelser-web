import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Reelser - Instagram Reels & Video Downloader",
    short_name: "Reelser",
    description: "Download Instagram Reels, Videos, Stories, and Photos in Full HD 1080p.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#833ab4",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
