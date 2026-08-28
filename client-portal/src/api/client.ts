import { getApiUrl } from "utils/env";
import { ApiError } from "api/errors";
export { ApiError } from "api/errors";

export type AuthenticatedRequestOptions = RequestInit & {
  /** Abort requests that would otherwise leave route loaders pending forever. */
  timeoutMs?: number;
  /** Request ID for tracking and debugging */
  requestId?: string;
};

/**
 * Makes authenticated HTTP requests to the API
 * 
 * Features:
 * - Automatic token authentication via Bearer token
 * - Request timeout handling
 * - Request/response ID tracking for debugging
 * - Proper error parsing and conversion
 * - CORS credentials included
 * 
 * @template T - Response data type
 * @param endpoint - API endpoint path (relative)
 * @param token - Authorization token
 * @param init - Request initialization options
 * @returns Parsed response data
 * @throws ApiError on request failure
 * 
 * @example
 * ```typescript
 * const user = await authenticatedRequest<UserProfile>(
 *   "v1/users/profile",
 *   accessToken,
 *   { method: "GET" }
 * );
 * ```
 */
export async function authenticatedRequest<T>(
  endpoint: string,
  token: string,
  init: AuthenticatedRequestOptions = {},
): Promise<T> {
  const { 
    timeoutMs = 15_000, 
    requestId = crypto.randomUUID(), 
    signal: callerSignal, 
    ...requestInit 
  } = init;

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

    // Parse response - fallback to empty object if not valid JSON
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Try to extract error code from response
      const canonical = 
        payload.error && typeof payload.error === "object" 
          ? payload.error 
          : payload;
      
      throw new ApiError(
        response.status,
        canonical.code,
        response.headers.get("X-Request-ID") || requestId,
      );
    }

    return payload as T;
  } catch (error) {
    // Handle specific error types
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(408, "REQUEST_TIMEOUT", requestId);
    }
    
    if (error instanceof TypeError) {
      // Network or parsing errors
      throw new ApiError(0, "NETWORK_ERROR", requestId);
    }

    // Re-throw ApiError as-is, convert others
    if (error instanceof ApiError) {
      throw error;
    }

    // Unknown error type
    throw new ApiError(500, "UNKNOWN_ERROR", requestId);
  } finally {
    // Cleanup
    window.clearTimeout(timeout);
    callerSignal?.removeEventListener("abort", abortFromCaller);
  }
}

