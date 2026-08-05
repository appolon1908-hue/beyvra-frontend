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
  create: <T>(token: string, body: unknown) => codestraRequest<T>("wallet/wallets/", { method: "POST", token, body: JSON.stringify(body) }),
  update: <T>(token: string, id: string | number, body: unknown) => codestraRequest<T>(`wallet/wallets/${id}/`, { method: "PUT", token, body: JSON.stringify(body) }),
  archive: <T>(token: string, id: string | number) => codestraRequest<T>(`wallet/${id}/archive/`, { method: "PUT", token }),
  transaction: (token: string, id: string) => codestraRequest(`wallet/transactions/${id}/`, { token }),
  refillLegacy: (token: string, id: string | number) => codestraRequest(`wallet/wallets/${id}/refill/`, { method: "POST", token }),
  tradeAssets: <T>(token: string) => codestraRequest<T>("trades/assets/", { token }),
};

export const codestraAuthApi = {
  login: <T>(body: unknown) => codestraRequest<T>("user/token/", { method: "POST", body: JSON.stringify(body) }),
  register: <T>(body: unknown) => codestraRequest<T>("user/create/", { method: "POST", body: JSON.stringify(body) }),
  logout: (token: string, refresh: string) => codestraRequest<void>("user/token/logout/", { method: "POST", token, body: JSON.stringify({ refresh }) }),
  refresh: <T>(body: unknown) => codestraRequest<T>("user/token/refresh/", { method: "POST", body: JSON.stringify(body) }),
  forgotPassword: <T>(body: unknown) => codestraRequest<T>("user/password_reset/", { method: "POST", body: JSON.stringify(body) }),
  resetPassword: <T>(uidb64: string, token: string, body: unknown) => codestraRequest<T>(`user/password_reset_confirm/${uidb64}/${token}/`, { method: "POST", body: JSON.stringify(body) }),
  verifyEmail: <T>(uidb64: string, token: string) => codestraRequest<T>(`user/verify_email/${uidb64}/${token}/`),
  sendEmailVerification: <T>(token: string, email: string) => codestraRequest<T>("user/send_email_verification/", { method: "POST", token, body: JSON.stringify({ email }) }),
  statistics: <T>(token: string) => codestraRequest<T>("user/trading_statistics/", { token }),
  websocketTicket: <T>(token: string) => codestraRequest<T>("user/websocket_ticket", { token }),
  sendPhoneVerification: <T>(token: string) => codestraRequest<T>("user/send_phone_verification/", { method: "POST", token }),
  verifyPhone: <T>(token: string, body: unknown) => codestraRequest<T>("user/verify_phone/", { method: "POST", token, body: JSON.stringify(body) }),
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

export const codestraPortfolioApi = {
  balance: <T>(token: string) => codestraRequest<T>("portfolio/total-balance/", { token }),
  profitLoss: <T>(token: string) => codestraRequest<T>("portfolio/total-profit-loss/", { token }),
  stockMarket: <T>(token: string) => codestraRequest<T>("portfolio/stock-market-data/", { token }),
  cryptoMarket: <T>(token: string) => codestraRequest<T>("portfolio/crypto-market-data/", { token }),
};
