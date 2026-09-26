export async function saveMedia(url: string, filename: string) {
  if (!url.startsWith("/api/download?ticket=")) throw new Error("Media is unavailable");
  const response = await fetch(url, { signal: AbortSignal.timeout(65000), cache: "no-store" });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Download failed. Try extracting the link again.");
  }
  const blob = await response.blob();
  if (!blob.size) throw new Error("Empty media file");
  const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "video/mp4": "mp4", "audio/mpeg": "mp3" } as Record<string, string>)[blob.type];
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = `${filename.replace(/\.[a-z0-9]+$/i, "")}.${extension || "bin"}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
