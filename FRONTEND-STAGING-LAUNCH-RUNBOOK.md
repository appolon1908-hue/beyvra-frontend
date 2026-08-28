# Frontend Staging Launch Runbook

## Purpose

This runbook prepares the Beyvra frontend for staging and simulation-production approval. It does not approve live trading, real-money movement, external execution, deposits, withdrawals, or provider secrets in the browser.

## Required inputs

```text
FRONTEND_COMMIT_SHA=
BACKEND_COMMIT_SHA=
FRONTEND_IMAGE_DIGEST=
BACKEND_IMAGE_DIGEST=
STAGING_BASE_URL=
API_SCHEMA_URL=
API_SCHEMA_FILE=
DEPLOYMENT_REVISION=
RELEASE_OWNER=
REVIEWER=
```

`API_SCHEMA_URL` must point at the same backend candidate that staging will use. For local candidate validation, `API_SCHEMA_FILE` must point at the checked-in `beyvra-v1.yaml` or an `openapi.json` exported from the exact backend commit. A contract check against an old backend is not release evidence.

## Pre-deploy gates

Run from `client-portal`:

```sh
npm ci
npm run typecheck
npm run lint
npm run test:errors
npm run test:realtime
npm run test:chart
npm run audit:gate
API_SCHEMA_FILE="$API_SCHEMA_FILE" npm run test:contract
API_SCHEMA_URL="$API_SCHEMA_URL" npm run test:contract
npm run build
```

Required outcomes:

```text
TYPECHECK=PASS
LINT=PASS
USER_SAFE_ERRORS=PASS
REALTIME_TESTS=PASS
CHART_TESTS=PASS
AUDIT_GATE=PASS
API_CONTRACT=PASS
PRODUCTION_BUILD=PASS
```

The API contract check must report a nonzero frontend route count.

## Runtime configuration

Only public browser configuration may appear in runtime `VITE_*` values.

Required values:

```text
VITE_API_BASE_URL=/api
VITE_SOCKET_BASE_URL=AUTO
VITE_REALTIME_V2_ENABLED=<approved value>
VITE_REALTIME_V2_V1_FALLBACK_ENABLED=false
```

Forbidden in browser runtime config:

```text
API keys
provider credentials
client secrets
signing keys
database credentials
Redis credentials
webhook secrets
private provider URLs
```

## Staging smoke tests

Run against the deployed staging URL:

```sh
BEYVRA_FRONTEND_STAGING_URL="$STAGING_BASE_URL" npm run staging:certify -- --output test-results/staging-frontend-evidence.json
```

```text
FRONTEND_HEALTHZ=PASS|FAIL
SPA_LOAD=PASS|FAIL
CONFIG_JS_NO_STORE=PASS|FAIL
INDEX_HTML_NO_STORE=PASS|FAIL
ASSETS_IMMUTABLE=PASS|FAIL
SAME_ORIGIN_API_PROXY=PASS|FAIL
WEBSOCKET_PROXY=PASS|FAIL
QUERY_STRING_REDACTION=PASS|FAIL
```

Minimum browser workflows:

```text
LOGIN=PASS|FAIL
REGISTRATION=PASS|FAIL
LOGOUT=PASS|FAIL
SESSION_EXPIRY=PASS|FAIL
PASSWORD_RESET=PASS|FAIL
MFA_STEP_UP=PASS|FAIL
PROTECTED_DEEP_LINK=PASS|FAIL
DASHBOARD_LOAD=PASS|FAIL
CHART_LOAD=PASS|FAIL
NOTIFICATIONS=PASS|FAIL
WEBHOOK_MANAGEMENT=PASS|FAIL
SIMULATION_ORDER_PREVIEW=PASS|FAIL
SIMULATION_ORDER_SUBMIT=PASS|FAIL
COMPLIANCE_FLOW=PASS|FAIL
```

## Browser safety checks

Required state:

```text
AUTH_LOCAL_STORAGE_ENTRIES=0
FINANCIAL_LOCAL_STORAGE_ENTRIES=0
SENSITIVE_CACHE_STORAGE_ENTRIES=0
OFFLINE_MUTATION_QUEUE=DISABLED
ORDER_BACKGROUND_SYNC=DISABLED
CLIENT_BUYING_POWER_AUTHORITY=DISALLOWED
CLIENT_FEE_AUTHORITY=DISALLOWED
FABRICATED_FINANCIAL_VALUES=0
```

The browser must not store bearer, refresh, or ID tokens. All financial truth must come from backend contracts.

## Performance and accessibility

Record numeric budgets before external users:

```text
INITIAL_JS_BUDGET_KB=
ROUTE_CHUNK_BUDGET_KB=
LCP_TARGET_MS=
INP_TARGET_MS=
CLS_TARGET=
REALTIME_RECOVERY_TARGET_MS=
```

WCAG 2.2 AA evidence is required for:

```text
authentication
market explorer
trading chart
order ticket
order confirmation
portfolio
watchlists
compliance
operator surfaces
```

## Simulation go/no-go

Approve simulation production only when:

```text
FRONTEND_CI=PASS
BACKEND_CI=PASS
API_CONTRACT=PASS
STAGING_SMOKE=PASS
BROWSER_SAFETY=PASS
ACCESSIBILITY=PASS
PERFORMANCE_BUDGETS=PASS
ROLLBACK_READY=PASS
LIVE_TRADING_ENABLED=false
REAL_MONEY_ENABLED=false
EXTERNAL_EXECUTION_ENABLED=false
DEPOSITS_ENABLED=false
WITHDRAWALS_ENABLED=false
GO_NO_GO=GO
```

Any failed, blocked, stale, or missing evidence item makes the answer `NO_GO`.
