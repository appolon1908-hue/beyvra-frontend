# Beyvra frontend read-only promotion runbook

## Protected environments

Create two GitHub environments restricted to `main` and requiring approval:

- `staging-readonly`
- `production-readonly`

### Required environment secrets

- `DEPLOY_HOST`
- `DEPLOY_USER`
- `DEPLOY_SSH_KEY`
- `DEPLOY_KNOWN_HOSTS`
- `GHCR_USER`
- `GHCR_TOKEN`

The deployment identity must be limited to the Beyvra frontend deployment
directory, the named backend Docker network, and the minimum Docker operations
required by the reviewed script.

### Required environment variables

Repository-level immutable build inputs:

- `NODE_BASE_IMAGE`
- `NGINX_BASE_IMAGE`

Per-environment deployment inputs:

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

`BACKEND_IMAGE`, `NODE_BASE_IMAGE`, and `NGINX_BASE_IMAGE` must be immutable
`repository@sha256` values. `VERIFICATION_BASE_URL` must route directly to the
candidate for deterministic verification; it may differ from the public
origin. The browser configuration still identifies only the public origin.

## Stage the paired candidate

First certify the backend candidate. Record its exact source SHA and backend
image digest in the frontend `staging-readonly` environment.

Then run **Publish and deploy immutable Beyvra frontend** from `main` with:

- `source_sha`: the full current protected-main frontend SHA;
- `target`: `staging-readonly`;
- `publish_image`: `true`;
- `deploy`: `true`;
- a unique `change_id`.

The workflow refuses to build from an older or non-main source. Save the
release manifest, deployment evidence, exact frontend digest, and exact paired
backend identity.

## Rehearse rollback

Cause a controlled verification failure in a non-production rehearsal or use a
candidate known to fail a harmless identity check. Confirm that the script
restores the previous exact frontend image and source SHA, then re-verifies the
paired backend identity through the restored frontend.

Record recovery time, session continuity, static-asset integrity, health,
runtime configuration, security headers, and backend identity readback.

## Promote the exact candidate

Run the same workflow from `main` with:

- the same `source_sha`;
- `target`: `production-readonly`;
- `publish_image`: `false`;
- `frontend_image`: the staging-certified frontend digest;
- `deploy`: `true`;
- a new production `change_id`.

The production environment must declare a canary traffic percentage of no more
than one and independently verify its external routing. The repository script
never changes ingress or traffic weights. The workflow rejects a production
rebuild.

Stop and roll back on identity mismatch, health failure, backend readiness or
capability failure, security-header regression, write acceptance, monitoring
loss, or movement in any live-effect counter.

## Active-mode boundary

This runbook does not authorize active trading, real money, broker execution,
payments, deposits, withdrawals, transactional email, or legacy realtime
fallback. Those capabilities require a separate reviewed release and explicit
activation decision.
