# Repository Profile — `beyvra-frontend`

## Identity

- **Repository:** `appolon1908-hue/beyvra-frontend`
- **Category:** Product frontend — trading platform
- **Visibility:** Public
- **Default branch:** `main`
- **Authority:** Principal source repository for Beyvra browser experiences and frontend release artifacts
- **Executable application:** `client-portal/`

## Current release truth

The repository contains a current-main, immutable, read-only frontend release and certification chain. Source merge or CI success alone does not certify a deployed runtime and does not authorize live trading, real money, deposits, withdrawals, payments, transactional email, external execution, or provider activation.

```text
REPOSITORY_AUTHORITY=DEFINED
FRONTEND_RELEASE_MODEL=IMMUTABLE_SHA_AND_DIGEST
CURRENT_DEPLOYMENT_CLASS=READ_ONLY
RUNTIME_PRODUCTION_CERTIFICATION=REQUIRES_EXACT_EXTERNAL_EVIDENCE
LIVE_TRADING_ACTIVATION=NOT_AUTHORIZED
PROVIDER_CREDENTIALS_IN_BROWSER=PROHIBITED
```

## Purpose

Provide the responsive Beyvra browser experience for market exploration, account and portfolio presentation, safe order-entry workflows, positions, activity, compliance, support, and authorized operator surfaces.

## Owns

- Browser rendering, interaction, navigation, accessibility, localization, and responsive/PWA behavior
- Preview → confirm → submit workflow presentation
- Typed same-origin API and subscribe-only realtime clients
- Loading, unavailable, stale, partial, restricted, and unknown-outcome states
- Frontend image construction, release identity, read-only deployment checks, and rollback evidence

## Does not own

- Authentication, authorization, tenant or account ownership decisions
- Authoritative balances, buying power, positions, risk, compliance, orders, executions, fees, ledgers, or reconciliation
- Provider credentials, broker connectivity, payment rails, custody, databases, or durable browser tokens
- Live-trading, real-money, provider, DNS, ingress, or production-traffic activation

## Canonical integrations

- `appolon1908-hue/beyvra-backend` — backend and business-authority boundary
- `https://auth.codestra.co/realms/codestra` — canonical OIDC issuer
- Same-origin `/api` and `/ws` paths through the Beyvra frontend origin
- Protected `staging-readonly` and `production-readonly` release environments

The browser must not call broker APIs, databases, Odoo, n8n, Middleware, or private service ports directly. Tokens must not be persisted in `localStorage` or `sessionStorage`.

## Production gates

A promotable frontend candidate must be built from the exact protected-main SHA, produce an immutable image digest, pass required exact-head, validation, secret, container, and certification checks, bind to an exact signed backend certification, prove same-origin and security-header behavior, reject mutations in read-only mode, and complete rollback rehearsal. Production promotion must reuse the same staging-certified digest without rebuilding or retagging it.

## Current product priorities

1. Complete same-origin BFF session, CSRF, timeout, offline mutation, protected deep-link, and multi-tab logout behavior.
2. Reconcile the frontend endpoint registry with the current canonical backend OpenAPI contract.
3. Complete evidence-led market, portfolio, safe-order, activity, compliance, and operator experiences without fabricating unavailable data.
4. Keep every financial or provider capability fail-closed until separately certified and activated.
5. Maintain WCAG-oriented accessibility, mobile behavior, performance budgets, and explicit degraded-state coverage.

## Governance

- All changes flow through pull requests against protected `main`.
- Required checks and independent review apply to the exact head; head movement invalidates stale review evidence.
- Historical stacked branches are not production authority and must not be force-merged into current `main`.
- Never commit secrets, private keys, customer data, database dumps, provider credentials, or secret-bearing runtime evidence.
- Repository changes do not by themselves deploy software or alter live infrastructure.

## Related documentation

- `README.md`
- `DEPLOYMENT.md`
- `docs/PRODUCTION-READINESS-2026-09-03.md`
- `docs/PRODUCTION-READONLY-PROMOTION.md`
- `docs/FRONTEND-HIGH-MEDIUM-LOW-ROADMAP.md`
- `docs/FRONTEND-PRODUCTION-GATES.md`
