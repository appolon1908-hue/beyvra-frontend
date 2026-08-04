import { getApiUrl } from "utils/env";

export class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string, readonly requestId?: string) {
    super(message);
    this.name = "ApiError";
  }
}

export type AuthenticatedRequestOptions = RequestInit & {
  /** Abort requests that would otherwise leave route loaders pending forever. */
  timeoutMs?: number;
  requestId?: string;
};

export async function authenticatedRequest<T>(
  endpoint: string,
  token: string,
  init: AuthenticatedRequestOptions = {},
): Promise<T> {
  const { timeoutMs = 15_000, requestId = crypto.randomUUID(), signal: callerSignal, ...requestInit } = init;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  const abortFromCaller = () => controller.abort();
  callerSignal?.addEventListener("abort", abortFromCaller, { once: true });
  try {
    const response = await fetch(getApiUrl(endpoint), {
      ...requestInit,
      credentials: "include",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(requestInit.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "X-Request-ID": requestId,
        ...requestInit.headers,
      },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new ApiError(
        payload.detail || payload.error || "The request could not be completed",
        response.status,
        payload.code,
        response.headers.get("X-Request-ID") || requestId,
      );
    }
    return payload as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("The request timed out. Please try again.", 408, "REQUEST_TIMEOUT", requestId);
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
    callerSignal?.removeEventListener("abort", abortFromCaller);
  }
}
