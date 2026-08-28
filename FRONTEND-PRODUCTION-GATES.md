# Frontend Production Gates

This document captures readiness checks for frontend production simulation and launch.

## Gate evidence record

Every gate must have a completed record before approval. A gate is `PASS` only when
the required code proof and runtime evidence are attached.

```text
GATE_NAME=
STATUS=PASS|FAIL|BLOCKED|NOT_RUN
COMMIT_SHA=
CONTAINER_DIGEST=
ENVIRONMENT=
DEPLOYMENT_REVISION=
TEST_COMMAND=
TEST_RUN_URL=
TIMESTAMP_UTC=
RESPONSIBLE_REVIEWER=
EVIDENCE_URLS=
```

The record must use an exact immutable commit SHA and container digest, identify the
environment and deployment revision, link the command and run, include a UTC timestamp
and named reviewer, and attach the evidence used for the decision.

## Required CI

```text
npm ci
npm run typecheck
npm run lint
npm run build
npm run test
npm run test:contract
npm run test:realtime
npm run test:chart
npm run test:e2e
npm audit --audit-level=critical
```

Additional mandatory checks:

- Gitleaks
- production container build
- Trivy HIGH/CRITICAL scan
- API contract-drift validation
- service-worker cache-policy tests
- accessibility tests
- mobile viewport tests
- bundle-size/performance budget
- exact-head/base verification

## Browser and BFF safety

- browser stores no bearer, refresh, or ID tokens
- no BFF `Authorization` headers are attached by the browser
- unsafe requests require CSRF
- CSRF bootstrap has a bounded timeout
- expired cookies do not block login/recovery
- protected deep links survive authentication
- malicious external redirects are rejected
- multi-tab logout clears authenticated UI state

## Mandatory release blockers

Release is blocked until frontend code and tests prove all of the following:

- same-origin BFF access through `/api`
- no browser-stored bearer, refresh, or ID tokens
- no caching of authentication or financial responses
- no offline financial mutation replay
- order-preview expiration and idempotent submission
- `If-Match` conflict handling
- WebSocket gap detection and recovery
- login, registration, logout, MFA, and password-reset tests
- WCAG 2.2 AA evidence
- numeric, measured performance budgets enforced as blocking thresholds
- the realtime ownership boundary in [docs/REALTIME-OWNERSHIP-BOUNDARY.md](docs/REALTIME-OWNERSHIP-BOUNDARY.md): browser clients are subscribe-only for trusted channels and user mutations use authenticated REST APIs

## Financial browser safety gates

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

- `beyvra.com/api/*` routes to the BFF
- `/api` remains same-origin
- WebSocket upgrade and timeout configuration
- CSP
- HSTS
- secure cookie flags
- trusted-origin configuration
- host allowlisting
- API/body-size limits
- authentication and order rate limits
- no internal provider endpoint exposed publicly

## Authentication cutover evidence

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

## Email gates

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
EXTERNAL_DELIVERY_ENABLED=false
DELIVERY_KILL_SWITCH=ENABLED
TRACKING_HOST_TLS=PASS
```

The email environment must document the actual variable names used by the deployment.
The required state is unambiguous: external delivery is disabled and the delivery kill
switch is enabled until explicit approval.

## Performance budgets

Values may remain blank only while staging measurement is in progress. Before
production approval, every value must be numeric, approved, and enforced as a
blocking threshold in CI or the deployment gate.

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

Blank or non-blocking performance thresholds are a production release failure.

## Accessibility gate

Require WCAG 2.2 AA evidence for:

- authentication
- market explorer
- trading chart
- order ticket
- order confirmation
- portfolio
- watchlists
- compliance
- operator console

Evidence must cover:

- keyboard navigation
- screen-reader compatibility
- focus management
- contrast
- zoom
- reduced motion
- accessible chart-table behavior

## Acceptance rule

The frontend is not ready for external simulation users until all production gates pass and all required evidence is recorded and reviewed.
