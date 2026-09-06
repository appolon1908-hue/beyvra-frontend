# Signed paired production-readonly promotion contract

Beyvra frontend production promotion is permitted only through `.github/workflows/promote-production-readonly.yml`.

## Required sequence

1. The backend exact protected-main candidate is built once, signed, deployed to `staging-readonly`, certified, and rolled back to its previous exact tuple and restored.
2. The frontend exact protected-main candidate is bound to that signed backend staging certification before it may build or deploy.
3. The frontend image is built once from digest-pinned Node and Nginx bases, signed, and verified before deployment.
4. Frontend staging certification verifies the exact frontend and backend source/digest tuple, re-verifies the signed backend certification, verifies runtime security and read-only state, rehearses rollback to the previous exact frontend image, restores the candidate, and compares static integrity.
5. The backend exact staging-certified digest is promoted and certified in `production-readonly` first.
6. Frontend production promotion then requires both the signed frontend staging certification and the signed backend production-readonly certification for the same backend source and digest.
7. Production dispatch uses `publish_image=false`; the exact staging-certified frontend digest is reused without rebuilding or retagging.

## Protected canary boundary

The `production-readonly` environment must set:

- `CANARY_TRAFFIC_PERCENT` to `0` or `1`;
- `EXTERNAL_CANARY_ROUTING_VERIFIED` to `true`.

The repository deployment script does not change DNS, Caddy, Kong, or traffic weights. Independent ingress control must prove the external canary percentage.

## Fail-closed safety boundary

The chain does not authorize:

- live trading;
- real money;
- deposits or withdrawals;
- payments;
- transactional or welcome email;
- external broker execution;
- schema migrations;
- simulation execution workers;
- legacy realtime fallback.

Any missing source, digest, workflow run, attestation, checksum, previous immutable image, rollback evidence, backend certification, security readback, or canary proof stops promotion.
