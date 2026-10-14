import crypto from "node:crypto";

export type SourceProvider = "snapsave" | "instagram" | "profileViewer";
export type SourceStage = "request" | "transport" | "http" | "body" | "encoding" | "decode" | "html" | "media" | "metadata";
export type SourceReason = "network_failure" | "http_status" | "missing_body" | "response_too_large" | "body_read_failed" |
  "encoding_missing" | "html_missing" | "no_media" | "parse_failed" | "timeout" | "cancelled";

// Preserve diagnostic facts without retaining URLs, response bodies or headers.
export class SourceFetchError extends Error {
  constructor(public stage: SourceStage, public reason: SourceReason, public httpStatus?: number, cause?: unknown) {
    super("Source unavailable", { cause });
  }
}

const ERROR_TYPES = new Set(["Error", "TypeError", "RangeError", "SyntaxError", "TimeoutError", "AbortError"]);
const NETWORK_CODES = new Set(["ENOTFOUND", "EAI_AGAIN", "ETIMEDOUT", "ECONNRESET", "ECONNREFUSED", "EHOSTUNREACH",
  "ENETUNREACH", "EPIPE", "UND_ERR_CONNECT_TIMEOUT", "UND_ERR_HEADERS_TIMEOUT", "UND_ERR_BODY_TIMEOUT",
  "UND_ERR_SOCKET", "CERT_HAS_EXPIRED", "DEPTH_ZERO_SELF_SIGNED_CERT", "ERR_TLS_CERT_ALTNAME_INVALID"]);

export function diagnosticErrorFacts(cause: unknown, signal?: AbortSignal) {
    const name = cause instanceof Error ? cause.name : "Error";
    const abortName = signal?.aborted && signal.reason instanceof Error ? signal.reason.name : undefined;
    const errorType = ERROR_TYPES.has(abortName ?? name) ? abortName ?? name : "Error";
    let networkCode: string | undefined;
    let current: unknown = cause;
    for (let depth = 0; depth < 3 && current && typeof current === "object"; depth++) {
      const item = current as { code?: unknown; cause?: unknown };
      if (typeof item.code === "string" && NETWORK_CODES.has(item.code)) { networkCode = item.code; break; }
      current = item.cause;
    }
    return { errorType, ...(networkCode ? { networkCode } : {}) };
}

export function sourceAttempt(provider: SourceProvider) {
  const started = performance.now();
  const operationId = crypto.randomUUID();
  return (stage: SourceStage, reason: SourceReason, error?: unknown, httpStatus?: number, signal?: AbortSignal) => {
    const facts = error instanceof SourceFetchError ? error : undefined;
    const errorFacts = diagnosticErrorFacts(facts?.cause ?? error, signal);
    const errorType = errorFacts.errorType;
    const status = facts?.httpStatus ?? httpStatus;
    const event = {
      event: "source_failure", timestamp: new Date().toISOString(), operationId, provider,
      stage: facts?.stage ?? stage,
      reason: errorType === "TimeoutError" ? "timeout" : signal?.aborted || errorType === "AbortError" ? "cancelled" : facts?.reason ?? reason,
      elapsedMs: Math.max(0, Math.round(performance.now() - started)),
      ...(status !== undefined && Number.isInteger(status) && status >= 100 && status <= 599 ? { httpStatus: status } : {}),
      ...errorFacts,
    };
    // Emit one JSON line, including expected source failures that used to be silent.
    // Cancellation is informational; it may simply mean the user cleared a search.
    if (event.reason === "cancelled") console.info(JSON.stringify(event));
    else console.warn(JSON.stringify(event));
  };
}
