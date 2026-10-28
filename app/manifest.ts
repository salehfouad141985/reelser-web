import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Reelser - Instagram Reels, Story, Photo & MP3 Downloader",
    short_name: "Reelser",
    description:
      "Fast, free online downloader for public Instagram Reels, Stories, Highlights, Carousel Photos, Profile Pictures (DP), and MP3 Audio.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#833ab4",
    orientation: "portrait-primary",
    categories: ["utilities", "multimedia", "photo", "video"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    share_target: {
      action: "/",
      method: "GET",
      enctype: "application/x-www-form-urlencoded",
      params: {
        title: "title",
        text: "text",
        url: "url",
      },
    },
  };
}
