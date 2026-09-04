# Beyvra Frontend High / Medium / Low Roadmap

This roadmap defines the remaining frontend capability work after the protected-main BFF cutover and immutable read-only release foundation. Historical stacked branches are evidence and source material only; new implementation work must be extracted into narrow pull requests built directly from current protected `main`.

## Delivery model

Every workstream must identify:

- exact protected-main base SHA and exact head SHA;
- accepted backend contract or explicit backend prerequisite;
- affected routes, API calls, realtime channels, and storage behavior;
- focused tests plus repository-wide regression evidence;
- safety impact and unchanged disabled capabilities;
- independent review of the exact head.

A later capability may be developed in parallel, but it cannot be promoted until its prerequisites pass. No frontend workstream may enable a backend-disabled capability.

## High priority — external simulation blockers

### H1. Safety foundation

Complete and prove one shared same-origin request/session boundary:

- `/api` and `/ws` stay same-origin;
- `credentials: "include"` for authenticated requests;
- no browser token storage or BFF `Authorization` header;
- CSRF bootstrap and enforcement for unsafe requests;
- bounded timeouts, cancellation, normalized errors, and request-ID support references;
- `cache: "no-store"` for authentication and financial responses;
- global offline mutation blocking with no replay queue or background sync;
- session-expiration shutdown, logout-all, multi-tab sign-out, and protected deep-link restoration;
- fail-closed capability, maintenance, degraded-mode, unavailable, and partial-data boundaries.

Acceptance requires tests proving that expired sessions and offline state stop mutations before network dispatch, external redirect targets are rejected, and sensitive responses never enter browser storage or Cache Storage.

### H2. Market explorer and canonical instruments

Build the canonical instrument-discovery experience against only the accepted backend schema:

- debounced search and cursor pagination;
- asset-class, venue, status, and entitlement filters;
- canonical UUID selection and symbol-ambiguity rejection;
- market-open, closed, halted, delayed, stale, gapped, and unavailable states;
- price timestamps and freshness indicators;
- mobile drawer behavior and keyboard navigation;
- persistent canonical identity across display-symbol changes;
- explicit simulation and data-quality disclosures.

Never present stale or unavailable data as tradable and never use the ticker symbol as the only identity.

### H3. Safe order ticket

Implement the complete server-authoritative command flow:

1. select authorized account;
2. select canonical instrument;
3. enter decimal-string economic fields;
4. request a server preview;
5. show quote age, expiration, buying power before/after, fees or explicit unavailable state, risk, and compliance decisions;
6. require deliberate user confirmation;
7. submit once with a stable idempotency key and required version/precondition;
8. show the durable server receipt and track lifecycle state.

Required protections include preview invalidation after economic changes, duplicate-click suppression, offline blocking, timeout/unknown-outcome handling without automatic retry, stale-preview conflict recovery, cancel confirmation, and replacement through a new preview. Never calculate authoritative buying power or fees, and never show optimistic fills.

### H4. Orders, executions, and activity

Complete customer order and execution surfaces:

- open orders and paginated history;
- order details and immutable event timeline;
- partial fills and execution records;
- cancel/replace relationships;
- rejection explanations and safe support references;
- unknown, pending-reconciliation, and provider-degraded warnings;
- snapshot recovery after realtime gaps;
- account-scoped and tenant-isolated filtering.

### H5. Account and portfolio projections

Provide evidence-led account views:

- authorized account switching;
- cash, settled cash, unsettled cash, reserved cash, available cash, equity, market value, and buying power as distinct backend values;
- position drill-down and valuation timestamps;
- realized versus unrealized profit/loss;
- transactions, statements, and evidence-quality links;
- unpriced and partially priced position disclosure;
- independently degraded portfolio panels.

Missing evidence is unavailable, not zero. The browser must not recalculate authoritative account or portfolio totals.

### H6. Realtime recovery

Adopt exactly one protocol per public route and only backend-advertised channels:

- short-lived user/tenant/channel-scoped authorization;
- per-channel sequence tracking and duplicate rejection;
- visible disconnect and stale states;
- gap detection that pauses affected deltas;
- authoritative snapshot recovery and safe resume;
- bounded exponential reconnect backoff;
- logout/session-expiration disconnection;
- channel-count, message-size, origin, and subscription constraints enforced server-side.

The browser subscribes and renders; all user commands remain authenticated REST mutations. See `REALTIME-OWNERSHIP-BOUNDARY.md`.

### H7. Production-grade browser certification

Mandatory integrated tests before external simulation users are allowed:

- login, registration, logout, logout-all, password recovery, session expiration, protected deep links, and administrator MFA;
- capability unavailable/degraded states;
- preview, submit, duplicate submit, stale preview, partial fill, cancel, replace, and unknown outcome;
- cross-tenant and unauthorized-account denial;
- offline mutation blocking and sensitive-cache inspection;
- realtime disconnect, gap, snapshot, and resume;
- keyboard-only and screen-reader-oriented trading flow;
- mobile order, chart, activity, and navigation behavior;
- exact source/image identity and rollback evidence.

## Medium priority — customer and operator completeness

### M1. Portfolio experience expansion

Add range comparison, allocation filtering, benchmark and methodology disclosures, responsive ECharts, accessible data tables, statement/transaction navigation, and independent unavailable states. Do not fabricate performance history, VaR, stress results, or attribution.

### M2. Watchlists and alerts

Build tenant/user-scoped watchlists using canonical instrument IDs:

- create, rename, delete, default selection, and ordered items;
- add/remove by canonical identity with ambiguity handling;
- keyboard and pointer reordering;
- integer/ETag version preconditions and conflict recovery;
- price-alert creation, editing, trigger history, delivery evidence, and market-data unavailable states.

This work depends on an accepted backend watchlist/alert contract and its idempotency/version guarantees.

### M3. Compliance and account security

Build onboarding progress, requirements, document upload and malware-scan states, restrictions, policy acknowledgements, MFA status, active sessions, security history, and revoke-session actions. Compliance changes must immediately disable affected command controls, while the backend remains authoritative.

### M4. Operator console

Build separately guarded, permission-validated operator views for orders, providers, reconciliation, halts, limits, and audit. Default to read-only. Mutations require current-session MFA, confirmation, reason, maker/checker controls where required, and an audit reference. Never display provider credentials.

### M5. Chart capability expansion

Expose only genuinely supported chart features: candlestick, line, area, volume, accepted timeframes, indicators, drawings, order/fill and corporate-action markers, fullscreen, reduced motion, accessible tables, and stale/disconnected overlays. Hide placeholders and unsupported controls.

## Low priority — controlled post-launch improvements

### L1. Workspace personalization

Saved layouts, rearrangeable panels, density, default account/watchlist, chart preferences, timezone, locale, and display-currency preferences. Preferences must not alter authoritative values or command eligibility.

### L2. Advanced analytics

Only after backend evidence exists: benchmark comparison, drawdown, attribution, sector/geographic exposure, risk contribution, time-weighted return, money-weighted return, and exportable reports.

### L3. Education and support

First-use guidance, order-type education, simulation disclosure, evidence-quality help, searchable support content, and support requests carrying safe request IDs.

### L4. Notification center

Order, execution, compliance, alert, security, and system notices with read/unread state and clear queued/sent/delivered/failed evidence. Mandatory security notifications cannot be disabled by the browser.

## Priority rule

- High must pass before external simulation access.
- Medium must pass before broad customer and operator rollout.
- Low is post-launch work and cannot weaken any High or Medium safety gate.
