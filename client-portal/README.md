# Beyvra Client Portal

React, TypeScript, and Vite browser application for the authenticated Beyvra platform.

The repository-level authority, API boundary, security model, deployment process, and production gates are documented in [`../README.md`](../README.md). This directory owns frontend presentation and interaction only; `appolon1908-hue/beyvra-backend` remains authoritative for accounts, balances, positions, orders, executions, permissions, risk, compliance, audit, and provider state.

## Requirements

- Node.js compatible with the committed lockfile and Vite toolchain
- npm
- an approved HTTPS Beyvra API or same-origin `/api` proxy
- an approved `wss://` realtime endpoint when realtime is enabled

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

The development server uses port `8080` by default.

## Validate

```bash
npm run lint
npm run typecheck
npm run errors:check
npm run brand:check
npm run i18n:check
npm run test:errors
npm run test:realtime
npm run test:chart
npm run test:contract
npm run build
npm run test:e2e
npm run audit:gate
```

The contract, realtime, chart, browser, accessibility, localization, safe-error, brand, and dependency gates must pass on the exact release commit. A local build is not production evidence.

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

## Production image

```bash
npm ci
npm run build
docker build -f Dockerfile.prod -t beyvra-frontend:local .
```

Production uses an immutable registry digest, non-secret runtime configuration, TLS at the approved edge, a reviewed CSP, and staging acceptance before promotion. See [`../DEPLOYMENT.md`](../DEPLOYMENT.md).

Deploying this portal never enables live trading. Capability activation is a separate backend-enforced and explicitly approved change.