# Beyvra Runtime Cutover Evidence

This document records the runtime evidence required before go/no-go for simulation launch.

## Required runtime evidence

- backend auth mode verified
- same-origin API proxy verified
- OIDC and local-auth cutover verified
- session-expiry smoke tests recorded
- protected deep-link recovery validated
- admin MFA smoke test recorded
- password-reset send/consume evidence recorded
- logout and multi-tab logout evidence recorded
- browser cache and storage inspection evidence recorded
- no bearer or refresh token persistence in browser storage
- no sensitive financial values fabricated or persisted locally
- no unauthorized redirect handling accepted

## Evidence checklist

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

## Supporting evidence

- CI results recorded for each branch
- contract-drift checks recorded
- container build and security scan results recorded
- performance baseline values recorded and approved
- accessibility evidence recorded for WCAG 2.2 AA targets
- public-edge security checks recorded
- email delivery checks recorded

## Approval gate

Simulation launch is allowed only when runtime evidence, production-gate checks, and security validations are complete and reviewed by independent reviewers.
