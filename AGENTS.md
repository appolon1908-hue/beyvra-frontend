# AGENTS.md

This repository contains a deployment wrapper plus a Vite React + TypeScript frontend in [client-portal](client-portal). Most feature work, bug fixes, and tests belong in that app directory.

## Project layout

- App source: [client-portal/src](client-portal/src)
- Build config: [client-portal/package.json](client-portal/package.json), [client-portal/vite.config.ts](client-portal/vite.config.ts)
- App docs: [client-portal/README.md](client-portal/README.md), [DEPLOYMENT.md](DEPLOYMENT.md)
- Public-facing docs: [docs](docs)

## Working conventions

- Treat [client-portal](client-portal) as the active project root for frontend work.
- Prefer the existing Vite + React + TypeScript patterns already in the app rather than introducing new frameworks or abstractions.
- Keep route changes aligned with the auth and public/private split already used in [client-portal/src/App.tsx](client-portal/src/App.tsx).
- Use the existing i18n, user-safe error, and public-identity checks when changing user-facing strings or errors.
- Do not duplicate detailed setup or deployment guidance already captured in the docs; link to them instead.

## Build and validation commands

Run these from the app directory unless stated otherwise:

- Install dependencies: `cd client-portal && npm ci`
- Dev server: `cd client-portal && npm run dev` (Vite runs on port 8080)
- Type-check: `cd client-portal && npm run typecheck`
- Lint: `cd client-portal && npm run lint`
- Production build: `cd client-portal && npm run build:prod`
- Full app validation: `cd client-portal && npm test`
- Targeted checks:
  - `cd client-portal && npm run test:errors`
  - `cd client-portal && npm run test:realtime`
  - `cd client-portal && npm run test:chart`
  - `cd client-portal && npm run test:e2e`

## Important repo-specific notes

- The production build includes project-specific checks before Vite runs: error safety validation, brand/public identity validation, type-checking, and i18n validation. Do not bypass these when validating changes.
- Route code is intentionally split between public marketing pages and private platform pages, with lazy loading used for large sections.
- The app is sensitive to user-safe messaging and public identity consistency; when changing text, review the checks in [client-portal/scripts](client-portal/scripts) and the identity docs in [docs](docs).
- For deployment details, follow [DEPLOYMENT.md](DEPLOYMENT.md) and the Docker setup under [client-portal](client-portal).
- Authentication is backend-driven. The frontend must not assume a local login mode. The first auth check should be `GET /api/v1/auth/oidc/config/`. If `enabled: true`, use OIDC login/register flows; if `enabled: false`, use the local email/password and token endpoints.
- Local auth endpoints are: `POST /api/v1/auth/register`, `POST /api/v1/auth/email-verification/verify`, `POST /api/v1/auth/email-verification/resend`, `GET /api/v1/auth/email-verification/status`, `POST /api/v1/auth/token/`, `POST /api/v1/auth/token/refresh/`, `POST /api/v1/auth/token/logout/`.
- OIDC endpoints are: `GET /api/v1/auth/oidc/config/`, `GET /api/v1/auth/oidc/login/`, `GET /api/v1/auth/oidc/register/`, `GET /api/v1/auth/oidc/callback/`, `GET /api/v1/auth/oidc/csrf/`, `POST /api/v1/auth/oidc/logout/`.
- For email registration, the backend flow is: register -> verify OTP -> backend activates account and sets auth cookies -> redirect to `/platform`.
- For local login, the backend flow is: submit credentials -> backend validates -> return MFA/login token if required -> backend sets HttpOnly cookies -> frontend fetches session/me data and enters the app.
- For logout, always use the backend logout route matching the active auth mode (`/api/v1/auth/oidc/logout/` or `/api/v1/auth/token/logout/`); never implement custom session teardown in the frontend.
- Keep auth-related changes aligned with the backend contract, not with a frontend-only login abstraction.

## Recommended workflow for agents

1. Start by checking the relevant feature area under [client-portal/src](client-portal/src).
2. Validate with the smallest relevant command before and after a change.
3. Favor surgical edits, existing patterns, and project-specific helpers over broad rewrites.
4. If work affects routing, localization, auth, or deployment behavior, review the corresponding docs before finalizing the patch.

## Frontend branch chain

Add the complete frontend dependency sequence:

