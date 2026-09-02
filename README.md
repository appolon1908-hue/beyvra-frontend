# Beyvra Frontend

Production-oriented React and TypeScript browser application for the Beyvra trading platform.

This repository contains the user-facing portal, charting workspace, authentication entry points, generated API client integration, realtime presentation, accessibility checks, container packaging, and staging deployment material. It is not the authority for balances, positions, orders, executions, market-data truth, risk decisions, compliance decisions, payments, or provider operations.

## Repository authority

`appolon1908-hue/beyvra-frontend` is the principal source repository for Beyvra browser experiences and frontend release artifacts.

Related authorities:

- `appolon1908-hue/beyvra-backend` owns server-side business rules, persistence, authorization enforcement, accounts, balances, positions, orders, executions, market-data normalization, risk, compliance, audit, reconciliation, and provider adapters.
- `appolon1908-hue/Keycloak` owns the Codestra identity realm, browser clients, service clients, scopes, audiences, and token issuance.
- `appolon1908-hue/Caddy` and `appolon1908-hue/Kong` own the shared TLS and API-gateway boundaries where they are used.
- Infrastructure and production deployment evidence remain separate from application source.

A frontend merge, successful build, image tag, or working URL does not authorize production deployment or live trading.

## Current release truth

```text
REPOSITORY_AUTHORITY=DEFINED
APPLICATION_SOURCE=PRESENT
PRODUCTION_RELEASE=NOT_CERTIFIED_BY_THIS_README
PRODUCTION_DEPLOYMENT_STATUS=NOT_CERTIFIED
LIVE_TRADING_ACTIVATION=NOT_AUTHORIZED_BY_THIS_REPOSITORY
PROVIDER_CREDENTIALS_ALLOWED_IN_BROWSER=NO
BACKEND_BUSINESS_AUTHORITY=BEYVRA_BACKEND
```

Production status must be established by exact-commit CI, an immutable image digest, staging acceptance, API and identity evidence, rollback proof, and a separately approved production change.

## Application surfaces

The source and platform route registry use the following boundaries:

| Surface | Canonical address | Responsibility |
|---|---|---|
| Public site | `https://beyvra.com` | Public Beyvra experience and entry to the platform |
| Trading portal | `https://platform.beyvra.com` | Authenticated customer trading workspace |
| Administration | `https://admin.beyvra.com` | Authorized administration and operations surface |
| API | `https://api.beyvra.com` | Beyvra backend and versioned API authority |
| Identity | `https://auth.codestra.co/realms/codestra` | Canonical OIDC issuer |
| Staging | `https://staging.beyvra.com` | Non-production integration and release acceptance |

These addresses are contracts and deployment targets. Their presence in source is not, by itself, proof that a particular commit or image is currently deployed or production-certified.

## Current browser application

The executable frontend is under `client-portal/`.

It includes:

- authenticated platform navigation and protected routes;
- portfolio, account, order, activity, and market presentation;
- a charting workspace based on ECharts and Lightweight Charts;
- drawings, indicators, trade markers, events, and chart-performance tests;
- Redux Toolkit and TanStack Query state/data layers;
- generated API-client contract checks;
- Socket.IO realtime presentation with bounded reconnect behavior;
- internationalization tooling and catalog validation;
- user-safe error handling and public-identity checks;
- Playwright browser and accessibility testing;
- production Nginx packaging and optional Caddy staging edge.

The frontend may display only state returned by approved backend APIs. It must not calculate authoritative buying power, fill status, fees, risk approval, compliance approval, or account eligibility locally.

## Request and identity boundary

The intended request path is:

```text
Browser
  -> same-origin Beyvra frontend/BFF route
  -> public HTTPS API edge
  -> Beyvra backend
  -> authoritative database, workers, and approved adapters
```

Human login starts through the same-origin route:

```text
GET /api/v1/auth/oidc/login/?next=/platform
```

The backend/edge redirects to the canonical Codestra issuer and uses Authorization Code Flow with PKCE S256. The browser must not receive a Keycloak client secret, provider credential, database credential, or infrastructure token. Access and refresh-token handling must remain server-controlled or use the approved secure session design; do not add identity tokens to `localStorage` or public Vite configuration.

Frontend API calls default to the same-origin `/api` boundary. The public upstream authority is `https://api.beyvra.com`; browser code must not call databases, broker/provider administration APIs, Odoo, n8n, or internal service ports directly.

## Frontend and backend responsibility split

### Frontend owns

- rendering, interaction, responsive behavior, and accessibility;
- local form and view state;
- typed API requests and safe response presentation;
- loading, empty, stale, degraded, partial, and unavailable states;
- protected navigation and session-expiration UX;
- duplicate-click prevention as a user-experience guard;
- charts, watchlists, tables, filters, and operator/customer workflows;
- telemetry that contains no secrets or prohibited financial/customer payloads.

