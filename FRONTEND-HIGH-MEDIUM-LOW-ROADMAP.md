# Frontend High / Medium / Low Roadmap

This document tracks the product and delivery sequence for frontend work before external simulation launch.

## Dependency chain

```text
Frontend PR #25
→ Frontend PR #27
→ frontend-safety-foundation-v1
→ market-explorer-v1
→ order-ticket-v1
→ orders-activity-v1
→ account-financial-projections-v1
→ realtime-recovery-v1
→ frontend-critical-gates-v1
```

Each PR must include exact base/head, backend-contract dependency, CI result, and independent review.

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
