# Beyvra client experience foundation

This increment implements the customer-facing portion of the nine-phase enterprise roadmap without activating live trading.

## Safety boundary

- The browser authenticates only through the same-origin BFF session cookie; application code never attaches bearer tokens.
- `/api/v1/portfolio/*` remains the canonical portfolio authority. Summary,
  positions, performance, allocation, risk and evidence quality are separate
  projections so one unavailable source does not erase verified panels.
- Simulation is labelled in the interface and `live_trading_enabled` must remain false.
- Missing performance, prices, or advanced risk evidence is shown as unavailable and is never estimated by the client.
- The shared API client forces `cache: no-store`; the service worker does not
  cache `/api`, `/ws`, authentication, portfolio, or order responses and refuses
  responses marked `no-store`.
- Every unsafe shared-client request fails locally when the browser is offline.
  This is one global mutation boundary, not watchlist-specific replay logic.

## Experience architecture

1. Identity: BFF cookie, CSRF on unsafe methods, server-side ownership, administrator MFA.
2. Workspace: responsive command center with accessible data fallbacks.
3. Market experience: existing chart engine remains isolated from portfolio evidence.
4. Portfolio: independently rendered summary, positions, verified history,
   allocations, evidence quality and explainable risk. Partial failures remain
   visible as panel states rather than becoming fabricated zeros or a blank page.
5. Trading: existing simulation order path remains authoritative; no live provider is enabled here.
6. Operations: operator endpoints stay separate and require current-session MFA.
7. Reliability: bounded queries, loading/error/empty states, request IDs, no silent fallback values.
8. Mobile/PWA: installable shell and mobile navigation; sensitive API data is never cached.
9. Release: exact-head/base CI, build, lint, targeted boundary tests, secrets
   and dependency scanning, a scanned production container, and manual immutable
   candidate publication with SBOM/provenance. Publication emits a digest-locked
   rollback manifest but never deploys or activates the candidate.

The unsupported lender route is quarantined from `App.tsx`. Historical lender
components remain unreachable migration evidence until a separately reviewed
deletion proves there are no imports, links, analytics dependencies or legal
retention requirements. They are not a Beyvra product capability.
