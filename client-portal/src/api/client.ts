import { getApiUrl } from "utils/env";
import { ApiError } from "api/errors";
import { getCookie } from "utils/getCookie";
export { ApiError } from "api/errors";

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
  const unsafe = !["GET", "HEAD", "OPTIONS"].includes((requestInit.method ?? "GET").toUpperCase());
  const bearerToken = token.includes(".") ? token : "";
  callerSignal?.addEventListener("abort", abortFromCaller, { once: true });
  try {
    const response = await fetch(getApiUrl(endpoint), {
      ...requestInit,
      credentials: "include",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(requestInit.body ? { "Content-Type": "application/json" } : {}),
        ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
        ...(unsafe && getCookie("csrftoken") ? { "X-CSRFToken": getCookie("csrftoken")! } : {}),
        "X-Request-ID": requestId,
        ...requestInit.headers,
      },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const canonical = payload.error && typeof payload.error === "object" ? payload.error : payload;
      throw new ApiError(
        response.status,
        canonical.code,
        response.headers.get("X-Request-ID") || requestId,
      );
    }
    return payload as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(408, "REQUEST_TIMEOUT", requestId);
    }
    if (error instanceof TypeError) {
      throw new ApiError(0, "NETWORK_ERROR", requestId);
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
    callerSignal?.removeEventListener("abort", abortFromCaller);
  }
}
