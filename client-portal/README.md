# Beyvra Client Portal

React, TypeScript, and Vite browser application for the authenticated Beyvra platform.

The repository-level authority, API boundary, security model, deployment process, and production gates are documented in [`../README.md`](../README.md). This directory owns frontend presentation and interaction only; `appolon1908-hue/beyvra-backend` remains authoritative for accounts, balances, positions, orders, executions, permissions, risk, compliance, audit, and provider state.

## Requirements

- Node.js compatible with the committed lockfile and Vite toolchain
- npm
- an approved HTTPS Beyvra API or same-origin `/api` proxy for integration tests
- an approved `wss://` realtime endpoint when realtime is enabled
- a running integrated frontend/backend origin for Playwright acceptance

## Configure

```bash
cp .env.example .env
npm ci
```

Public configuration includes:

```text
VITE_API_BASE_URL=/api
VITE_SOCKET_BASE_URL=AUTO
VITE_PUBLIC_SITE_URL=https://staging.beyvra.com
VITE_BRAND_NAME=Beyvra
```

Do not place an OIDC client secret, provider credential, database URL, private service URL, password, or bearer token in a `VITE_*` variable. Vite configuration is delivered to the browser.

## Develop

```bash
npm run dev
```

The development server uses port `8080` by default. This command starts only the Vite frontend; it does not start `beyvra-backend` or provide the demo-session API required by authenticated Playwright tests.

## Validate source

```bash
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

The full contract gate requires the accepted backend OpenAPI schema:

```bash
API_SCHEMA_URL=https://YOUR_APPROVED_STAGING_API/api/schema/ npm run test:contract
```

The checker reads the real `src/api/endpoints.ts` definitions plus direct request literals, refuses empty or unexpectedly small discovery, and compares those paths with the backend schema.

Playwright requires a running frontend at `E2E_BASE_URL`, a same-origin `/api` route to a non-production backend, and `POST /api/v1/demo/sessions` for guest-session bootstrap:

```bash
E2E_BASE_URL=https://YOUR_APPROVED_STAGING_DOMAIN npm run test:e2e
```

`E2E_SKIP_GUEST_BOOTSTRAP=true` is valid only for a deliberately unauthenticated test subset. It must not be used as evidence for authenticated, portfolio, order, or session behavior.

The contract, realtime, chart, browser, accessibility, localization, safe-error, brand, and dependency gates must pass on the exact release commit with their stated prerequisites. A local build or source-only parser pass is not production evidence.

## Authentication

Human authentication starts through the same-origin backend/edge route:

```text
GET /api/v1/auth/oidc/login/?next=/platform
```

The redirect must use the canonical issuer `https://auth.codestra.co/realms/codestra` and Authorization Code Flow with PKCE S256. The portal must not store provider or identity secrets and must not use browser-controlled claims as authorization.

## API and realtime

- API calls use the same-origin `/api` boundary by default.
- The canonical public backend authority is `https://api.beyvra.com`.
- Realtime is an enhancement, not the source of record; the application must recover authoritative state from the API after disconnects or gaps.
- The UI must present loading, stale, degraded, unavailable, indeterminate, and reconciliation states explicitly.
- Browser code must not call broker/provider APIs, databases, Odoo, n8n, or private infrastructure endpoints directly.

## Image rehearsal and production requirement

Source-side rehearsal:

```bash
npm ci
npm run build
docker build -f Dockerfile.prod -t beyvra-frontend:rehearsal .
```

The local tag is not a production artifact. A certified production release would require a protected build from an accepted commit, an immutable registry `repository@sha256:...` digest, SBOM, provenance, vulnerability disposition, isolated staging acceptance, rollback evidence, explicit approval, and post-deployment digest readback. The current repository does not prove that such an artifact has already been published or deployed.

See [`../DEPLOYMENT.md`](../DEPLOYMENT.md), which records `PRODUCTION_DEPLOYMENT_STATUS=NOT_CERTIFIED`.

Deploying this portal never enables live trading. Capability activation is a separate backend-enforced and explicitly approved change.