### Backend owns

- authentication and authorization enforcement;
- tenant/account ownership and entitlements;
- instrument identity and market-data authority;
- balances, buying power, positions, orders, executions, fees, and ledgers;
- preview, confirmation, submission, cancellation, replacement, and reconciliation rules;
- idempotency, optimistic concurrency, audit, inbox/outbox, retries, and dead letters;
- risk, suitability, compliance, limits, approvals, and trading halts;
- provider credentials, provider calls, read-back, and unknown-outcome handling;
- every decision that can move money, create market exposure, or alter authoritative records.

Client-side validation and disabled buttons are defense in depth, never authorization.

## Runtime and toolchain

The current portal uses:

- React 19;
- TypeScript;
- Vite;
- Redux Toolkit;
- TanStack Query;
- Ant Design;
- ECharts and Lightweight Charts;
- i18next;
- Socket.IO client;
- Vitest;
- Playwright and axe-core;
- Nginx for the production static container;
- optional Caddy for isolated staging/rehearsal ingress.

Use the committed lockfile and `npm ci`; do not resolve a new dependency graph during release deployment.

## Local development

```bash
git clone https://github.com/appolon1908-hue/beyvra-frontend.git
cd beyvra-frontend/client-portal
cp .env.example .env
npm ci
npm run dev
```

The development server listens on port `8080` by default.

## Configuration

The checked-in example uses non-secret browser configuration:

| Variable | Purpose | Safe default/example |
|---|---|---|
| `VITE_API_BASE_URL` | Same-origin API prefix | `/api` |
| `VITE_SOCKET_BASE_URL` | Approved realtime endpoint or automatic derivation | `AUTO` or an approved `wss://` staging endpoint |
| `VITE_PUBLIC_SITE_URL` | Public origin used by the build | `https://staging.beyvra.com` for staging |
| `VITE_BRAND_NAME` | Public product name | `Beyvra` |
| `VITE_REALTIME_V2_ENABLED` | Enables the reviewed realtime-v2 client | release-controlled |
| `VITE_REALTIME_V2_V1_FALLBACK_ENABLED` | Enables reviewed compatibility fallback | release-controlled |

Never place passwords, signing keys, API keys, OIDC client secrets, provider credentials, database URLs, private service addresses, or bearer tokens in `VITE_*` variables. Vite variables are part of the public browser bundle.

## Validation

Run source-only checks from `client-portal/`:

```bash
npm ci
npm run lint
npm run typecheck
npm run errors:check
npm run brand:check
npm run i18n:check
npm run test:errors
npm run test:realtime
npm run test:chart
node scripts/check-api-contract.mjs --source-only
npm run build
npm run audit:gate
```

The full API contract gate requires an accepted `beyvra-backend` schema endpoint:

```bash
API_SCHEMA_URL=https://YOUR_APPROVED_STAGING_API/api/schema/ npm run test:contract
```

`test:contract` parses the real `src/api/endpoints.ts` registry plus direct request literals, refuses zero or unexpectedly low endpoint discovery, and compares those paths with the backend OpenAPI schema. A source-only parser pass does not replace the full backend comparison.

The Playwright suite is an integrated frontend/backend test and does not start either service. It requires a running frontend at `E2E_BASE_URL`, a same-origin `/api` path to an approved non-production backend, and `POST /api/v1/demo/sessions` for guest-session setup:

```bash
E2E_BASE_URL=https://YOUR_APPROVED_STAGING_DOMAIN npm run test:e2e
```

`E2E_SKIP_GUEST_BOOTSTRAP=true` is allowed only for a deliberately unauthenticated test subset; it must not be used as authenticated or order-flow acceptance evidence.

Important script groups:

- `test:contract` performs the live backend-schema comparison described above;
- `test:realtime` verifies the unified realtime client;
- `test:chart` exercises the chart engine, workspace integration, performance, indicators, drawings, trade markers, and events;
- `test:e2e` runs Playwright against the explicitly supplied integrated origin;
- `errors:check` prevents unsafe public error output;
- `brand:check` prevents stale public product identity;
- `audit:gate` is the dependency-security gate.

The repository currently has localization and README-authority workflows under `.github/workflows/`. The README-authority workflow also runs endpoint discovery in source-only mode. A production release must still have protected CI that runs every applicable source and integration gate against the exact pull-request head and merge result. Local success alone is not release evidence.

## Container build

From the repository root:

```bash
cd client-portal
npm ci
npm run build

docker build \
  --file Dockerfile.prod \
  --tag beyvra-frontend:local \
  .
```

The root Compose definition:

- builds `client-portal/Dockerfile.prod`;
- publishes the frontend on host loopback only at `127.0.0.1:${SERVER_PORT:-8080}:80`;
- requires the external `trading-network` network;
- includes a health check;
- optionally starts a Caddy edge through the `edge` profile.

