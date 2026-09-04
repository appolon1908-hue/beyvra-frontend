# Beyvra Automation Status UI v2

The Beyvra browser communicates only with the Beyvra backend through the same-origin BFF. It never calls n8n, Middleware, Kong administration, Keycloak administration, Odoo, a provider, a broker, a payment rail, or a database directly and never receives a machine credential.

```text
Browser
  -> authenticated Beyvra backend command
  -> durable private automation boundary when policy permits
  -> backend reconciliation
  -> safe backend operation projection
  -> browser snapshot and subscribe-only deltas
```

## Contract status

```text
FRONTEND_CONTRACT=SOURCE_ONLY
BACKEND_PR=appolon1908-hue/beyvra-backend#89
BACKEND_CANDIDATE=b46a276ed1cd8c74c240f4bec9cf10307739d24f
BACKEND_STATE=PENDING_PROTECTED_MERGE
UI_ROUTES_IMPLEMENTED=NO
PRODUCTION_DEPLOYED=NO
LIVE_APPLY_AUTHORIZED=NO
```

The frontend may not add runtime requests until the backend contract is protected-merged, its accepted OpenAPI/capability artifact is bound to an exact frontend candidate, and independent review confirms the boundary.

## Approved non-financial user intents

- Request onboarding assistance.
- Request a compliance reminder.
- Escalate a support case.
- Request a permitted operational report.
- Acknowledge an operational or security alert.
- Change notification preferences.
- Cancel an operation only before authoritative submission.

No trading, order, wallet, deposit, withdrawal, transfer, payment, ledger, custody, chain, broker, provider, or demo-order automation action is allowed.

## State model

```text
accepted -> queued -> running -> waiting_approval -> submitted
                                              |       -> unknown
                                              |       -> reconciling
                                              |       -> reconciled_success
                                              |       -> reconciled_failure
                                              -> rejected
accepted|queued -> cancelled
```

The UI shows success only for `reconciled_success`. Request acceptance, queueing, workflow completion, or an unverified callback is not sufficient evidence.

## Required future UX

After the backend dependency is accepted, implementation may include:

- a status center with filterable safe operation projections;
- request forms with backend validation, idempotency, and one deliberate primary action;
- an alert center with severity, owner, status, and acknowledgement;
- accessible state labels that do not rely on color alone;
- safe correlation IDs for support;
- explicit unknown and reconciling states;
- authoritative snapshot recovery after realtime gaps;
- English and Spanish localization;
- unavailable and permission-denied states without raw internal detail.

## Prohibited projection data

Never render or store access/refresh/ID tokens, client secrets, machine tokens, provider credentials, raw workflow executions, raw webhook bodies, internal routes, lease data, stack traces, internal service names, unredacted PII, or financial payloads.

## Command and realtime rules

- Commands are deliberate authenticated REST requests to the backend.
- The backend resolves tenant/account authority and records the durable request.
- Realtime is subscribe-only and never carries browser-authored commands.
- Initial state comes from a REST snapshot.
- Duplicate and stale events are ignored.
- A sequence gap pauses the affected projection until authoritative snapshot recovery completes.
- Reconnect never submits a new request.
- Client-side approval, cancellation, or success state is not authoritative.

## Safety

This source contract does not add routes, deploy the frontend, activate an automation workflow, enable a provider, place an order, move money, or change production traffic.