```text
Frontend PR #25
→ Frontend PR #27
→ frontend-safety-foundation-v1
→ market-explorer-v1
→ order-ticket-v1
→ orders-activity-v1
→ account-financial-projections-v1
→ realtime-recovery-v1
→ frontend-critical-gates-v1
```

Each PR requires exact base/head, backend-contract dependency, CI result, and independent review.

## Frontend CI gates

Add:

```text
npm ci
npm run typecheck
npm run lint
npm run build
npm run test
npm run test:chart
npm run test:enterprise
npm run test:e2e
npm audit --audit-level=critical
```

Also require:

- Gitleaks.
- Production container build.
- Trivy HIGH/CRITICAL scan.
- API contract-drift validation.
- Service-worker cache-policy tests.
- Accessibility tests.
- Mobile viewport tests.
- Bundle-size/performance budget.
- Exact-head/base verification.

## Authentication cutover evidence

The simulation go/no-go section should explicitly require:

```text
KEYCLOAK_CLIENT_EXPORT=PASS
KEYCLOAK_CLIENT_ID=beyvra-web-production
KEYCLOAK_API_AUDIENCE=beyvra-api-production
SAME_ORIGIN_API_PROXY=PASS
LOGIN_SMOKE=PASS
REGISTRATION_SMOKE=PASS
LOGOUT_SMOKE=PASS
SESSION_EXPIRY_SMOKE=PASS
ADMIN_MFA_SMOKE=PASS
PASSWORD_RESET_SEND=PASS
PASSWORD_RESET_CONSUME=PASS
```

## BFF security tests

Add proof that:

- The browser stores no bearer/refresh/ID tokens.
- API requests do not attach BFF `Authorization` headers.
- Unsafe requests require CSRF.
- CSRF bootstrap has a bounded timeout.
- Expired cookies do not block login/recovery.
- Protected deep links survive authentication.
- Malicious external redirects are rejected.
- Multi-tab logout clears authenticated UI state.

## Financial browser-safety gates

Add:

```text
FINANCIAL_LOCAL_STORAGE_ENTRIES=0
AUTH_LOCAL_STORAGE_ENTRIES=0
SENSITIVE_CACHE_STORAGE_ENTRIES=0
OFFLINE_MUTATION_QUEUE=DISABLED
ORDER_BACKGROUND_SYNC=DISABLED
CLIENT_BUYING_POWER_AUTHORITY=DISALLOWED
CLIENT_FEE_AUTHORITY=DISALLOWED
FABRICATED_FINANCIAL_VALUES=0
```

## Public-edge verification

Before simulation production, also require:

- `beyvra.com/api/*` routes to the BFF.
- `/api` remains same-origin.
- WebSocket upgrade and timeout configuration.
- CSP.
- HSTS.
- Secure cookie flags.
- Trusted-origin configuration.
- Host allowlisting.
- API/body-size limits.
- Authentication and order rate limits.
- No internal provider endpoint exposed publicly.

## Email gates

Add:

```text
BEYVRA_MX=PASS
BEYVRA_SPF=PASS
BEYVRA_DKIM=PASS
BEYVRA_DMARC=PASS
BEYVRA_RETURN_PATH=PASS
KLYROW_SECURITY_SMTP_STARTTLS=PASS
KLYROW_SECURITY_SMTP_AUTH=PASS
KLYROW_SANDBOX_DELIVERY=PASS
INBOUND_ROUTE_RECONCILIATION=PASS
LIVE_DELIVERY_KILL_SWITCH=DISABLED
TRACKING_HOST_TLS=PASS
```

## High-priority production blockers

These are required feature and validation workstreams before external simulation users are allowed:

### H1. Frontend safety foundation

- Branch: `feature/beyvra/frontend-safety-foundation-v1`
- Required backend and client-side safety foundation: one same-origin BFF API client, `credentials: "include"`, CSRF for unsafe requests, bounded request timeouts, request cancellation, normalized API errors, request/correlation ID display, `cache: "no-store"`, global offline mutation blocking, no bearer-token storage or attachment, session-expiration handling, multi-tab logout, and protected deep-link restoration.
- Connect: `GET /api/v1/platform/config` and `GET /api/v1/platform/capabilities`.
- Required components: `CapabilityGuard`, `AuthenticatedRoute`, `MfaRequiredBoundary`, `OfflineMutationGuard`, `MaintenanceBoundary`, `DegradedModeNotice`, `ApiErrorState`, `UnavailableState`, `PartialDataNotice`, and `RequestIdSupportReference`.
- Constraints: client variables cannot enable backend-disabled capabilities; expired sessions must stop mutations; no financial or auth responses may enter Cache Storage; no token may appear in localStorage, sessionStorage, or application logs.

