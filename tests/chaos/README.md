# Frontend chaos harness (prepared, not executed)

This harness is intentionally inert unless every explicit gate in `guard.mjs` passes. It is for isolated staging and synthetic guest-demo accounts only. It never targets production, live trading, deposits, withdrawals, external execution, or real money.

Prepared scenarios:

- `/ws/v2/` disconnect and reconnect-gap recovery
- bounded market snapshot `503` and safe-error rendering
- duplicate demo order idempotency observation
- post-test reconciliation of demo orders, trades, and wallet projection

Required operator inputs are `CHAOS_EXECUTE=YES`, `CHAOS_BASE_URL` using HTTPS on an allowlisted staging hostname, and `CHAOS_SYNTHETIC_ACCOUNT=YES`. The operator must run `guard.mjs` immediately before any scenario. `cleanup.mjs` validates that evidence references demo resources only and refuses destructive cleanup.

No scenario was executed while preparing these files.

