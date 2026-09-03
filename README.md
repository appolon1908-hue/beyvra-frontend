# Beyvra Frontend

Production-oriented React and TypeScript browser application for the Beyvra trading platform.

## Repository authority

`appolon1908-hue/beyvra-frontend` is the principal source repository for Beyvra browser experiences and frontend release artifacts. `appolon1908-hue/beyvra-backend` remains authoritative for authentication enforcement, accounts, balances, positions, orders, executions, risk, compliance, audit, reconciliation, market-data normalization, and provider operations.

A frontend merge, successful build, image tag, or reachable URL does not by itself authorize production deployment or live trading.

## Current release truth

```text
REPOSITORY_AUTHORITY=DEFINED
PRODUCTION_RELEASE=REQUIRES_EXACT_SHA_AND_DIGEST_CERTIFICATION
PRODUCTION_DEPLOYMENT_STATUS=NOT_CERTIFIED_BY_SOURCE_ALONE
DEPLOYMENT_MODE=READ_ONLY_UNTIL_SEPARATE_ACTIVATION
LIVE_TRADING_ACTIVATION=NOT_AUTHORIZED_BY_THIS_REPOSITORY
PROVIDER_CREDENTIALS_ALLOWED_IN_BROWSER=NO
```

The repository contains an immutable release workflow and a read-only deployment authority. Runtime production status must still be established from workflow and server evidence for the exact protected-main commit and image digest.

## Application surfaces

| Surface | Canonical address | Responsibility |
|---|---|---|
| Public application | `https://beyvra.com` | Public and authenticated Beyvra browser experience |
| Trading portal | `https://platform.beyvra.com` | Authenticated customer trading workspace |
| Administration | `https://admin.beyvra.com` | Authorized administration and operations surface |
| Backend API | `https://api.beyvra.com` | Backend and versioned API authority |
| Identity | `https://auth.codestra.co/realms/codestra` | Canonical OIDC issuer |
| Staging | `https://staging.beyvra.com` | Isolated release certification |

The executable browser application is under `client-portal/`.

## Request and identity boundary

The production browser path is same-origin:

```text
Browser
  -> Beyvra frontend origin
  -> /api and /ws reverse-proxy paths
  -> exact paired Beyvra backend candidate
```

Human login starts through:

```text
GET /api/v1/auth/oidc/login/?next=/platform
```

The identity flow uses Authorization Code Flow with PKCE S256. Browser code must never receive provider credentials, database credentials, signing keys, OIDC client secrets, or private infrastructure tokens. Identity tokens must not be stored in `localStorage`.

Frontend API calls default to the same-origin `/api` boundary. Browser code must not call broker APIs, databases, Odoo, n8n, or internal service ports directly.

## Responsibility split

The frontend owns rendering, interaction, responsive behavior, accessibility, typed requests, loading and degraded states, charts, navigation, and safe session-expiration UX.

The backend owns authorization, tenant/account ownership, balances, buying power, positions, orders, executions, fees, ledgers, idempotency, reconciliation, risk, compliance, audit, provider calls, and every decision that can move money or create market exposure.

Client-side validation and disabled buttons are defense in depth, never authorization.

## Runtime and toolchain

The portal uses React 19, TypeScript, Vite, Redux Toolkit, TanStack Query, Ant Design, ECharts, Lightweight Charts, i18next, Vitest, Playwright, and unprivileged Nginx.

Use the committed lockfile and `npm ci`. Do not resolve a new dependency graph during release deployment.

## Local development

```bash
git clone https://github.com/appolon1908-hue/beyvra-frontend.git
cd beyvra-frontend/client-portal
cp .env.example .env
npm ci
npm run dev
```

The development server listens on port `8080` by default.

## Public configuration

Only non-secret browser configuration is allowed:

| Variable | Required production value |
|---|---|
| `VITE_API_BASE_URL` | `/api` |
| `VITE_SOCKET_BASE_URL` | `AUTO` |
| `VITE_PUBLIC_SITE_URL` | Exact public HTTPS origin |
| `VITE_BRAND_NAME` | `Beyvra` |
| `VITE_REALTIME_V2_ENABLED` | `true` |
| `VITE_REALTIME_V2_V1_FALLBACK_ENABLED` | `false` |
| `VITE_DEPLOYMENT_READ_ONLY` | `true` for the current release class |

Never place passwords, API keys, signing keys, bearer tokens, provider credentials, database URLs, private service addresses, or customer data in `VITE_*` variables.

## Validation

Run from `client-portal/`:

```bash
npm ci
npm run build
npm run lint
npm run typecheck
npm run errors:check
npm run brand:check
npm run i18n:check
npm run test:errors
npm run test:realtime
npm run test:chart
node scripts/check-api-contract.mjs --source-only
npm run audit:gate
```

