import type { MediaResult } from "./instagramExtractor";

type ExtractResponse = {
  success?: boolean;
  data?: MediaResult;
  error?: string;
};

export async function requestExtract(
  url: string,
  tab: string,
  fallbackMessage: string,
  request: typeof fetch = fetch,
): Promise<MediaResult> {
  for (let attempt = 0; attempt < 2; attempt++) {
    let response: Response;
    try {
      response = await request("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ url, tab }),
        cache: "no-store",
      });
    } catch {
      if (attempt === 0) continue;
      throw new Error(fallbackMessage);
    }

    let body: ExtractResponse;
    try {
      body = await response.json();
    } catch {
      if (attempt === 0) continue;
      throw new Error(fallbackMessage);
    }

    if (!body || typeof body !== "object") {
      if (attempt === 0) continue;
      throw new Error(fallbackMessage);
    }
    if (!response.ok || body.success !== true) {
      throw new Error(typeof body.error === "string" && body.error ? body.error : fallbackMessage);
    }
    if (!body.data || typeof body.data !== "object") {
      if (attempt === 0) continue;
      throw new Error(fallbackMessage);
    }
    return body.data;
  }
  throw new Error(fallbackMessage);
}
