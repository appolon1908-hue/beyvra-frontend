# Beyvra staging UX audit

Audit date: 2026-08-10  
Surface: `staging.beyvra.com` and the matching frontend candidate  
Target: keyboard-operable, responsive WCAG 2 A/AA critical flows with safe, non-financial demo behavior

## Evidence and method

The audit combines current-run Playwright screenshots at 375, 768, 1024, and 1440 pixels, automated axe checks, browser error/overflow assertions, deterministic API interception for unsafe-error testing, and source inspection. Accepted screenshots are written to `client-portal/test-results/ux-audit/` during the E2E run. Screenshot evidence cannot by itself establish full WCAG compliance; keyboard behavior, focus restoration, dialog Escape handling, and programmatic labels are asserted separately.

## Inventory

| Flow/page | Classification | Evidence and remaining boundary |
|---|---|---|
| Login | PASS | Labeled inputs, password visibility control, safe invalid-credential mapping, deterministic recovery link. Valid named-user login requires an approved staging test account. |
| Logout | PASS | Server revocation is attempted, local credentials are removed, navigation replaces history, and cross-tab logout is propagated. |
| Registration | PASS | Registration reaches the server-owned pending email-verification state; fields and validation are labeled. |
| Password reset | PASS | Forgot-password entry and session-expired reauthentication are explicit. End-to-end email delivery is environment-owned. |
| MFA | PASS | Authenticator challenge has a numeric, length-bounded labeled field. Full success requires an approved MFA fixture. |
| Dashboard | PASS | Explicit session loading/error/retry states; responsive evidence at all four required widths. |
| Market | PASS | Asset selection has loading, empty, retryable safe-error behavior; provider details are not rendered. |
| Charts | PASS | ECharts, native timeframes, 5s disabled, loading/empty/stale/provider/reconnect states, keyboard zoom and Escape handling. |
| Demo trading | PASS | Virtual-funds disclosure, preview controls, fail-closed quote dependency, safe rejection text, and chart markers. |
| Orders | PASS | Demo-only order creation and state markers; provider rejection remains visible as a safe mapped state. |
| Positions/trades | PASS | Open/closed tabs, loading, empty, safe error with retry, and no monetary-value disclosure. |
| Wallet | PASS | Demo wallet is isolated and marked virtual. Real-money controls remain unavailable. |
| Payments/deposits/withdrawals | PASS | Server feature flags default deposits and withdrawals off. Demo-only funding is labeled; no real success path is exercised. |
| News/calendar | PASS | Lazy loading, empty/provider-unavailable state, filters, marker drawer, focus return, and Escape behavior. |
| Notifications | PASS | Loading/empty/error handling exists; webhook secrets use password inputs. Privileged mutation success needs the approved OTP fixture. |
| Profile | PASS | Dedicated labeled demo profile route with safe save confirmation. |
| Settings | PASS | Dedicated demo preferences route with labels and explicit demo defaults. |
| Support/help | PASS | Reachable from keyboard-labeled sidebar navigation. Content quality remains a product-owner review item. |
| Admin | PASS | Protected route exists; authorization is enforced server-side. Full admin behavior requires an approved admin fixture. |

## Findings fixed

1. E2E guest-session amplification: four suites created sessions independently, exhausting staging limits and causing unrelated failures. One global ephemeral storage state now serves the run.
2. Flaky sleeps around demo settlement: fixed-duration sleeps were removed from visual coverage. State is polled only when order creation is accepted; fail-closed 409/503 behavior is treated as an explicit safe state.
3. Error-mapping drift: session bootstrap, asset selector, market drawer, demo trades, and chart order failures now pass through `BeyvraErrorMapper`.
4. Coverage gaps: critical authentication recovery, safe-error redaction, routes, four required widths, overflow, and axe checks now have dedicated coverage.

## Security and performance observations

- User-visible pages are asserted not to render request/correlation IDs, stack traces, internal API paths, service/provider/database names, or topology terms.
- The chart adapter remains long-lived during live updates; tests assert that the canvas is not recreated.
- Chart performance coverage exercises 1,000, 5,000, and 10,000 candles and immutable live updates.
- Vite reports two existing optimization opportunities: large eager chunks and deprecated Sass imports. These are non-blocking follow-up work, not silently classified as fixed.
- Production dependency audit remains a required gate; development-only audit findings are reported separately.

## Explicit safety boundaries

- Genuine 5-second market data is unavailable; the 5s chart control remains disabled.
- Real trading, external execution, real deposits, real withdrawals, and real transfers remain disabled.
- No test claims successful real-money effects. Provider-unavailable demo ordering fails closed.
- No production deployment or Financial Service modification is part of this work.
