# Beyvra frontend deployment and release requirements

## Current truth

```text
SOURCE_BUILD_REHEARSAL=AVAILABLE
LOCAL_COMPOSE_REHEARSAL=AVAILABLE
IMMUTABLE_IMAGE_PUBLICATION=NOT_PROVEN_BY_THIS_REPOSITORY
PROTECTED_PRODUCTION_DEPLOYMENT=NOT_PROVEN_BY_THIS_REPOSITORY
PRODUCTION_DEPLOYMENT_STATUS=NOT_CERTIFIED
LIVE_TRADING_ACTIVATION=NOT_AUTHORIZED
```

This document separates source-side build and staging rehearsal from a certified production release. A local image, successful Compose start, reachable URL, or merged pull request is not an immutable production artifact and does not authorize deployment or live trading.

## Build and validate source

Run from the repository root:

```sh
cd client-portal
npm ci
npm run lint
npm run typecheck
npm run build:prod
docker build -f Dockerfile.prod -t beyvra-frontend:rehearsal .
```

`beyvra-frontend:rehearsal` is a local test tag only. It must not be recorded as a production release or used as proof of registry publication, provenance, vulnerability acceptance, or rollback readiness.

The Nginx entrypoint may inject approved public runtime configuration into `index.html`. Never commit a populated `.env` file or inject a password, signing key, provider credential, database connection, identity token, or private service address into browser configuration.

The generated application is a single-page app; Nginx routes unknown browser paths to `index.html`.

## API-contract prerequisite

Validate source endpoint discovery without a backend:

```sh
node scripts/check-api-contract.mjs --source-only
```

The full contract gate requires the accepted `beyvra-backend` OpenAPI schema to be reachable. Supply its exact schema URL:

```sh
API_SCHEMA_URL=https://YOUR_APPROVED_STAGING_API/api/schema/ npm run test:contract
```

`test:contract` parses the real frontend endpoint registry plus direct request literals and compares them with the backend schema. It fails when no frontend endpoints or no backend paths are discovered. A source-only pass does not replace the full schema comparison.

## Playwright integration prerequisite

`npm run test:e2e` does not start the frontend or backend. It requires:

- a running Beyvra frontend at `E2E_BASE_URL`;
- the same-origin `/api` route connected to an approved non-production backend;
- `POST /api/v1/demo/sessions` available for the Playwright guest-session bootstrap;
- test data and capabilities appropriate to the selected suite;
- no live provider or real-money trading capability.

Run against an integrated staging origin:

```sh
E2E_BASE_URL=https://YOUR_APPROVED_STAGING_DOMAIN npm run test:e2e
```

For a deliberately unauthenticated subset that does not require a guest session, the global setup can be bypassed explicitly:

```sh
E2E_SKIP_GUEST_BOOTSTRAP=true \
E2E_BASE_URL=https://YOUR_APPROVED_STAGING_DOMAIN \
npm run test:e2e -- --grep '@public'
```

Do not use `E2E_SKIP_GUEST_BOOTSTRAP=true` to claim authenticated, order, portfolio, or session acceptance.

## Local or isolated staging HTTPS rehearsal

Copy `.env.staging.example` to `.env.staging`, replace placeholders with approved non-secret values or external secret references, ensure the external `trading-network` exists, and start the edge profile:

```sh
cp .env.staging.example .env.staging
docker compose --env-file .env.staging --profile edge up -d --build
curl --fail https://YOUR_STAGING_DOMAIN/
```

`deploy/Caddyfile.public` can obtain a public certificate when DNS points to the rehearsal host. `deploy/Caddyfile.staging` issues an internal certificate and must not be used for public clients. Ports 80 and 443 must be free or owned by the approved existing edge.

This Compose command builds locally. It does **not** demonstrate immutable registry publication or production promotion.

## Required production artifact controls

Before any production deployment is represented as approved, a separate release process must prove all of the following on one unchanged protected commit:

1. exact pull-request head and merge-result CI pass;
2. the accepted main-branch commit is recorded;
3. the image is built from that commit in protected automation;
4. the registry returns an immutable `repository@sha256:...` digest;
5. source revision, version, and source repository labels match the accepted commit;
6. SBOM, provenance/attestation, checksums, and vulnerability disposition are retained;
7. the exact digest is deployed to isolated staging without rebuilding;
8. API contract, OIDC/PKCE, browser, accessibility, realtime, degraded-state, and order-safety acceptance pass;
9. the previous compatible digest and configuration are recorded and rollback is rehearsed;
10. production approval names the exact digest and change record;
11. post-deployment readback proves the running digest and release identity;
12. live-trading and provider capabilities remain separate backend-controlled approvals.

The current repository source describes these controls but does not, by itself, prove that an immutable image has been published or deployed to production.

## Content Security Policy and public edge

Serve the approved artifact behind TLS and deploy a reviewed Content Security Policy only after enumerating every required third-party origin. TradingView, analytics, support widgets, market/news providers, and any other external origin must be approved individually; do not add wildcard origins merely to make a test pass.

## Rollback

A production release packet must identify:

- previous and candidate immutable image digests;
- compatible public runtime configuration;
- edge/CSP version;
- backend API compatibility range;
- rollback command or deployment action;
- health, version, and post-rollback readback;
- owner and approval record.

A frontend rollback must not alter databases, provider credentials, trading capabilities, or financial records unless a separately approved backend/data change requires its own recovery procedure.
