# Beyvra frontend automation-status integration

## Boundary

The Beyvra frontend is a browser client of `appolon1908-hue/beyvra-backend`. It is **not** an n8n client and it does not call Codestra Middleware directly.

```text
Browser
  -> Beyvra backend canonical REST/realtime API
  -> backend authorization and business validation
  -> backend/Middleware event or command boundary
  -> governed n8n orchestration when applicable
  -> Middleware/Beyvra reconciliation
  -> backend safe status projection
  -> browser
```

The frontend receives no n8n service credential, Keycloak Client Credentials secret, Middleware machine token, webhook signing secret, broker credential, wallet credential, provider token or database credential.

## Supported UI surfaces

The frontend may display or submit user intent for non-financial automation features through the backend:

- onboarding checklist and task status;
- compliance-document reminder status;
- support escalation status;
- internal/user notification state;
- report-request and report-readiness state;
- signed-webhook delivery status visible to authorized administrators;
- safe automation incident/status indicators;
- user notification preferences;
- correlation-aware, user-safe errors;
- approved operational acknowledgement or cancellation controls where the backend policy allows them.

The frontend must use the generated/canonical Beyvra API facade and shared realtime client. It must not introduce a second direct HTTP client to n8n or Middleware.

## Status model

The backend may expose a safe status projection using these states:

```text
REQUESTED
QUEUED
RUNNING
WAITING_APPROVAL
WAITING_TIMER
WAITING_RECONCILIATION
COMPLETED
FAILED
CANCELLED
```

User-visible responses contain a safe message and optional correlation/request identifier. They do not expose workflow JSON, execution payloads, lease tokens, internal stack traces, service names, provider responses, PII, financial details or secrets.

## User actions

Frontend actions are user intents sent to the backend, for example:

```text
request onboarding assistance
request a compliance reminder
request a report
acknowledge a security/operations alert
open or escalate a support case
update notification preferences
cancel a not-yet-submitted operational request
```

The backend authenticates the user, resolves the organization/tenant, validates authorization, creates the durable business request and decides whether Middleware/n8n coordination is appropriate.

## Explicit prohibitions

The frontend must never:

- call n8n, Middleware or provider APIs directly;
- store or receive an n8n machine token;
- trigger a trade, order, wallet, deposit, withdrawal, transfer, payment, ledger, custody or chain action through automation;
- present n8n as the authority for an account, trade, wallet, payment or compliance decision;
- render an automation result as successful before the backend confirms the reconciled state;
- trust a caller-supplied organization identifier without backend authorization;
- expose raw execution data, internal service routes or provider secrets;
- approve a protected action solely in client-side state.

## Realtime behavior

Automation status uses the backend's canonical REST and `/ws/v2/` realtime architecture. Sequence gaps trigger the existing REST snapshot recovery mechanism. Duplicate events are ignored by stable event/version identifiers. Browser reconnection never causes a new automation request unless the user explicitly submits a new intent with a new idempotency key.

## Financial safety

The following capabilities remain disabled and have no frontend CTA in this integration:

```text
REAL_TRADING_EXECUTION=false
REAL_WALLET_DEPOSITS=false
REAL_WALLET_WITHDRAWALS=false
REAL_WALLET_TRANSFERS=false
PAYMENT_EXECUTION=false
CUSTODY_EXECUTION=false
CHAIN_BROADCAST=false
```

Demo trading continues through the existing backend demo API only. n8n does not submit demo orders.

## Dependencies

```text
beyvra-backend integration/n8n-automation-v2-20260827
N8N PR #1 governance baseline
Middleware PR #15 operation policy
Keycloak PR #10 machine identities
N8N PR #9 control-plane contract
N8N automation/beyvra-operations-v2-20260827
```

## Current state

```text
SOURCE_ONLY=YES
DIRECT_BROWSER_N8N_ACCESS=NO
DIRECT_BROWSER_MIDDLEWARE_ACCESS=NO
N8N_CREDENTIAL_IN_FRONTEND=NO
FINANCIAL_AUTOMATION_CTA=NO
LIVE_FRONTEND_CHANGED=NO
PRODUCTION_DEPLOYED=NO
```

This branch adds documentation and a machine-readable UI contract only. It does not change runtime routes, UI behavior, credentials, live trading or production deployment.