A production declaration must use an immutable registry reference such as `repository@sha256:...`, not a floating `latest` tag or a locally named image. The current repository does not, by this documentation alone, prove that such an artifact has been published or deployed.

## Staging deployment

Follow `DEPLOYMENT.md`. The minimum source-side rehearsal is:

```bash
cp .env.staging.example .env.staging
# Replace every placeholder with approved non-secret values or protected secret references.
docker compose --env-file .env.staging --profile edge up -d --build
```

This command builds a local rehearsal image. It is not immutable registry publication or production evidence.

For a real release candidate, a separate protected process must:

1. build from an accepted, protected Git commit;
2. publish an immutable image digest with SBOM and provenance;
3. deploy that exact digest to isolated staging without rebuilding;
4. configure the canonical API and OIDC boundaries;
5. run browser, contract, identity, realtime, order-safety, accessibility, and failure-path tests;
6. capture release identity and rollback evidence;
7. promote the identical digest only after approval.

Do not use the internal-development Caddy certificate profile for public clients.

## Production gates

Production is blocked until all applicable gates pass:

1. **Source authority** — protected main, exact-head review, merge-result CI, clean dependency graph, and no competing frontend authority.
2. **API contract** — generated client matches the accepted `beyvra-backend` OpenAPI contract; no invented or unimplemented endpoints are presented as available.
3. **Identity and session safety** — canonical issuer, PKCE S256, allowlisted redirects, protected deep links, CSRF/session controls, multi-tab logout, expiry handling, and no browser token/secret storage.
4. **Capability truth** — the UI reads backend capabilities and renders simulation, live-trading, deposit, withdrawal, maintenance, and degraded states exactly as returned. The frontend cannot enable a capability.
5. **Order safety** — preview → confirm → submit, idempotency, preview invalidation, duplicate-click protection, buying-power/fee visibility, cancel/replace state handling, and unknown-outcome reconciliation are proven end to end.
6. **Financial controls** — no real-money provider or trading activation without legal, compliance, risk, security, and business approval plus backend enforcement.
7. **Quality** — lint, type checking, unit/component, contract, chart, realtime, browser, accessibility, localization, public-error, and production-build gates pass on the release commit.
8. **Security** — dependency audit, secret scan, SAST, container scan, CSP review, secure headers, non-root runtime, minimal image, and public-bundle inspection pass.
9. **Artifact integrity** — immutable digest, source revision label, SBOM, provenance/attestation, vulnerability decision, and checksums are recorded.
10. **Staging acceptance** — real API and identity integration, migrations, test accounts, mobile/desktop browsers, degraded dependencies, retries, stale data, offline behavior, and no-effect financial/provider tests pass.
11. **Observability** — release identity, frontend errors, latency, API failures, auth failures, realtime state, and user-safe incident correlation are visible without leaking secrets or prohibited customer data.
12. **Recovery** — previous compatible frontend digest, API compatibility, configuration, database recovery ownership, and tested rollback/read-back are documented.
13. **Activation approval** — production deployment and live-trading capability activation are separate, explicit changes. Deploying the website does not activate live trading.

These are required release controls, not claims that the current branch has already satisfied them. `DEPLOYMENT.md` records `PRODUCTION_DEPLOYMENT_STATUS=NOT_CERTIFIED`.

## Security rules

- Never commit `.env` files, credentials, private keys, access tokens, refresh tokens, customer exports, financial records, or secret-bearing logs.
- Never trust a browser role, account ID, price, fee, balance, or order state without backend validation.
- Never call a live provider from browser code.
- Never represent an accepted HTTP request as a completed trade without authoritative backend/provider state.
- Never retry an ambiguous effectful operation from the UI as though it were known to have failed.
- Redact authorization headers, cookies, identity codes, financial payloads, and personal data from telemetry.
- Keep production, staging, test, and development configuration distinct.

## Repository layout

```text
.
├── client-portal/           # React/Vite browser application
│   ├── src/                 # UI, API client, charts, realtime, state and routes
│   ├── e2e/                 # Playwright browser acceptance
│   ├── scripts/             # contract, identity, i18n, error and audit gates
│   ├── Dockerfile.prod      # production static image
│   └── package.json         # application commands and dependency authority
├── deploy/                  # Caddy and deployment support
├── docs/                    # UX, identity, chart and platform documentation
├── docker-compose.yaml      # loopback-first frontend and optional edge
└── DEPLOYMENT.md            # staging rehearsal and release requirements
```

## Change policy

Use short-lived branches and pull requests. Keep each change reviewable, update tests and documentation with behavior, and preserve backward-compatible API handling during coordinated backend/frontend releases.

Merging this repository never authorizes a production deployment, a provider credential, a financial mutation, or live trading.
