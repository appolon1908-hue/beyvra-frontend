# AGENTS.md

This repository is the principal source authority for the Beyvra browser application and its immutable frontend release artifacts. The executable React and TypeScript application lives under `client-portal/`.

## Source authority

- Frontend source and browser release artifacts: `appolon1908-hue/beyvra-frontend`
- Backend business and security authority: `appolon1908-hue/beyvra-backend`
- Canonical OIDC issuer: `https://auth.codestra.co/realms/codestra`
- Browser API boundary: same-origin `/api`
- Browser realtime boundary: same-origin `/ws`
- Current release class: read-only until a separate activation release is approved

A source merge, successful CI run, image tag, reachable URL, or frontend control never authorizes live trading, real money, provider activation, external execution, deposits, withdrawals, payments, transactional email, DNS changes, or traffic promotion.

## Project layout

- Application source: `client-portal/src/`
- Public assets and locales: `client-portal/public/`
- Unit and component tests: colocated under `client-portal/src/`
- Browser tests: `client-portal/e2e/`
- Build configuration: `client-portal/package.json`, `client-portal/vite.config.ts`
- Production image: `client-portal/Dockerfile.prod`
- Canonical release Compose: `docker-compose.yaml`
- Release and deployment documentation: `README.md`, `DEPLOYMENT.md`, `docs/`
- Release verification scripts: `operations/`, `scripts/`

## Working conventions

1. Start from current protected `main`. Do not revive or merge historical stacked branch history into a new candidate.
2. Keep each pull request narrow, reviewable, and tied to an exact base and head SHA.
3. Prefer existing React, TypeScript, Redux Toolkit, TanStack Query, Ant Design, ECharts, i18next, Vitest, and Playwright patterns.
4. Preserve the public/private route split and lazy-loading boundaries already defined in `client-portal/src/App.tsx`.
5. Route user-visible failures through the existing safe-error system. Never display stack traces, credentials, provider topology, private identifiers, or secret-bearing evidence.
6. Update localization catalogs and public-identity checks whenever user-visible text changes.
7. Use decimal strings for money, quantity, price, fee, and rate inputs. Do not introduce floating-point financial authority in the browser.
8. Use canonical backend identifiers. A display symbol must never become the sole instrument or account identity.
9. Missing, stale, partial, restricted, or unpriced evidence must be shown explicitly. Never replace unavailable financial evidence with `0.00` or fabricated values.

## Authentication and session rules

- Human authentication is delegated to the same-origin Keycloak BFF flow.
- Login begins through the backend OIDC route, preserving only validated same-origin deep links.
- Browser requests use secure session cookies with `credentials: "include"`.
- Browser code must not store bearer, refresh, or ID tokens in `localStorage`, `sessionStorage`, IndexedDB, Cache Storage, logs, URLs, or application state.
- Browser API clients must not attach a BFF `Authorization` header.
- Unsafe requests require the backend-prescribed CSRF token and a bounded request timeout.
- Session expiration must stop mutations, clear authenticated UI state, disconnect private realtime subscriptions, and retain only a safe same-origin return target.
- Logout and logout-all use backend session endpoints. Do not implement a frontend-only teardown that reports success before server revocation.
- Multi-tab logout must clear authenticated state in every open tab.

## Financial and command safety

- The backend owns authentication, authorization, tenant/account ownership, balances, buying power, positions, orders, executions, fees, ledgers, risk, compliance, reconciliation, audit, and provider calls.
- Client-side guards are defense in depth, never authorization.
- Every financial command remains blocked while offline. Do not add mutation replay queues or background sync for orders or money movement.
- Order entry follows server preview → user confirmation → idempotent submit → server receipt → lifecycle tracking.
- Preserve the same idempotency key after a timeout or unknown outcome. Never auto-resubmit or create optimistic fills.
- Economic field changes invalidate an existing preview. Cancel and replace commands require the current server version or precondition required by the accepted backend contract.
- Client code must not calculate authoritative buying power, fees, settlement state, portfolio value, risk, compliance eligibility, or provider availability.

## Realtime rules

- Browser realtime clients are subscribe-only for trusted market, news, order, execution, position, account, and compliance channels.
- User commands use authenticated REST APIs, never WebSocket publication.
- Use only the protocol, route, channels, envelopes, authorization endpoints, and snapshot providers advertised by the accepted backend release.
- Track per-channel sequences, reject duplicates and stale events, detect gaps, pause affected deltas, and recover from an authoritative REST snapshot before resuming.
- Disconnect on logout or session expiration. Use bounded exponential backoff and visible connection-health states.
- Never route Centrifugo frames to Django Channels or expose one public path as two protocols.

See `docs/REALTIME-OWNERSHIP-BOUNDARY.md`.

## Build and validation

Run application commands from `client-portal/` unless noted otherwise:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm run test
npm run test:errors
npm run test:realtime
npm run test:chart
npm run i18n:check
npm run brand:check
npm run audit:gate
```

Use the accepted backend schema for contract validation and an approved integrated origin for Playwright. Do not claim end-to-end certification from fixture-only tests or a source-only build.

Before requesting review, also verify as applicable:

- exact head/base and ancestry
- generated API contract drift
- service-worker sensitive-cache exclusions
- offline mutation blocking
- secrets scan
- production image build and vulnerability scan
- mobile and keyboard behavior
- accessibility evidence
- bundle/performance budgets
- immutable source and image identity

## Release rules

- Protected `main` is the only source authority for a release candidate.
- Use committed lockfiles and immutable build bases.
- Build the frontend image once, record its exact digest, and bind it to an exact signed backend certification.
- Staging must verify source/digest readback, same-origin routing, security headers, read-only capabilities, rejected mutations, and zero live effects.
- Rehearse rollback to the previous exact image and restore the candidate before promotion.
- Production read-only promotion reuses the staging-certified digest without rebuilding or retagging it.
- Stop on any source/digest mismatch, missing attestation, failed readiness check, security-header regression, mutation acceptance, monitoring loss, or live-effect movement.

See `docs/PRODUCTION-READINESS-2026-09-03.md`, `docs/PRODUCTION-READONLY-PROMOTION.md`, and `docs/SIGNED-PRODUCTION-READONLY-PROMOTION.md`.

## Change completion

A logical change is complete only when its source, tests, documentation, contract evidence, and release impact are committed and pushed to the authoritative branch. Keep draft PRs draft while material blockers remain. Never bypass protected review or required checks, and never represent a pending or blocked runtime step as complete.
