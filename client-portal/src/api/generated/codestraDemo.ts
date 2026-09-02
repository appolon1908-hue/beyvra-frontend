/*
 * Generated-client foundation for the versioned Codestra Demo contract.
 * Keep operation paths in this module; regenerate from
 * contracts/openapi/codestra-demo-v1.yaml when the contract changes.
 */
import { getApiUrl } from "utils/env";
import { ApiError } from "api/errors";
import { getBffCsrfToken, isBffSessionMarker, isUnsafeMethod } from "security/bffSession";

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
    const csrfToken = isUnsafeMethod(options.method) ? await getBffCsrfToken() : undefined;
    const response = await fetch(getApiUrl(path), {
      ...options,
      credentials: "include",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.body && !(options.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
        ...(options.token && !isBffSessionMarker(options.token) ? { Authorization: `Bearer ${options.token}` } : {}),
        ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
        ...(options.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : {}),
        "X-Request-ID": requestId,
      },
    });
    const payload = (await response.json().catch(() => ({}))) as ApiFailure;
    if (!response.ok) {
      const canonical = payload.error && typeof payload.error === "object" ? payload.error as ApiFailure : payload;
      throw new ApiError(
        response.status,
        canonical.code,
        response.headers.get("X-Request-ID") ?? requestId,
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
  }
}

export const codestraDemoApi = {
  config: (token: string) => codestraRequest<DemoConfig>("v1/demo/config", { token }),
};

export type RealtimeV2Token = { token: string; channel?: string; expires_in: number; gateway?: string };

export const codestraRealtimeV2Api = {
  connectionToken: (token: string) =>
    codestraRequest<RealtimeV2Token>("v1/realtime/v2/connection-token", { method: "POST", token }),
  subscriptionToken: (token: string, channel: string) =>
    codestraRequest<RealtimeV2Token>("v1/realtime/v2/subscription-token", {
      method: "POST", token, body: JSON.stringify({ channel }),
    }),
  revoke: (token: string) =>
    codestraRequest<{ revoked: boolean }>("v1/realtime/v2/revoke", { method: "POST", token }),
};

export const codestraUserApi = {
  notifications: (token: string) => codestraRequest("v1/notifications/notifications/", { token }),
  toggleNotification: (token: string, body: unknown) =>
    codestraRequest("v1/notifications/toggle_notification/", { method: "PUT", token, body: JSON.stringify(body) }),
};

export const codestraWalletApi = {
  wallets: (token: string) => codestraRequest("v1/wallets/", { token }),
  create: <T>(token: string, body: unknown) => codestraRequest<T>("v1/wallets/", { method: "POST", token, body: JSON.stringify(body) }),
  update: <T>(token: string, asset: string | number, body: unknown) => codestraRequest<T>(`v1/wallets/${encodeURIComponent(asset)}`, { method: "POST", token, body: JSON.stringify(body) }),
  archive: <T>(_token: string, _id: string | number) => Promise.reject<T>(new ApiError(503, "FEATURE_DISABLED")),
  transaction: <T>(_token: string, _id: string) => Promise.reject<T>(new ApiError(503, "FEATURE_DISABLED")),
  refillLegacy: <T>(_token: string, _id: string | number) => Promise.reject<T>(new ApiError(503, "FEATURE_DISABLED")),
  tradeAssets: <T>(token: string) => codestraRequest<T>("trades/assets/", { token }),
  currencies: <T>(_token: string) => Promise.reject<T>(new ApiError(503, "FEATURE_DISABLED")),
  paymentMethods: <T>(_token: string) => Promise.reject<T>(new ApiError(503, "FEATURE_DISABLED")),
};

export const codestraBankApi = {
  details: <T>(token: string) => codestraRequest<T>("bank_account/tradxio/", { token }),
  save: <T>(token: string, body: unknown) => codestraRequest<T>("bank_account/", { method: "POST", token, body: JSON.stringify(body) }),
};

