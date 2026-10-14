import crypto from "node:crypto";
import { RequestError } from "./requestPolicy";
import { diagnosticErrorFacts } from "./sourceDiagnostics";

export type DownloadStage = "policy" | "ticket" | "lease" | "fetch" | "content" | "convert" | "statistics" | "response";
export type MediaFetchStage = "validation" | "transport" | "http" | "body" | "redirect";
export type MediaFetchReason = "source_blocked" | "network_failure" | "http_status" | "response_too_large" |
  "body_read_failed" | "empty_body" | "invalid_redirect" | "too_many_redirects";

export class MediaFetchError extends RequestError {
  constructor(message: string, status: number, public stage: MediaFetchStage, public reason: MediaFetchReason,
    public httpStatus?: number, cause?: unknown) {
    super(message, status);
    this.cause = cause;
  }
}

export function downloadAttempt() {
  const started = performance.now();
  const operationId = crypto.randomUUID();
  return {
    operationId,
    failure(stage: DownloadStage, error: unknown, signal?: AbortSignal, responseStatus?: number) {
      const facts = diagnosticErrorFacts(error instanceof MediaFetchError ? error.cause ?? error : error, signal);
      const reason = facts.errorType === "TimeoutError" ? "timeout"
        : signal?.aborted || facts.errorType === "AbortError" || error instanceof RequestError && error.status === 499 ? "cancelled"
        : error instanceof MediaFetchError ? error.reason
        : stage === "ticket" ? error instanceof RequestError && error.message === "Media link expired. Extract the link again." ? "ticket_expired_or_missing" : "ticket_rejected"
        : error instanceof RequestError ? "request_rejected" : "operation_failed";
      const event = {
        event: "download_failure", timestamp: new Date().toISOString(), operationId, stage, reason,
        elapsedMs: Math.max(0, Math.round(performance.now() - started)),
        responseStatus: responseStatus ?? (reason === "timeout" ? 504 : signal?.aborted ? 499 : error instanceof RequestError ? error.status : reason === "cancelled" ? 499 : 503),
        ...(error instanceof MediaFetchError ? { sourceStage: error.stage,
          ...(error.httpStatus !== undefined ? { httpStatus: error.httpStatus } : {}) } : {}),
        ...facts,
      };
      if (reason === "cancelled") console.info(JSON.stringify(event));
      else console.warn(JSON.stringify(event));
    },
  };
}
