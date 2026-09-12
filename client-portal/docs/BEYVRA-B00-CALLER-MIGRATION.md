# B00 — PAPER account caller migration

This branch is the frontend dependency of backend B00, not frontend F00. The
backend draft is https://github.com/appolon1908-hue/beyvra-backend/pull/109.

Application code no longer calls `/api/v1/demo/*`. Practice entry uses the existing
Keycloak login redirect. Workspace bootstrap supplies the PAPER/LIVE account
identity and capability flags. PAPER accounts always disable live trading,
deposits and withdrawals in this projection, even when global flags are true.
The backend remains the enforcement authority.

Removed the guest-session client, Demo-configuration client, duplicated config
hook and unused Demo-client exports. Retained Fixed-Time presentation defaults
are static configuration and do not settle trades or call a Demo endpoint.

Deploy this frontend migration before removing the corresponding backend routes
from a running workload. An older bootstrap response without execution mode fails
closed for trading/funding capability flags, allowing a controlled rollout.

Validation so far: npm ci, typecheck, build, lint (one pre-existing requireAuth
hook-dependency warning, no errors), and five targeted client/capability tests.
The E2E/load harnesses now use normal authenticated PAPER session state and BFF CSRF.
The duplicate fixed-time trade test is removed; the existing PAPER trading suite
now checks conflicting reuse of an idempotency key. Chart/visual tests no longer
submit obsolete fixed-time orders or mock retired trading URLs. Executions and
positions are asserted by the trading suite; final marker UX remains F03/F05 work.
Ten session-preflight tests, three isolated V2 protocol tests and seven public
browser checks pass. Full authenticated staging E2E is not certified by those
checks. Broader API/client and realtime consolidation remains scheduled work.

No provider keys, live activation flags, deployment authority, or approval rules
were changed. The milestone remains unfinished until the paired PRs, complete
contract migration and required checks are reviewed and merged.

## Realtime load harness

The existing script now uses the deployed V2 token endpoints and `/ws/v2/`, with
server authorization for every requested channel. B17/F13 will migrate token
acquisition and channel naming to the final contract. No V1 fallback exists in
this harness. It fails if connection or subscription acknowledgments are missing.

```sh
LOAD_BASE_URL=https://YOUR_APPROVED_STAGING_DOMAIN \
LOAD_STORAGE_STATE=/private/paper-session.json \
LOAD_CHANNELS='["system.status"]' \
LOAD_CONNECTIONS=1 node scripts/realtime-load.mjs
```

Session files come from normal sign-in, remain outside source/images and must be
private. The script issues no guest sessions and logs no authentication material.
The local mocked protocol tests establish harness behavior only, not provider
availability, production authorization or a completed staging load run.
