import { describe, expect, it, vi } from "vitest";
import { logInternalError, toUserSafeError, toUserSafeErrorText } from "./userSafeError";
import { BeyvraErrorMapper } from "./BeyvraErrorMapper";

const forbidden = /ApiError|Exception|Traceback|requestId|request_id|correlationId|correlation_id|traceId|stack|\/api\/|https?:\/\/|psycopg|IntegrityError|OperationalError|Redis|NATS|JetStream|Centrifugo|Docker|financial-service|provider-internal|localhost|172\.|10\.|192\.168\./i;

describe("user-safe error contract", () => {
  it.each([
    [{ status: 401 }, "auth", "Unable to sign in"],
    [{ status: 403 }, "generic", "Access denied"],
    [{ status: 404 }, "generic", "Not found"],
    [{ status: 409 }, "generic", "Request already processed"],
    [{ status: 422 }, "generic", "Check your information"],
    [{ status: 429 }, "generic", "Too many requests"],
    [{ status: 500 }, "generic", "Something went wrong"],
    [{ status: 502 }, "generic", "Service temporarily unavailable"],
    [{ status: 503 }, "auth", "Sign-in temporarily unavailable"],
    [{ status: 503 }, "registration", "Registration temporarily unavailable"],
    [{ status: 0, code: "NETWORK_ERROR" }, "registration", "Registration temporarily unavailable"],
    [{ status: 503, code: "EMAIL_REGISTRATION_DISABLED" }, "registration", "Registration temporarily unavailable"],
    [{ status: 504 }, "generic", "Service temporarily unavailable"],
    [{ code: "REQUEST_TIMEOUT", status: 408 }, "auth", "Sign-in is taking longer than expected"],
    [{ code: "NETWORK_ERROR" }, "generic", "Connection problem"],
    [{ code: "TRADING_HALTED" }, "trading", "Trading temporarily unavailable"],
    [{ code: "MARKET_DATA_STALE" }, "market", "Market data unavailable"],
    [{ code: "FEATURE_DISABLED" }, "wallet", "Feature unavailable"],
  ] as const)("maps %#", (error, context, title) => {
    const safe = toUserSafeError(error, context);
    expect(safe.title).toBe(title);
    expect(toUserSafeErrorText({ ...error, requestId: "secret-reference", message: "IntegrityError at /api/private" }, context)).not.toMatch(forbidden);
  });

  it("keeps browser diagnostics free of internal identifiers and topology", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    logInternalError({ status: 503, code: "PROVIDER_UNAVAILABLE", requestId: "ref-123" }, { endpoint: "auth.login", durationMs: 15_000 });
    expect(spy).toHaveBeenCalledWith("beyvra_request_failed", { http_status: 503, duration_ms: 15_000 });
    expect(JSON.stringify(spy.mock.calls)).not.toMatch(/ref-123|auth\.login|PROVIDER_UNAVAILABLE|request_id|service/i);
    spy.mockRestore();
  });

  it("discards every prohibited raw diagnostic field from unknown errors", () => {
    const raw = {
      message: "OperationalError at /api/wallet https://api.internal",
      name: "CodestraApiError",
      stack: "Traceback",
      requestId: "request-visible-never",
      correlationId: "correlation-visible-never",
      traceId: "trace-visible-never",
      response: { data: { service: "financial-service", provider: "provider-internal" } },
    };
    expect(toUserSafeError(raw)).toEqual({
      title: "Something went wrong",
      message: "Please try again.",
      severity: "error",
      retryable: true,
    });
    expect(toUserSafeErrorText(raw)).not.toMatch(forbidden);
    expect(BeyvraErrorMapper.text(raw)).not.toMatch(forbidden);
  });

  it("classifies provider outages without exposing provider diagnostics", () => {
    const raw = { status: 503, code: "PROVIDER_UNAVAILABLE", requestId: "hidden", message: "provider-internal /api/private" };
    expect(BeyvraErrorMapper.marketState(raw)).toBe("provider-unavailable");
    expect(BeyvraErrorMapper.text(raw)).not.toMatch(forbidden);
  });
});