### H2. Market explorer and canonical instrument selection

- Branch: `feature/beyvra/market-explorer-v1`
- Connect: `GET /api/v1/instruments`, `GET /api/v1/instruments/{id}`, `GET /api/v1/markets/status`, `GET /api/v1/market/snapshot`, and `GET /api/v1/market/capabilities`.
- Required behavior: debounced search, cursor pagination, asset-class and venue filters, market-open/closed states, price freshness indicators, canonical UUID selection, delayed/stale/gapped/unavailable handling, mobile instrument drawer, keyboard navigation, and clear simulation disclosure.
- Rules: never use ticker symbol as the only identifier; reject ambiguous symbols; never show stale prices as tradable; preserve canonical identity after symbol changes.

### H3. Safe order ticket

- Branch: `feature/beyvra/order-ticket-v1`
- Connect: `POST /api/v1/orders/preview`, `POST /api/v1/orders`, `POST /api/v1/orders/{id}/cancel`, `POST /api/v1/orders/{id}/replace`, and `GET /api/v1/orders/{id}`.
- Required flow: account selection -> instrument selection -> order entry -> server preview -> confirmation -> idempotent submission -> server receipt -> order-state tracking.
- Required controls: decimal-string inputs, backend-supported order types and time-in-force values only, quote age and expiration, buying power before and after, fees or explicit unavailable state, compliance and risk decisions, duplicate-click protection, stable `Idempotency-Key`, preview version via `If-Match`, preview invalidation when economic fields change, offline blocking, unknown-outcome state, cancel confirmation, and replace through a new preview.
- Never calculate authoritative buying power client-side, display optimistic fills, auto-resubmit after timeout, or generate a new idempotency key after an unknown outcome.

### H4. Orders, executions and activity

- Branch: `feature/beyvra/orders-activity-v1`
- Routes: `/platform/orders`, `/platform/orders/:orderId`, `/platform/executions`, and `/platform/activity`.
- Connect: `GET /api/v1/orders`, `GET /api/v1/orders/{id}`, `GET /api/v1/orders/{id}/events`, `GET /api/v1/executions`, and `GET /api/v1/accounts/{id}/transactions`.
- Build: open orders, order history, status filters, partial fills, execution list, immutable event timeline, cancel/replace relationships, rejection explanations, unknown and reconciliation-required warnings, cursor pagination, and request ID for support.

### H5. Account and financial projections

- Branch: `feature/beyvra/account-financial-projections-v1`
- Connect: `GET /api/v1/accounts`, `GET /api/v1/accounts/{id}`, `GET /api/v1/accounts/{id}/balances`, `GET /api/v1/accounts/{id}/buying-power`, `GET /api/v1/accounts/{id}/transactions`, and `GET /api/v1/accounts/{id}/statements`.
- Display separately: cash, settled cash, unsettled cash, reserved cash, available cash, buying power, equity, and market value.
- Missing evidence must display as unavailable, never as `0.00`.

### H6. Realtime recovery

- Branch: `feature/beyvra/realtime-recovery-v1`
- Connect: `POST /api/v1/realtime/ticket`, `GET /api/v1/realtime/resume`, and `GET /api/v1/realtime/snapshot`.
- Must support short-lived tickets, sequence tracking, duplicate rejection, gap detection, resume after reconnect, `SNAPSHOT_REQUIRED` recovery, bounded exponential backoff, session-expiration shutdown, logout disconnection, and connection-health display.

### H7. Critical testing

- Branch: `test/beyvra/frontend-critical-gates-v1`
- Mandatory end-to-end coverage: login, registration, logout and recovery, protected deep links, session expiration, administrator MFA, capability failure, order preview and submission, duplicate submission, stale preview, partial fill, cancel and replace, unknown outcome, cross-tenant denial, offline mutation blocking, realtime gap recovery, mobile order flow, sensitive-cache inspection, and keyboard-only trading.
- These are mandatory gates before external simulation users are allowed.

## Medium priority — customer and operator completeness

### M1. Portfolio experience expansion

