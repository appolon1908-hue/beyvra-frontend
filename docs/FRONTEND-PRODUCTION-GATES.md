# Beyvra Frontend Production Gates

These gates apply to any Beyvra frontend candidate proposed for integrated staging or production read-only promotion. They do not authorize live trading or real-money activation.

## Evidence record

Every claimed gate must identify exact immutable evidence:

```text
GATE_NAME=
STATUS=PASS|FAIL|BLOCKED|NOT_RUN
FRONTEND_SOURCE_SHA=
FRONTEND_IMAGE_DIGEST=
PAIRED_BACKEND_SOURCE_SHA=
PAIRED_BACKEND_IMAGE_DIGEST=
ENVIRONMENT=
DEPLOYMENT_REVISION=
WORKFLOW_RUN=
TEST_COMMAND=
TIMESTAMP_UTC=
RESPONSIBLE_REVIEWER=
EVIDENCE_REFERENCES=
```

A gate is `PASS` only when the exact source/image tuple, environment, command or workflow, timestamp, reviewer, and supporting evidence are present. Blank, mutable, inferred, or mismatched identity is a failure.

## Protected source gates

Every pull request to protected `main` must pass the repository’s exact required checks for its current head, including:

- `exact-head-base-ci`
- `secrets`
- `validate`

Release-affecting changes must additionally pass the applicable container and static-certification jobs. Any head movement invalidates prior exact-head evidence and requires the checks and independent review to run again.

The validation path must cover, as applicable:

```text
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

Contract and browser E2E checks require an accepted backend schema and approved integrated origin. Fixture-only tests are not runtime certification.

## Request and session boundary

Required proof:

- all production browser API requests use the same-origin `/api` boundary;
- all production browser realtime connections use the same-origin `/ws` boundary;
- authenticated requests use secure cookies and `credentials: "include"`;
- no bearer, refresh, or ID token exists in localStorage, sessionStorage, IndexedDB, Cache Storage, browser logs, application state, or URLs;
- browser clients do not attach a BFF `Authorization` header;
- unsafe requests require the backend-prescribed CSRF token;
- CSRF bootstrap, API requests, and logout have bounded timeouts and cancellation;
- expired sessions stop mutations and private realtime subscriptions;
- login/recovery remain possible after expired cookies;
- protected deep links survive authentication only after same-origin redirect validation;
- malicious external redirect targets are rejected;
- logout and logout-all revoke server state and clear every browser tab.

## Storage, cache, and offline safety

```text
AUTH_LOCAL_STORAGE_ENTRIES=0
FINANCIAL_LOCAL_STORAGE_ENTRIES=0
SENSITIVE_SESSION_STORAGE_ENTRIES=0
SENSITIVE_INDEXED_DB_ENTRIES=0
SENSITIVE_CACHE_STORAGE_ENTRIES=0
OFFLINE_MUTATION_QUEUE=DISABLED
ORDER_BACKGROUND_SYNC=DISABLED
FINANCIAL_BACKGROUND_SYNC=DISABLED
```

The service worker must exclude API, WebSocket, login, registration, recovery, logout, session, and every `no-store` response. Offline state must block financial commands before CSRF bootstrap or network dispatch. There is no automatic replay after reconnect.

## API and backend-contract gate

- The frontend endpoint registry is checked against an accepted, checksum-verified backend OpenAPI artifact from an exact protected backend SHA.
- Literal, template-generated, and centralized client paths are included in discovery.
- Every called endpoint and method exists in the accepted schema, or the frontend fails closed locally without dispatching a request.
- Browser code has no direct provider, database, Odoo, n8n, Middleware, broker, custody, payment, or private-service endpoint.
- Contract evidence is regenerated whenever the paired backend authority changes.
- A stale schema snapshot or a path-count floor by itself is not sufficient certification.

## Financial command gate

Required integrated evidence for order or money-affecting UI:

- server preview precedes confirmation and submission;
- economic values are decimal strings;
- only backend-advertised order types and time-in-force values are selectable;
- quote age and preview expiration are visible;
- buying power before/after, fees, risk, and compliance decisions come from the backend or show unavailable;
- the idempotency key is stable across duplicate clicks and unknown outcomes;
- preview version or required optimistic precondition is supplied;
- economic changes invalidate the preview;
- timeout never triggers automatic resubmission;
- cancel and replace use current server state and required version checks;
- partial fills, rejection, reconciliation-required, and unknown outcomes are explicit;
- no optimistic fill or client-authored authoritative financial result appears.

```text
CLIENT_BUYING_POWER_AUTHORITY=DISALLOWED
CLIENT_FEE_AUTHORITY=DISALLOWED
CLIENT_RISK_AUTHORITY=DISALLOWED
CLIENT_COMPLIANCE_AUTHORITY=DISALLOWED
CLIENT_SETTLEMENT_AUTHORITY=DISALLOWED
FABRICATED_FINANCIAL_VALUES=0
```

## Realtime gate

Required proof:

- one public route represents one protocol and gateway;
- short-lived server-issued authorization is user-, tenant-, and channel-scoped;
- the server authorizes subscriptions and rejects client publication to trusted channels;
- the browser tracks per-channel sequence/cursor state, rejects duplicates and stale events, detects gaps, pauses affected deltas, restores an authoritative snapshot, and resumes safely;
- reconnect uses bounded exponential backoff and obtains fresh authorization where required;
- logout and session expiration disconnect private channels;
- origin, message-size, channel-count, heartbeat, and rate limits are enforced;
- query parameters containing temporary tickets are absent from logs or redacted.

See `REALTIME-OWNERSHIP-BOUNDARY.md`.

## Public-edge and runtime gate

The exact deployed frontend image must prove:

- non-root runtime;
- read-only root filesystem;
- dropped Linux capabilities and `no-new-privileges`;
- immutable source and image identity readback;
- `/healthz`, runtime configuration, and release identity are correct;
- CSP, HSTS, MIME-sniffing protection, referrer policy, and permissions policy are present;
- static assets use safe immutable caching while shell/configuration are revalidated;
- API and sensitive responses remain `no-store`;
- WebSocket upgrades and bounded proxy timeouts work;
- host/origin allowlists, body-size limits, and authentication/order rate limits are enforced by the appropriate edge/backend authority;
- no internal provider or service port is publicly exposed.

## Accessibility and responsive gate

Require WCAG 2.2 AA-oriented evidence for authentication, navigation, market explorer, charts, order ticket, confirmation, portfolio, watchlists, compliance, activity, and operator surfaces.

Evidence must cover:

- keyboard navigation and visible focus;
- screen-reader naming and announcements;
- focus restoration and modal/drawer containment;
- contrast, zoom, reflow, and reduced motion;
- accessible chart descriptions and equivalent data tables;
- mobile viewports and touch targets;
- error identification without color alone.

## Performance gate

Before broad rollout, numeric budgets must be approved and enforced as blocking thresholds:

```text
INITIAL_JS_BUDGET_KB=
ROUTE_CHUNK_BUDGET_KB=
LCP_TARGET_MS=
INP_TARGET_MS=
CLS_TARGET=
API_P95_TARGET_MS=
ORDER_PREVIEW_P95_TARGET_MS=
REALTIME_RECOVERY_TARGET_MS=
```

Blank or informational-only thresholds are not a production performance gate.

## Immutable release and rollback gate

A staging-readonly candidate must:

1. originate from the exact current protected-main SHA;
2. build once from immutable bases and committed dependencies;
3. produce and record one immutable frontend digest;
4. bind to an exact signed backend certification;
5. verify source/digest readback, same-origin routing, security headers, read-only capabilities, mutation rejection, monitoring, and zero live effects;
6. rehearse rollback to the previous exact digest, verify integrity and health, record RTO/RPO, and restore the candidate;
7. sign the successful certification evidence.

Production-readonly promotion must reuse that exact staging-certified digest without rebuilding or retagging it and must remain within the separately approved read-only canary percentage. Stop and roll back on any identity mismatch, readiness failure, monitoring loss, security regression, accepted mutation, data drift, latency/error regression, or movement in a live-effect counter.

## Email boundary

Transactional email UI work may expose preferences and reconciled delivery state only through the Beyvra backend. It must not place SMTP, provider, Middleware, n8n, or Postal credentials in the browser. Mandatory security classes remain enabled. External delivery stays disabled until a separate backend/provider activation is approved and evidenced.

## Acceptance rule

The frontend is not approved for external simulation users until every applicable High-priority gate is `PASS` for the same exact frontend/backend source and image tuple. Source merge alone is never runtime certification, production approval, or live-trading authorization.
