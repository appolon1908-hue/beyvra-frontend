# User-safe error audit

This audit covers the browser surfaces in `src/` and the canonical API clients. Raw exceptions and diagnostic metadata are never presentation values. `toUserSafeError()` in `src/errors/userSafeError.ts` is the authoritative Beyvra mapper; `scripts/check-user-safe-errors.mjs` prevents direct exception rendering from returning.

| Surface | Classification | Handling |
|---|---|---|
| Login, registration, password reset, MFA | SAFE | Auth-context mapping; request references logged only |
| Profile and phone verification | SAFE | Canonical mapper; raw `detail` removed |
| Wallet, demo deposits, withdrawals, transfers | SAFE | Wallet-context mapping |
| Trading, order placement and cancellation | SAFE | Trading domain mappings |
| Portfolio, market data, chart and news/calendar | SAFE | Market/provider mappings |
| Notifications and integrations | SAFE | Generic/admin mapping; webhook secrets remain write-only |
| Realtime/WebSocket disconnect | SAFE | Reconnect-safe copy without transport internals |
| Admin integrations | SAFE | Sanitized operational text; no raw exception values |
| API `request_id`, correlation IDs, status, code | LOG_ONLY | Structured `beyvra_request_failed` event |
| Internal generated-client identifiers | ADMIN_INTERNAL_ONLY | Never rendered; throwable is branded `BeyvraApiError` |

The mapper covers timeout, offline/network, 401, 403, 404, 409, 422, 429, 500, 502, 503, 504, provider unavailable, stale market data, disabled financial features, halted trading, balance, order-state, and compliance errors. Unknown values always become “Something went wrong: Please try again.”

Backend canonical metadata (`code`, `request_id`, `details`) is parsed only for classification and logging. Public backend `message` and raw bodies are not rendered automatically.

## Mandatory invariant

Every asynchronous UI failure crosses `toUserSafeError()` (directly or through `toUserSafeErrorText()`) before a toast, modal, banner, form, chart, trading, wallet, payment, or admin surface receives it. Diagnostic fields remain log-only. Unknown inputs always return exactly “Something went wrong” and “Please try again.” The `errors:check` CI/build gate rejects direct exception, response-body, request-reference, stack, and historical `CodestraApiError` rendering patterns.