The full API contract gate requires an accepted backend schema:

```bash
API_SCHEMA_URL=https://YOUR_APPROVED_STAGING_API/api/schema/ npm run test:contract
```

Playwright requires a running integrated staging origin and does not start either application:

```bash
E2E_BASE_URL=https://YOUR_APPROVED_STAGING_DOMAIN npm run test:e2e
```

Authenticated browser acceptance requires `POST /api/v1/demo/sessions`. `E2E_SKIP_GUEST_BOOTSTRAP=true` is allowed only for an explicitly unauthenticated test subset.

## Container architecture

`client-portal/Dockerfile.prod` produces the immutable frontend image. The runtime stage:

- runs as unprivileged user `101` on port `8080`;
- supports a read-only root filesystem;
- generates public runtime configuration only under `/tmp`;
- exposes `/healthz`, `/__runtime-config.json`, and `/__release.json`;
- applies CSP, HSTS, MIME-sniffing protection, referrer policy, and permissions policy;
- proxies `/api` and `/ws` to the paired backend over the named private Docker network;
- omits query strings from access logs.

The root `docker-compose.yaml` is the only release Compose authority. It accepts only an immutable `FRONTEND_IMAGE=repository@sha256:...`, has no `build:` directive, binds the candidate to host loopback, drops Linux capabilities, enables `no-new-privileges`, and requires an existing backend network.

Server-side builds, floating image tags, `git pull && docker compose --build`, and duplicate production Compose files are prohibited.

## Immutable release flow

The workflow `.github/workflows/deploy.yml` implements two protected targets:

- `staging-readonly`
- `production-readonly`

A staging release must:

1. select the exact current protected-main source SHA;
2. verify the required source, secret, container, and exact-head checks;
3. build the frontend image once from immutable Node and Nginx base-image digests;
4. publish SBOM and provenance;
5. resolve the registry `repository@sha256:...` digest;
6. prove the image source label matches the selected SHA;
7. deploy without rebuilding;
8. verify the frontend release identity and exact paired backend identity;
9. prove read-only capability state and mutation rejection;
10. retain non-secret release and rollback evidence.

Production promotion must reuse the same staging-certified frontend digest. The workflow rejects rebuilding for `production-readonly`.

## Staging and production execution

Follow [`docs/PRODUCTION-READONLY-PROMOTION.md`](docs/PRODUCTION-READONLY-PROMOTION.md). The protected environments provide server credentials and deployment variables; no populated environment file or private key belongs in this repository.

The deployment script `operations/deploy_immutable_frontend.sh`:

- validates all source SHAs and image digests;
- requires the exact paired backend SHA and digest;
- records the previous immutable frontend candidate;
- starts the candidate with `--no-build`;
- verifies runtime identity, configuration, security headers, backend identity, capabilities, and write rejection;
- automatically restores and re-verifies the previous exact frontend candidate if certification fails;
- never changes Caddy, Kong, DNS, or external traffic weights.

A production read-only canary is capped at one percent and requires independent ingress verification. The repository does not silently route traffic.

## Production gates

Production remains blocked unless all applicable gates are `PASS` for one unchanged candidate:

1. protected-main source and exact-head CI;
2. build, lint, type, unit, chart, realtime, contract, browser, accessibility, and localization checks;
3. secret, dependency, and high/critical container scans;
4. exact frontend source SHA and image digest readback;
5. exact paired backend source SHA and image digest readback;
6. same-origin API and WebSocket routing;
7. secure response headers and immutable public assets;
8. fail-closed frontend and backend capabilities;
9. rejection of every state-changing operation in read-only mode;
10. monitoring continuity and zero movement in live-effect counters;
11. rollback to the previous exact image and successful identity readback;
12. approval for the exact digest and canary target.

## Active-mode boundary

The current release authority does not enable live trading, real money, broker execution, deposits, withdrawals, payments, transactional email, external execution, or legacy realtime fallback.

Those capabilities require a separate reviewed backend and frontend activation release, complete financial-command and idempotency certification, provider authorization, legal/compliance/risk approval, and an explicit production decision.

## Repository layout

```text
.
├── client-portal/                  # React/Vite application and immutable image
├── operations/                    # Candidate deployment and verification
├── docs/                          # Production-readiness and promotion runbooks
├── scripts/                       # Repository authority validation
├── docker-compose.yaml            # Digest-only runtime authority
├── .github/workflows/ci.yml       # Required source/container checks
└── .github/workflows/deploy.yml   # Immutable staging and production promotion
```

## Change policy

Use short-lived branches and pull requests. Keep each change reviewable, update tests and documentation with behavior, preserve backend/frontend contract compatibility, and never weaken a release gate merely to make CI green.

Merging this repository never authorizes a provider credential, financial mutation, live trading, or real-money operation.
