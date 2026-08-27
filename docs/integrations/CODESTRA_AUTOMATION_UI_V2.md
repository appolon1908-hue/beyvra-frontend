# Beyvra Automation Status UI v2

The Beyvra browser communicates only with the Beyvra backend. It never calls n8n, Middleware, Kong administration, Keycloak administration, or a provider directly and never receives a machine token.

```text
Browser -> Beyvra backend -> Middleware durable request -> private Beyvra n8n cell
        <- safe reconciled status projection <- Beyvra backend
```

## Approved user-intent surfaces

- Request onboarding assistance.
- Request a compliance reminder.
- Escalate a support case.
- Request a permitted operational report.
- Acknowledge an operational/security alert.
- Change notification preferences.
- Cancel an operation only before authoritative submission.

No trading, order, wallet, deposit, withdrawal, transfer, payment, custody, chain, broker, provider, or demo-order automation CTA is allowed.

## State model

```text
accepted -> queued -> running -> waiting_approval -> submitted -> reconciled_success
                                     |              -> reconciled_failure
                                     -> rejected
accepted/queued -> cancelled
unknown -> reconciling -> reconciled_success|reconciled_failure
```

The UI shows success only for `reconciled_success`. An n8n execution completing is not sufficient evidence.

## Required UX

- Status center with filterable operations and safe correlation ID.
- Request forms with backend validation and one primary CTA.
- Alert center with severity, owner, status, and acknowledgement.
- Accessible status chips and no raw stack trace, token, provider payload, or n8n execution body.
- Reconnect-safe snapshot recovery for realtime views.
- English and Spanish labels.

This source contract does not add routes or deploy the frontend.
