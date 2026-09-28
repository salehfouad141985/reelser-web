export async function saveMedia(url: string, filename: string) {
  if (!url.startsWith("/api/download?ticket=")) throw new Error("Media is unavailable");
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(65000), cache: "no-store" });
  } catch {
    throw new Error("Download failed. Try again.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body?.error === "string" && body.error ? body.error : "Download failed. Try again.");
  }
  const blob = await response.blob().catch(() => { throw new Error("Download failed. Try again."); });
  if (!blob.size) throw new Error("Download failed. Try again.");
  const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "video/mp4": "mp4", "audio/mpeg": "mp3" } as Record<string, string>)[blob.type.split(";")[0].trim().toLowerCase()];
  if (!extension) throw new Error("Download failed. Try again.");
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = `${filename.replace(/\.[a-z0-9]+$/i, "")}.${extension}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
