# Frontend High / Medium / Low Roadmap

This document tracks the product and delivery sequence for frontend work before external simulation launch.

## Dependency chain

```text
docs/frontend-production-authority
→ feature/frontend-h1-safety-bff
→ feature/frontend-h3-safe-order-ticket
→ feature/frontend-h4-orders-activity
→ feature/frontend-h2-market-explorer
→ feature/frontend-h5-account-projections
→ feature/frontend-h6-realtime-recovery
→ test/frontend-production-certification
→ medium-priority-stack
→ low-priority-stack
```

`docs/frontend-production-authority` is the documentation base for this stack. Each
PR must include exact base/head, backend-contract dependency, CI result, independent
review, and the gate evidence record defined in
[FRONTEND-PRODUCTION-GATES.md](FRONTEND-PRODUCTION-GATES.md).

The stack is ordered by dependency and release risk. A later branch must not merge
until its listed predecessor is merged and its acceptance condition passes.

| Step | Branch | Scope | Acceptance condition |
| --- | --- | --- | --- |
| 0 | `docs/frontend-production-authority` | Roadmap, production gates, runtime-evidence templates | Documentation PR approved |
| 1 | `feature/frontend-h1-safety-bff` | Same-origin API client, CSRF, timeouts, session handling, protected routes, global errors | Auth/BFF/security tests pass |
| 2 | `feature/frontend-h3-safe-order-ticket` | Preview, confirmation, idempotency, expiration, buying power, fees, duplicate prevention | Order safety E2E passes |
| 3 | `feature/frontend-h4-orders-activity` | Lifecycle, executions, cancel/replace, event timeline, reconciliation | State-transition tests pass |
| 4 | `feature/frontend-h2-market-explorer` | Instruments, search, sessions, freshness, stale/unavailable data | Market-data contract tests pass |
| 5 | `feature/frontend-h5-account-projections` | Balances, buying power, positions, transactions, evidence states | No client financial recalculation |
| 6 | `feature/frontend-h6-realtime-recovery` | Tickets, subscriptions, sequences, reconnect, snapshot recovery | Gap/recovery E2E passes |
| 7 | `test/frontend-production-certification` | Authentication, financial safety, accessibility, browser testing | Production gate report generated |
| 8 | `medium-priority-stack` | Portfolio, watchlists, compliance, operators, charts | Each capability independently gated |
| 9 | `low-priority-stack` | Personalization, education, analytics, notifications | Core safety is not weakened |

## High priority

### H1. Frontend safety foundation

- Same-origin BFF API client
- `credentials: "include"`
- CSRF for unsafe requests
- bounded request timeouts and cancellation
- normalized API errors
- request/correlation ID display
- `cache: "no-store"`
- offline mutation blocking
- no bearer-token storage or attachment
- session-expiration handling
- multi-tab logout
- protected deep-link restoration

### H2. Market explorer and canonical instrument selection

- debounced search
- cursor pagination
- filters
- open/closed states
- freshness indicators
- canonical UUID selection
- delayed/stale/gapped/unavailable handling
- mobile instrument drawer
- keyboard navigation
- simulation disclosure

### H3. Safe order ticket

- account and instrument selection
- server preview and confirmation
- idempotent submission
- order-state tracking
- decimal-string inputs
- backend-supported order-type and TIF validation
- quote age/expiration
- buying power before and after
- fees or unavailable state
- offline blocking
- unknown-outcome handling
- cancel and replace flow

### H4. Orders, executions and activity

- open orders and history
- status filters
- partial fills
- execution list
- immutable event timeline
- cancel/replace relationships
- rejection explanation
- reconciliation warnings
- cursor pagination

### H5. Account and financial projections

- account and balances views
- buying power and statements
- separate cash buckets
- unavailable states where evidence is missing

### H6. Realtime recovery

- short-lived tickets
- sequence tracking
- duplicate rejection
- gap detection
- resume after reconnect
- `SNAPSHOT_REQUIRED` handling
- bounded backoff
- session-expiration shutdown
- logout disconnection

### H7. Critical testing

- auth flows
- protected deep links
- session expiration
- admin MFA
- capability failure
- order preview/submission
- stale preview and partial fill
- cancel and replace
- unknown outcome
- cross-tenant denial
- offline mutation blocking
- realtime gap recovery
- mobile order flow
- cache inspection
- keyboard-only trading

## Medium priority

### M1. Portfolio experience expansion

- account switching
- position drill-down
- realized/unrealized P&L separation
- range comparison
- allocation filtering
- valuation timestamps
- unpriced disclosure
- evidence quality explanation
- risk methodology
- statement links
- responsive charts
- accessible chart tables

### M2. Watchlists and alerts

- create/rename/delete watchlists
- canonical instrument add/remove
- drag and keyboard reordering
- ETag/version handling
- conflict recovery
- price alerts
- trigger history
- delivery evidence
- unavailable market-data states

### M3. Compliance and security

- onboarding progress
- document upload and malware scan states
- restrictions and policy acknowledgements
- MFA and active session views
- revoke-session actions

### M4. Operator console

- route guard
- MFA for current session
- backend permission validation
- read-only default
- maker/checker separation
- mutation confirmation
- mandatory reason
- audit reference

### M5. Chart capability expansion

- candlestick, line, area
- volume
- supported timeframes
- indicators
- drawings
- order/fill markers
- corporate-action markers
- fullscreen
- reduced motion
- accessible table
- stale/disconnected overlays

## Low priority

### L1. Workspace personalization

- rearrangeable panels
- saved layouts
- density settings
- default account/watchlist
- chart preferences
- timezone/locale/currency display

### L2. Advanced portfolio analytics

- only when backend evidence exists
- benchmark, drawdown, attribution, exposure, risk contribution, time-weighted and money-weighted performance

### L3. Customer education and support

- walkthrough
- contextual explanations
- order-type education
- simulation disclosure
- evidence-quality help
- help center
- support request with request ID

### L4. Notification center

- order/execution/compliance/alert/system notices
- read/unread states
- queued/sent/delivered/failed distinction

## Execution order

```text
PR #25
→ PR #27
→ H1 Safety Foundation
→ H2 Market Explorer
→ H3 Order Ticket
→ H4 Orders and Activity
→ H5 Account Projections
→ H6 Realtime Recovery
→ H7 Critical Tests
→ M1 Portfolio V2
→ M2 Watchlists and Alerts
→ M3 Compliance and Security
→ M4 Operator Console
→ M5 Chart V2
→ Low-priority enhancements
```

## Delivery priority

- Complete High before simulation production.
- Complete Medium before broad customer rollout.
- Treat Low as controlled post-launch work.
