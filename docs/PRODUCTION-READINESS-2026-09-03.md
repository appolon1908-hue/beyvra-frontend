# Beyvra frontend production-readiness review — 2026-09-03

## Decision

This repository is prepared as an **immutable read-only production candidate**
paired to an exact Beyvra backend candidate. It is not an active-trading or
real-money release.

Production activation remains **NO-GO** until this candidate is merged, built
from protected `main`, certified with the exact backend SHA and image digest in
`staging-readonly`, rollback is rehearsed, and the same frontend digest is
promoted through a no-more-than-one-percent `production-readonly` canary.

## What this candidate fixes

| Area | Candidate state |
| --- | --- |
| Source authority | Clean branch created from the exact protected `main` SHA |
| Required CI | Replaces the misleading Localization gate with build, lint, test, contract, audit, image, and exact-head gates |
| Runtime user | Unprivileged Nginx user on port 8080 |
| Filesystem | Static image content is immutable; generated public configuration lives only under `/tmp` |
| Configuration | Startup fails on invalid source SHA, digest, hostname, backend upstream, realtime fallback, or mutation mode |
| API boundary | Browser uses same-origin `/api` and `AUTO` WebSocket routing; direct API-origin access is removed |
| Mutation safety | Shared BFF CSRF path rejects unsafe methods before network activity when the deployment is read-only |
| Realtime | Realtime v2 is mandatory and legacy v1 fallback is fail-closed |
| CSP/logging | CSP limits connections to the same origin and access logs omit query strings |
| Image promotion | Root Compose is digest-only, contains no build, binds to loopback, and joins only the named backend network |
| Paired identity | Certification verifies exact frontend and backend SHAs and image digests through the frontend origin |
| Rollback | Previous immutable frontend digest/source is captured and restored automatically on verification failure |
| Bypass removal | Deletes `git pull && docker compose --build` and duplicate mutable production Compose paths |
| Supply chain | Exact npm install, dependency policy gate, source labels, high/critical image scan, SBOM, and provenance |

## Deliberately not authorized

- live trading, real money, deposits, withdrawals, payments, or broker writes;
- legacy realtime fallback;
- direct browser calls to a separate backend origin;
- server-side image builds or mutable image tags;
- automatic external traffic changes;
- promotion against a backend that does not expose the expected immutable,
  read-only identity.

## Required evidence before production-readonly

The protected `staging-readonly` environment must produce:

- exact frontend source SHA and image digest;
- exact paired backend source SHA and image digest;
- successful frontend health, runtime configuration, security-header, backend
  readiness, capability, and mutation-rejection checks;
- proof that the container is unprivileged and read-only;
- rollback to the previous exact frontend image with identity readback;
- independent confirmation that production canary routing is no more than one
  percent and does not bypass monitoring;
- zero movement in live-trading, real-money, payment, email, or external-effect
  counters.

The repository deployment script binds the frontend only to loopback and does
not modify Caddy, Kong, DNS, or traffic weights. External canary routing remains
a separately protected ingress operation.

## Current repository verdict

**Repository candidate: READY FOR PROTECTED PR REVIEW**

**Staging certification: NOT YET EXECUTED**

**Production-readonly deployment: NOT YET EXECUTED**

**Active trading / real money: NOT AUTHORIZED**
