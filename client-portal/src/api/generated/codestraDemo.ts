/*
 * Generated-client foundation for the versioned Codestra Demo contract.
 * Keep operation paths in this module; regenerate from
 * contracts/openapi/codestra-demo-v1.yaml when the contract changes.
 */
import { getApiUrl } from "utils/env";

export type DemoWallet = {
  available: string;
  reserved: string;
  currency?: string;
};

export type DemoConfig = Record<string, unknown>;

export type ApiFailure = {
  detail?: string;
  code?: string;
  [key: string]: unknown;
};

export class CodestraApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "CodestraApiError";
  }
}

type RequestOptions = Omit<RequestInit, "headers"> & {
  token?: string;
  idempotencyKey?: string;
  timeoutMs?: number;
};

export async function codestraRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), options.timeoutMs ?? 15_000);
  const requestId = crypto.randomUUID();
  try {
    const response = await fetch(getApiUrl(path), {
      ...options,
      credentials: "include",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(options.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : {}),
        "X-Request-ID": requestId,
      },
    });
    const payload = (await response.json().catch(() => ({}))) as ApiFailure;
    if (!response.ok) {
      throw new CodestraApiError(
        String(payload.detail ?? payload.code ?? "The request could not be completed"),
        response.status,
        payload.code,
        response.headers.get("X-Request-ID") ?? requestId,
      );
    }
    return payload as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new CodestraApiError("The request timed out. Please try again.", 408, "REQUEST_TIMEOUT", requestId);
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export const codestraDemoApi = {
  wallet: (token: string) => codestraRequest<DemoWallet>("v1/demo/wallet", { token }),
  config: (token: string) => codestraRequest<DemoConfig>("v1/demo/config", { token }),
  refill: (token: string, idempotencyKey = crypto.randomUUID()) =>
    codestraRequest<DemoWallet>("v1/demo/wallet/refill", { method: "POST", token, idempotencyKey }),
};

export const codestraUserApi = {
  notifications: (token: string) => codestraRequest("notification/notifications/", { token }),
  toggleNotification: (token: string, body: unknown) =>
    codestraRequest("notification/toggle_notification/", { method: "PUT", token, body: JSON.stringify(body) }),
};

export const codestraWalletApi = {
  wallets: (token: string) => codestraRequest("wallet/wallets/", { token }),
  transaction: (token: string, id: string) => codestraRequest(`wallet/transactions/${id}/`, { token }),
  refillLegacy: (token: string, id: string | number) => codestraRequest(`wallet/wallets/${id}/refill/`, { token }),
};

export const codestraAuthApi = {
  login: <T>(body: unknown) => codestraRequest<T>("user/token/", { method: "POST", body: JSON.stringify(body) }),
  register: <T>(body: unknown) => codestraRequest<T>("user/create/", { method: "POST", body: JSON.stringify(body) }),
  logout: (token: string, refresh: string) => codestraRequest<void>("user/token/logout/", { method: "POST", token, body: JSON.stringify({ refresh }) }),
};

export const codestraProfileApi = {
  profile: (token: string) => codestraRequest("user/me/", { token }),
  update: (token: string, body: FormData | Record<string, unknown>) => codestraRequest("user/me/", { method: "PATCH", token, body: body instanceof FormData ? body : JSON.stringify(body) }),
  changePassword: (token: string, body: unknown) => codestraRequest("user/password_change/", { method: "POST", token, body: JSON.stringify(body) }),
  disableWalkthrough: (token: string) => codestraRequest("user/disable_walkthrough/", { method: "PUT", token }),
};

export const codestraMarketApi = {
  assets: <T = unknown>(token: string, query: Record<string, string | undefined> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => value != null && params.set(key, value));
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return codestraRequest<T>(`assets/${suffix}`, { token });
  },
  clock: <T = unknown>(token: string) => codestraRequest<T>("get-clock/", { token }),
};

export const codestraNewsApi = {
  list: <T = unknown>(token: string, query: Record<string, string | undefined> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => value != null && params.set(key, value));
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return codestraRequest<T>(`news/${suffix}`, { token });
  },
  article: <T = unknown>(token: string, id: string | number) => codestraRequest<T>(`news/${id}/`, { token }),
};