- Branch: `feature/beyvra/portfolio-experience-v2`
- Enhance the existing portfolio page with account switching, position drill-down, realized/unrealized P&L separation, performance-range comparison, allocation filtering, valuation timestamps, unpriced-position disclosure, evidence-quality explanations, risk methodology, statement and transaction links, responsive ECharts, and accessible chart tables.
- Do not fabricate VaR, stress results, or performance history.

### M2. Watchlists and alerts

- Branch: `feature/beyvra/watchlists-alerts-v1`
- Build create, rename, and delete watchlists; add/remove canonical instruments; drag and keyboard reordering; ETag/version handling; conflict recovery; price alerts; alert editing; trigger history; delivery evidence; and unavailable market-data states.
- Pass `If-Match: "<version>"` on watchlist and alert updates.

### M3. Compliance and account security

- Branch: `feature/beyvra/compliance-security-v1`
- Routes: `/platform/compliance`, `/platform/compliance/requirements`, `/platform/compliance/documents`, `/platform/compliance/restrictions`, and `/platform/security`.
- Build onboarding progress, outstanding requirements, document upload, upload and malware-scan states, restrictions, policy version, acknowledgements, MFA status, active sessions, security history, and revoke-session actions.
- Compliance changes must immediately disable affected trading controls.

### M4. Operator console

- Branch: `feature/beyvra/operator-console-v1`
- Routes: `/operator/orders`, `/operator/providers`, `/operator/reconciliation`, `/operator/halts`, `/operator/limits`, and `/operator/audit`.
- Requirements: separate route guard, current-session MFA, backend permission validation, read-only default, maker/checker separation, mutation confirmation, mandatory reason, audit reference, and no provider credentials displayed.

### M5. Chart capability expansion

- Branch: `feature/beyvra/trading-chart-v2`
- Add only genuinely supported features: candlestick, line, and area charts; volume; supported timeframes; indicators; drawings; order/fill markers; corporate-action markers; fullscreen; reduced motion; accessible table; and stale/disconnected overlays.
- Do not expose controls that are placeholders.

## Low priority — post-launch enhancements

### L1. Workspace personalization

- Branch: `feature/beyvra/workspace-personalization-v1`
- Add rearrangeable panels, saved layouts, density settings, default account, default watchlist, chart preferences, timezone and locale, and currency display preferences.
- Preferences must not change authoritative financial values.

### L2. Advanced portfolio analytics

- Branch: `feature/beyvra/portfolio-analytics-v1`
- Only when backend evidence exists: benchmark comparisons, drawdown, attribution, sector exposure, geographic exposure, risk contribution, time-weighted return, money-weighted return, and exportable reports.
- Never calculate or invent unavailable institutional metrics in the browser.

### L3. Customer education and support

- Branch: `feature/beyvra/customer-guidance-v1`
- Build a first-use walkthrough, contextual explanations, order-type education, simulation disclosure, evidence-quality help, searchable help center, support request with request ID, and safe empty-state guidance.

### L4. Notification center

- Branch: `feature/beyvra/notification-center-v1`
- Add order notifications, execution notifications, compliance notifications, alert notifications, system-degradation notices, read/unread states, and notification preferences.
- The UI must distinguish queued, sent, delivered, and failed delivery states.

## Branch execution order

```text
PR #25
→ PR #27
→ H1 Safety Foundation
→ H2 Market Explorer
→ H3 Order Ticket
→ H4 Orders and Activity
→ H5 Account Projections
→ H6 Realtime Recovery
→ H7 Critical Tests
→ M1 Portfolio V2
→ M2 Watchlists and Alerts
→ M3 Compliance and Security
→ M4 Operator Console
→ M5 Chart V2
→ Low-priority enhancements
```

## Required CI for every branch

```text
npm ci
npm run typecheck
npm run lint
npm run build
npm run test
npm run test:chart
npm run test:enterprise
npm run test:e2e
npm audit --audit-level=critical
```

Also require:

- Exact-head/base verification.
- API contract-drift validation.
- Secret scanning.
- Production container build.
- Trivy HIGH/CRITICAL scan.
- No sensitive caching.
- No bearer-token storage.
- No offline mutation replay.
- No reachable lender route.
- No placeholder financial values.
- Independent review.

## Delivery priority recommendation

Complete every High item before simulation production, complete the Medium items before broad customer rollout, and treat Low items as controlled post-launch work.

## Useful references

- [client-portal/README.md](client-portal/README.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [docs](docs)
- [client-portal/src/App.tsx](client-portal/src/App.tsx)
- [client-portal/package.json](client-portal/package.json)
