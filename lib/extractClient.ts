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
  wait: (ms: number) => Promise<void> = ms => new Promise(resolve => setTimeout(resolve, ms)),
): Promise<MediaResult> {
  const retry = async (attempt: number) => {
    if (attempt === 2) return false;
    await wait(attempt === 0 ? 750 : 1500);
    return true;
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    let response: Response;
    try {
      response = await request("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ url, tab }),
        cache: "no-store",
      });
    } catch {
      if (await retry(attempt)) continue;
      throw new Error(fallbackMessage);
    }

    let body: ExtractResponse;
    try {
      body = await response.json();
    } catch {
      if (response.status === 429) throw new Error("Too many requests. Try again later.");
      if ((response.ok || response.status >= 500 || response.status === 408) && await retry(attempt)) continue;
      throw new Error(`${fallbackMessage} (HTTP ${response.status})`);
    }

    if (!body || typeof body !== "object") {
      if ((response.ok || response.status >= 500 || response.status === 408) && await retry(attempt)) continue;
      throw new Error(`${fallbackMessage} (HTTP ${response.status})`);
    }
    if (!response.ok || body.success !== true) {
      throw new Error(typeof body.error === "string" && body.error ? body.error : fallbackMessage);
    }
    if (!body.data || typeof body.data !== "object") {
      if (await retry(attempt)) continue;
      throw new Error(fallbackMessage);
    }
    return body.data;
  }
  throw new Error(fallbackMessage);
}