export const codestraAuthApi = {
  loginUrl: (next = "/platform") => `${getApiUrl("v1/auth/oidc/login/")}?next=${encodeURIComponent(next)}`,
  registrationUrl: (next = "/platform") => `${getApiUrl("v1/auth/oidc/register/")}?next=${encodeURIComponent(next)}`,
  passwordResetUrl: () => getApiUrl("v1/auth/oidc/password-reset/"),
  logout: () => codestraRequest<{ detail: string; logoutUrl: string }>("v1/auth/oidc/logout/", { method: "POST", body: "{}" }),
  refreshSession: () => codestraRequest<{ detail: string }>("v1/auth/token/refresh/", { method: "POST", body: "{}" }),
  // Compatibility-only methods for builds where the server-side Keycloak flag
  // has not yet been activated. Production removes these routes.
  login: <T>(body: unknown) => codestraRequest<T>("v1/auth/token/", { method: "POST", body: JSON.stringify(body) }),
  register: <T>(body: unknown) => codestraRequest<T>("v1/auth/create/", { method: "POST", body: JSON.stringify(body) }),
  refresh: <T>(body: unknown) => codestraRequest<T>("v1/auth/token/refresh/", { method: "POST", body: JSON.stringify(body) }),
  forgotPassword: <T>(body: unknown) => codestraRequest<T>("v1/auth/password_reset/", { method: "POST", body: JSON.stringify(body) }),
  resetPassword: <T>(uidb64: string, token: string, body: unknown) => codestraRequest<T>(`v1/auth/password_reset_confirm/${uidb64}/${token}/`, { method: "POST", body: JSON.stringify(body) }),
  verifyEmail: <T>(uidb64: string, token: string) => codestraRequest<T>(`v1/auth/verify_email/${uidb64}/${token}/`),
  sendEmailVerification: <T>(token: string, email: string) => codestraRequest<T>("v1/auth/send_email_verification/", { method: "POST", token, body: JSON.stringify({ email }) }),
  sendEmailVerificationPublic: <T>(email: string) => codestraRequest<T>("v1/auth/send_email_verification/", { method: "POST", body: JSON.stringify(email) }),
  statistics: <T>(token: string) => codestraRequest<T>("v1/auth/trading_statistics/", { token }),
  websocketTicket: <T>(token: string) => codestraRequest<T>("v1/auth/websocket_ticket/", { token }),
  sendPhoneVerification: <T>(token: string) => codestraRequest<T>("v1/auth/send_phone_verification/", { method: "POST", token }),
  verifyPhone: <T>(token: string, body: unknown) => codestraRequest<T>("v1/auth/verify_phone/", { method: "POST", token, body: JSON.stringify(body) }),
  mfaQr: <T>(token: string) => codestraRequest<T>("v1/auth/generate_mfa_code/", { token }),
  verifyMfa: <T>(body: unknown, token?: string) => codestraRequest<T>("v1/auth/verify_mfa_code/", { method: "POST", token, body: JSON.stringify(body) }),
  guestDemo: <T>(idempotencyKey?: string) => codestraRequest<T>("v1/demo/sessions", { method: "POST", idempotencyKey, body: "{}" }),
  registerDemo: <T>(body: unknown) => codestraRequest<T>("v1/auth/register", { method: "POST", body: JSON.stringify(body) }),
  verifyRegistration: <T>(body: unknown) => codestraRequest<T>("v1/auth/email-verification/verify", { method: "POST", body: JSON.stringify(body) }),
  providers: <T>() => codestraRequest<T>("v1/auth/providers"),
  googleStart: <T>(body: unknown) => codestraRequest<T>("v1/auth/google/start", { method: "POST", body: JSON.stringify(body) }),
  googleCredential: <T>(ticket: string) => codestraRequest<T>("v1/auth/google/credential", { method: "POST", body: JSON.stringify({ ticket }) }),
  session: <T>(token?: string) => codestraRequest<T>("v1/session", { token }),
};

export const codestraProfileApi = {
  profile: (token: string) => codestraRequest("v1/me/", { token }),
  update: (token: string, body: FormData | Record<string, unknown>) => codestraRequest("v1/me/", { method: "PATCH", token, body: body instanceof FormData ? body : JSON.stringify(body) }),
  changePassword: (token: string, body: unknown) => codestraRequest("v1/auth/password_change/", { method: "POST", token, body: JSON.stringify(body) }),
  disableWalkthrough: (token: string) => codestraRequest("v1/auth/disable_walkthrough/", { method: "PUT", token }),
};

export const codestraIntegrationsApi = {
  crmConnections: <T>(token: string) => codestraRequest<T>("v1/integrations/crm/connections", { token }),
  importUsers: <T>(token: string, body: FormData, idempotencyKey: string) => codestraRequest<T>("v1/users/imports", { method: "POST", token, body, idempotencyKey }),
};

export const codestraKycApi = {
  profile: <T>(token: string) => codestraRequest<T>("user/kyc/", { token }),
  files: <T>(token: string) => codestraRequest<T>("user/kycfiles/", { token }),
  upload: <T>(token: string, body: FormData) => codestraRequest<T>("user/kycfiles/", { method: "POST", token, body }),
  submit: <T>(token: string, body: FormData) => codestraRequest<T>("user/kyc/", { method: "POST", token, body }),
  update: <T>(token: string, id: string | number, body: FormData) => codestraRequest<T>(`user/kyc/${id}`, { method: "PATCH", token, body }),
};

export const codestraMarketApi = {
  assets: <T = unknown>(token: string, query: Record<string, string | undefined> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => value != null && params.set(key, value));
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return codestraRequest<T>(`assets/${suffix}`, { token });
  },
  clock: <T = unknown>(token: string) => codestraRequest<T>("get-clock/", { token }),
  alpaca: <T = unknown>(token: string, query: Record<string, string>) => {
    const params = new URLSearchParams(query);
    return codestraRequest<T>(`market-data/alpaca/?${params.toString()}`, { token });
  },
};

export const codestraNewsApi = {
  list: <T = unknown>(token: string, query: Record<string, string | undefined> = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => value != null && params.set(key, value));
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return codestraRequest<T>(`v1/news${suffix}`, { token });
  },
  article: <T = unknown>(token: string, id: string | number) => codestraRequest<T>(`v1/news/${id}`, { token }),
};

export const codestraPortfolioApi = {
  balance: <T>(token: string) => codestraRequest<T>("portfolio/total-balance/", { token }),
  profitLoss: <T>(token: string) => codestraRequest<T>("portfolio/total-profit-loss/", { token }),
  stockMarket: <T>(token: string) => codestraRequest<T>("portfolio/stock-market-data/", { token }),
  cryptoMarket: <T>(token: string) => codestraRequest<T>("portfolio/crypto-market-data/", { token }),
};
