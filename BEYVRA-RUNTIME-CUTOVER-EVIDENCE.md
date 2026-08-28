# Beyvra Runtime Cutover Evidence

This document records the runtime evidence required before go/no-go for simulation launch.

## Evidence state model

Each requirement must be tracked through these states independently. Configuration
being present is not evidence that a test passed, and a staging pass is not proof of
production cutover.

| State | Meaning |
| --- | --- |
| Configuration present | Required setting, route, capability, or deployment configuration is present and inspected. |
| Automated test passed | A repeatable automated test passed against the exact commit. |
| Staging smoke test passed | The deployed staging revision passed a realistic smoke test. |
| Production cutover verified | The production deployment was verified after cutover using the recorded revision and digest. |

## Evidence record template

```text
REQUIREMENT=
CONFIGURATION_PRESENT=PASS|FAIL|NOT_RUN
AUTOMATED_TEST=PASS|FAIL|NOT_RUN
STAGING_SMOKE=PASS|FAIL|NOT_RUN
PRODUCTION_CUTOVER=PASS|FAIL|NOT_RUN
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

Each row must contain exact immutable build identity, environment and deployment
revision, test command and run URL, UTC timestamp, responsible reviewer, status, and
attached evidence. `PASS` is not valid when an earlier state is missing.

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
- order-preview expiration and idempotent submission verified
- `If-Match` conflict handling verified
- WebSocket gap recovery verified

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

Simulation launch is blocked until frontend code proves same-origin `/api` BFF use,
absence of browser-stored bearer tokens, absence of authentication and financial
response caching, disabled offline financial mutation replay, order-preview expiration,
idempotent submission, `If-Match` conflict handling, WebSocket gap recovery, login,
registration, logout, MFA, password-reset, WCAG 2.2 AA, and measured numeric
performance-budget tests. Runtime evidence, production-gate checks, and security
validations must then be complete at all four evidence states and reviewed by
independent reviewers.

**Current status: documentation prepared, code and runtime verification pending.**
