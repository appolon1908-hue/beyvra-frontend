# Beyvra frontend immutable deployment authority

## Current truth

```text
SOURCE_VALIDATION=AVAILABLE
IMMUTABLE_IMAGE_PUBLICATION=WORKFLOW_CONTROLLED
STAGING_READONLY_DEPLOYMENT=PROTECTED_ENVIRONMENT_CONTROLLED
PRODUCTION_READONLY_PROMOTION=EXACT_DIGEST_ONLY
PRODUCTION_CANARY_LIMIT_PERCENT=1
ACTIVE_TRADING_ACTIVATION=NOT_AUTHORIZED
```

This document defines the repository-controlled release path. A merge, local image, mutable tag, successful source build, or reachable URL is not production certification.

## Release class

The current release class is **read-only**. It must keep all of the following disabled:

- live trading;
- real-money operations;
- external broker execution;
- deposits and withdrawals;
- payment processing;
- transactional email;
- legacy realtime fallback;
- any other externally effectful mutation.

A separate reviewed activation release is required to change this boundary.

## Source validation

Run from `client-portal/`:

```sh
npm ci
npm run build
npm run lint
npm run typecheck
npm run errors:check
npm run brand:check
npm run i18n:check
npm run test:errors
npm run test:realtime
npm run test:chart
node scripts/check-api-contract.mjs --source-only
npm run audit:gate
```

The complete backend contract check requires an approved staging schema:

```sh
API_SCHEMA_URL=https://YOUR_APPROVED_STAGING_API/api/schema/ npm run test:contract
```

Playwright requires a running integrated staging origin:

```sh
E2E_BASE_URL=https://YOUR_APPROVED_STAGING_DOMAIN npm run test:e2e
```

Authenticated browser acceptance requires `POST /api/v1/demo/sessions`. `E2E_SKIP_GUEST_BOOTSTRAP=true` is valid only for a deliberately unauthenticated subset.

## Canonical artifact build

`.github/workflows/deploy.yml` is the only release image publication authority. It accepts a full protected-main source SHA, verifies required CI, and builds the image once from immutable Node and Nginx base-image digests.

The build publishes:

- an immutable frontend `repository@sha256:...` digest;
- OCI source and revision labels;
- an SBOM;
- provenance/attestation;
- a checksummed release manifest.

Production promotion rejects image rebuilding and accepts only the staging-certified digest.

## Canonical runtime

The root `docker-compose.yaml` is the only release Compose authority. It:

- requires `FRONTEND_IMAGE=repository@sha256:...`;
- contains no `build:` directive;
- uses `pull_policy: never` after the reviewed deploy script pulls and verifies the digest;
- runs as user `101:101`;
- uses a read-only root filesystem;
- drops all Linux capabilities;
- enables `no-new-privileges`;
- writes generated public configuration only under `/tmp`;
- binds the candidate to host loopback;
- joins only the named backend Docker network.

Do not deploy with mutable tags, server-side image builds, duplicate Compose files, or `git pull && docker compose --build`.

## Protected environments

Create and restrict these GitHub environments to `main`:

- `staging-readonly`
- `production-readonly`

Each environment requires deployment approval and its own secrets and variables.

### Required environment secrets

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_KNOWN_HOSTS`
- `GHCR_USER`
- `GHCR_TOKEN`

### Repository build variables

- `NODE_BASE_IMAGE`
- `NGINX_BASE_IMAGE`

Both values must be immutable `repository@sha256:...` references.

### Deployment variables

- `DEPLOY_PATH`
- `PUBLIC_SERVER_NAME`
- `VERIFICATION_BASE_URL`
- `BACKEND_NETWORK`
- `BACKEND_UPSTREAM`
- `BACKEND_SOURCE_SHA`
- `BACKEND_IMAGE`
- `PORT`
- `CANARY_TRAFFIC_PERCENT`
- `EXTERNAL_CANARY_ROUTING_VERIFIED`

`BACKEND_IMAGE` must be the exact staging-certified backend digest. `BACKEND_SOURCE_SHA` must be the corresponding full protected-main SHA.

## Stage the paired candidate

First certify the backend in `staging-readonly`. Record its exact source SHA and backend image digest in the frontend staging environment.

Then dispatch **Publish and deploy immutable Beyvra frontend** from protected `main` with:

```text
source_sha=<exact current protected-main frontend SHA>
target=staging-readonly
publish_image=true
deploy=true
change_id=<unique audited identifier>
```

The workflow must produce and retain:

- exact frontend source SHA;
- exact frontend image digest;
- exact paired backend source SHA and image digest;
- runtime configuration readback;
- security-header results;
- backend readiness and capability readback;
- mutation-rejection evidence;
- running image verification;
- release manifest and checksum.

## Required staging certification

The unchanged candidate must pass:

1. `/healthz` frontend health;
2. `/__release.json` exact frontend SHA and digest;
3. `/__runtime-config.json` same-origin `/api`, `AUTO` WebSocket routing, realtime v2 enabled, legacy fallback disabled, and deployment read-only;
4. CSP, HSTS, MIME-sniffing, referrer, and permissions-policy checks;
5. `/api/v1/system/version` exact paired backend SHA and digest;
6. `/api/v1/system/capabilities` fail-closed trading and money state;
7. `POST /api/v1/trading/orders` rejected with `DEPLOYMENT_READ_ONLY`;
8. API contract and browser acceptance against the exact candidate;
9. monitoring continuity;
10. zero movement in live-trading, money, payment, email, withdrawal, and external-execution counters.

## Rollback rehearsal

Before production promotion, rehearse a controlled candidate-verification failure in staging. `operations/deploy_immutable_frontend.sh` must restore the previously recorded immutable frontend digest and full source SHA, then re-run release verification through the restored frontend.

Record:

- previous and candidate digests;
- rollback start and completion timestamps;
- recovery time;
- session and static-asset integrity;
- frontend health and release identity;
- paired backend identity and readiness;
- monitoring continuity;
- zero live-effect movement.

Do not promote when the previous candidate is not a complete immutable tuple.

## Production read-only canary

Dispatch the same workflow from protected `main` with:

```text
source_sha=<same staging-certified frontend SHA>
target=production-readonly
publish_image=false
frontend_image=<same staging-certified repository@sha256 digest>
deploy=true
change_id=<unique production change identifier>
```

The protected environment must set `CANARY_TRAFFIC_PERCENT` to `0` or `1`. Promotion fails when the value exceeds one percent or when `EXTERNAL_CANARY_ROUTING_VERIFIED` is not `true`.

The repository deployment script never changes Caddy, Kong, DNS, load-balancer weights, or external routing. An independently protected ingress operation must route and verify the canary.

## Stop and rollback conditions

Stop and restore the previous exact candidate on any:

- source or image-digest mismatch;
- frontend health failure;
- backend readiness or capability failure;
- API contract failure;
- security-header regression;
- accepted state-changing request;
- monitoring loss;
- error-rate or latency regression beyond the approved canary threshold;
- movement in any live-effect counter;
- inability to prove the previous immutable candidate.

## Active-mode boundary

This runbook does not authorize active trading, real money, provider execution, payments, deposits, withdrawals, transactional email, or legacy realtime fallback.

Enabling those capabilities requires a separate reviewed release, complete financial-command and idempotency certification, protected server-side integration setup, recorded approvals from legal, compliance, and risk owners, an explicit change record, and independent rollback evidence.
