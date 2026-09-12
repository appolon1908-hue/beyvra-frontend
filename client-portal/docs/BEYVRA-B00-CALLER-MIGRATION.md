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
Full E2E is not certified. Older E2E/load fixtures still use retired guest/Demo
routes; authenticated PAPER fixtures and test migration remain B00 work. Broader
legacy API/client and realtime consolidation remains scheduled work.

No provider keys, live activation flags, deployment authority, or approval rules
were changed. The milestone remains unfinished until the paired PRs, complete
contract migration and required checks are reviewed and merged.
