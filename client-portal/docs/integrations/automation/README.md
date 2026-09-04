# Beyvra frontend automation-status integration

## Authority boundary

The Beyvra browser communicates only with `appolon1908-hue/beyvra-backend` through the same-origin BFF/API boundary. It is not an n8n, Middleware, Kong-admin, Keycloak-admin, provider, broker, payment, custody, database, or queue client.

```text
Browser
  -> same-origin Beyvra backend REST command
  -> backend authentication, authorization, tenant/account resolution, validation,
     idempotency, audit, and durable request creation
  -> private governed automation boundary when applicable
  -> backend reconciliation
  -> safe backend status projection
  -> browser REST snapshot and authorized realtime deltas
```

The browser receives no service-account token, OAuth client secret, n8n credential, Middleware machine token, webhook signing secret, provider credential, broker credential, wallet credential, payment credential, database credential, or raw orchestration payload.

## Current dependency

This source contract is designed to pair with the governed backend automation candidate:

```text
BACKEND_REPOSITORY=appolon1908-hue/beyvra-backend
BACKEND_PR=89
BACKEND_CANDIDATE=b46a276ed1cd8c74c240f4bec9cf10307739d24f
BACKEND_STATE=PENDING_PROTECTED_MERGE
FRONTEND_SOURCE_ONLY=YES
```

Until the backend contract is protected-merged and its accepted OpenAPI/capability evidence is bound to an exact frontend candidate, this repository must not add live routes or claim integrated availability.

## Allowed non-financial user intents

The frontend may eventually submit these user intents through an accepted backend API:

- request onboarding assistance;
- request a compliance reminder;
- escalate a support case;
- request an authorized operational report;
- acknowledge an operational or security alert;
- update notification preferences;
- cancel an operation only before authoritative submission.

A browser request is only an intent. The backend decides whether the user is authorized, creates the durable command, determines whether private automation is appropriate, and remains authoritative for the final reconciled result.

## Safe operation states

```text
accepted
queued
running
waiting_approval
submitted
unknown
reconciling
reconciled_success
reconciled_failure
rejected
cancelled
```

The UI may show success only for `reconciled_success`. A workflow process completing, an event being queued, or an HTTP request being accepted is not success evidence.

## Projection rules

User-visible automation state may include only the safe contract fields:

- operation ID;
- operation type;
- status;
- created and updated timestamps;
- safe summary;
- retryability;
- safe correlation ID;
- optional next action.

It must not expose tokens, secrets, raw webhook bodies, raw workflow executions, internal service names/routes, stack traces, provider responses, lease data, internal decision evidence, customer PII, or financial details.

## Realtime behavior

Initial state comes from an authenticated backend REST snapshot. Realtime is subscribe-only and may provide authorized sequenced deltas. Duplicate or stale events are ignored. On a sequence gap, the frontend pauses the affected projection and recovers from the backend-advertised authoritative snapshot provider before resuming.

Reconnect never creates a new automation request. A new request requires deliberate user submission and a new idempotency key.

## Explicit prohibitions

The frontend must never:

- call n8n, Middleware, or a provider directly;
- store or receive a machine credential;
- let caller-supplied tenant/account identifiers establish authority;
- approve a protected action in client-only state;
- show reconciled success before backend confirmation;
- submit trading, order, wallet, ledger, payment, deposit, withdrawal, transfer, custody, chain, broker, provider, or demo-order actions through this automation boundary;
- treat automation as the authority for balances, orders, compliance, risk, payment, custody, or account state.

## Safety state

```text
DIRECT_BROWSER_N8N_ACCESS=NO
DIRECT_BROWSER_MIDDLEWARE_ACCESS=NO
MACHINE_CREDENTIALS_IN_FRONTEND=NO
BROWSER_BEARER_TOKEN_STORAGE=NO
FINANCIAL_AUTOMATION_CTA=NO
TRADING_AUTOMATION_CTA=NO
LIVE_FRONTEND_CHANGED=NO
PRODUCTION_DEPLOYED=NO
LIVE_APPLY_AUTHORIZED=NO
```

This directory defines a source-only UI boundary. It does not add routes, activate automation, deploy the frontend, enable providers, place orders, or move money.
