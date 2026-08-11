export type ErrorContext = "auth" | "trading" | "wallet" | "market" | "realtime" | "admin" | "generic";
export type ErrorSeverity = "info" | "warning" | "error";

export type UserSafeError = {
  title: string;
  message: string;
  severity: ErrorSeverity;
  retryable: boolean;
};

type DiagnosticError = {
  status?: number;
  code?: string;
  requestId?: string;
  correlationId?: string;
};

const SAFE_ERRORS: Record<string, UserSafeError> = {
  REQUEST_TIMEOUT: { title: "Request took too long", message: "Please try again in a moment.", severity: "warning", retryable: true },
  NETWORK_ERROR: { title: "Connection problem", message: "Check your connection and try again.", severity: "warning", retryable: true },
  INVALID_CREDENTIALS: { title: "Unable to sign in", message: "Check your email and password and try again.", severity: "error", retryable: true },
  AUTHENTICATION_REQUIRED: { title: "Please sign in", message: "Your session has expired or you need to sign in.", severity: "warning", retryable: true },
  AUTHORIZATION_DENIED: { title: "Access denied", message: "You do not have permission to perform this action.", severity: "error", retryable: false },
  RESOURCE_NOT_FOUND: { title: "Not found", message: "The requested item could not be found.", severity: "error", retryable: false },
  VALIDATION_ERROR: { title: "Check your information", message: "Some information needs to be corrected.", severity: "error", retryable: true },
  IDEMPOTENCY_CONFLICT: { title: "Request already processed", message: "Please refresh and try again.", severity: "warning", retryable: true },
  FEATURE_DISABLED: { title: "Feature unavailable", message: "This feature is not available right now.", severity: "info", retryable: false },
  KYC_REQUIRED: { title: "Identity verification required", message: "Complete identity verification before continuing.", severity: "warning", retryable: false },
  COMPLIANCE_REVIEW_REQUIRED: { title: "Compliance review required", message: "This action is unavailable while your account is under review.", severity: "warning", retryable: false },
  JURISDICTION_RESTRICTED: { title: "Action unavailable", message: "This capability is unavailable for your account location.", severity: "error", retryable: false },
  STEP_UP_REQUIRED: { title: "Additional verification required", message: "Re-authenticate and complete recent multi-factor verification.", severity: "warning", retryable: false },
  DESTINATION_COOLDOWN: { title: "Destination cooldown active", message: "Wait until the security cooldown ends before continuing.", severity: "warning", retryable: false },
  WITHDRAWAL_NOT_ALLOWED: { title: "Withdrawal unavailable", message: "Withdrawals are not currently allowed for this account.", severity: "error", retryable: false },
  SERVICE_TEMPORARILY_UNAVAILABLE: { title: "Service temporarily unavailable", message: "No request was submitted. Please try again later.", severity: "warning", retryable: true },
  TRADING_HALTED: { title: "Trading temporarily unavailable", message: "Trading is currently paused.", severity: "warning", retryable: true },
  MARKET_DATA_STALE: { title: "Market data unavailable", message: "Current market data is temporarily unavailable.", severity: "warning", retryable: true },
  PROVIDER_UNAVAILABLE: { title: "Service temporarily unavailable", message: "Please try again shortly.", severity: "warning", retryable: true },
  INSUFFICIENT_AVAILABLE_BALANCE: { title: "Insufficient available balance", message: "Your available balance is not enough for this action.", severity: "error", retryable: false },
  ORDER_INVALID_STATE: { title: "Order cannot be changed", message: "This order can no longer be modified.", severity: "error", retryable: false },
  COMPLIANCE_RESTRICTED: { title: "Action unavailable", message: "This action is currently unavailable for your account.", severity: "error", retryable: false },
  RATE_LIMITED: { title: "Too many requests", message: "Please wait a moment and try again.", severity: "warning", retryable: true },
  UNKNOWN: { title: "Something went wrong", message: "Please try again.", severity: "error", retryable: true },
};

function metadata(error: unknown): DiagnosticError {
  return error && typeof error === "object" ? error as DiagnosticError : {};
}

export function toUserSafeError(error: unknown, context: ErrorContext = "generic"): UserSafeError {
  const value = metadata(error);
  let code = value.code?.toUpperCase();
  if (!code) {
    if (value.status === 401) code = context === "auth" ? "INVALID_CREDENTIALS" : "AUTHENTICATION_REQUIRED";
    else if (value.status === 403) code = "AUTHORIZATION_DENIED";
    else if (value.status === 404) code = "RESOURCE_NOT_FOUND";
    else if (value.status === 409) code = "IDEMPOTENCY_CONFLICT";
    else if (value.status === 422 || value.status === 400) code = "VALIDATION_ERROR";
    else if (value.status === 429) code = "RATE_LIMITED";
    else if ([502, 503, 504].includes(value.status ?? 0)) code = "PROVIDER_UNAVAILABLE";
  }
  const safe = SAFE_ERRORS[code ?? "UNKNOWN"] ?? SAFE_ERRORS.UNKNOWN;
  if (context === "auth" && code === "REQUEST_TIMEOUT") return { ...safe, title: "Sign-in is taking longer than expected" };
  if (context === "auth" && code === "PROVIDER_UNAVAILABLE") return { ...safe, title: "Sign-in temporarily unavailable" };
  if (context === "realtime" && (code === "NETWORK_ERROR" || code === "PROVIDER_UNAVAILABLE")) {
    return { title: "Live updates temporarily unavailable", message: "Reconnecting…", severity: "warning", retryable: true };
  }
  return safe;
}

export function toUserSafeErrorText(error: unknown, context: ErrorContext = "generic"): string {
  const safe = toUserSafeError(error, context);
  return `${safe.title}: ${safe.message}`;
}

export function logInternalError(error: unknown, data: { endpoint?: string; durationMs?: number; service?: string } = {}): void {
  const value = metadata(error);
  console.warn("beyvra_request_failed", {
    http_status: value.status,
    duration_ms: data.durationMs,
  });
}
