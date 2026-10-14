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
  signal?: AbortSignal,
): Promise<MediaResult> {
  const operation = signal ? AbortSignal.any([signal, AbortSignal.timeout(90000)]) : AbortSignal.timeout(90000);
  const checkCancelled = () => operation.throwIfAborted();
  const retry = async (attempt: number) => {
    checkCancelled();
    if (attempt === 2) return false;
    await withCancellation(wait(attempt === 0 ? 750 : 1500), operation);
    return true;
  };

  for (let attempt = 0; attempt < 3; attempt++) {
    checkCancelled();
    const attemptSignal = AbortSignal.any([operation, AbortSignal.timeout(30000)]);
    let response: Response;
    try {
      response = await withCancellation(request("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ url, tab }),
        cache: "no-store",
        signal: attemptSignal,
      }), attemptSignal);
    } catch {
      if (await retry(attempt)) continue;
      throw new Error(fallbackMessage);
    }

    let body: ExtractResponse;
    try {
      body = await withCancellation(response.json(), attemptSignal);
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
    checkCancelled();
    return body.data;
  }
  throw new Error(fallbackMessage);
}

// Bound waits and injected requests too, even if their implementation ignores
// AbortSignal. Remove listeners on every completion to avoid accumulating them.
function withCancellation<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason);
    signal.addEventListener("abort", abort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
    if (signal.aborted) abort();
  });
}
