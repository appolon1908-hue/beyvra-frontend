# Beyvra Realtime Ownership Boundary

This document defines the production security and ownership boundary for browser realtime behavior. It applies to the frontend, same-origin BFF, realtime gateway, backend channel registry, and provider integrations.

## Trust direction

```text
TRUSTED DATA
Provider or internal authority
  -> Beyvra backend
  -> authorized realtime gateway
  -> subscribe-only browser client

USER COMMANDS
Browser
  -> authenticated same-origin REST API
  -> Beyvra backend command authority
```

The backend/provider tier is the sole publisher and authority for market prices, quotes, candles, order books, news, economic events, orders, executions, positions, balances, compliance state, and reconciled operational state. Knowing a channel name never grants subscription or publication authority.

## Browser responsibilities

The frontend may:

- obtain short-lived server-issued realtime authorization through the accepted backend contract;
- connect to the single approved same-origin realtime route;
- subscribe and unsubscribe from server-authorized channels;
- render trusted snapshots and deltas;
- track per-channel sequence or cursor state;
- detect duplicates, stale messages, and gaps;
- recover from an authoritative REST snapshot;
- resume or reconnect with bounded backoff;
- close all private subscriptions on logout or session expiration.

The frontend must not expose APIs that publish trusted market, news, execution, financial, compliance, or operational data. It must not send user-originated business commands through trusted-data channels.

## REST-only business mutations

Browser-originated mutations use authenticated same-origin REST APIs only. This includes:

- order preview, creation, cancellation, and replacement;
- watchlist and alert changes;
- compliance acknowledgements or document actions;
- notification preferences;
- support, report, and approved non-financial automation requests;
- authorized operator actions.

These commands require backend authentication and authorization, tenant/account resolution, CSRF for cookie sessions, validation, rate limiting, correlation IDs, audit evidence, idempotency, and optimistic concurrency where applicable. Realtime events report authoritative lifecycle changes after the command; they are never proof that the browser may author those changes.

## Snapshot and delta model

Initial state comes from an authenticated backend snapshot. Realtime events provide sequenced deltas.

For each authorized channel, the client must:

1. retain the last accepted server sequence or cursor;
2. reject duplicates and lower/stale sequences;
3. detect a discontinuity;
4. stop applying further deltas for the affected channel;
5. mark the associated UI as stale or recovering;
6. fetch the channel registry’s authoritative snapshot provider;
7. validate the recovered cursor/version;
8. replace local state and resume only from a safe point.

A gap must never be hidden by advancing the local cursor or by applying later messages onto uncertain state.

## Authorization and gateway rules

- Realtime tickets or tokens are short-lived and scoped to the authenticated user, tenant/account, protocol, and permitted channels where supported.
- The gateway validates every subscription server-side and rejects browser publication to trusted channels.
- The server validates WebSocket `Origin` and enforces connection, subscription, channel-count, message-size, heartbeat, and rate limits.
- Temporary credentials should use a secure subprotocol or equivalent where supported. When a URL parameter is unavoidable, frontend, edge, gateway, and application logs must omit or redact query strings.
- Authorization is refreshed after reconnect when the accepted protocol requires it.
- Logout, logout-all, session expiration, account-scope change, and tenant-scope change revoke or close affected subscriptions and clear channel-specific sequence state.

## One route, one protocol

A public realtime path represents exactly one protocol and one gateway.

- If `/ws/v2/` is routed to Centrifugo, the client uses the accepted Centrifugo connection/subscription-token contract and frames.
- If an application gateway route is authoritative, the client uses that gateway’s documented ticket, frame, and recovery contract.
- Centrifugo frames must never be sent to Django Channels, and an application-gateway frame must never be sent to Centrifugo.
- Legacy fallback remains disabled unless a separately reviewed migration explicitly proves one unambiguous route and safe downgrade behavior.

The deployed backend registry and release contract are authoritative. Frontend code must not switch to proposed channel names, envelopes, or recovery endpoints before the paired backend release advertises and certifies them.

## Canonical identity

Private and instrument-scoped channels use canonical backend identities, not ambiguous display symbols. Account or tenant identifiers are derived only from the authenticated backend session/bootstrap and never from untrusted browser input.

Provider symbols and internal provider payloads do not become browser authority. The backend normalizes them into the accepted public event contract before publication.

## Event requirements

Each trusted event must provide enough accepted contract data to establish:

- versioned event type;
- authorized channel identity;
- monotonic per-channel sequence or server cursor;
- canonical entity identity;
- server timestamp;
- authoritative data payload;
- correlation or causation reference where the contract exposes one.

The browser rejects undocumented aliases, missing sequence evidence, mismatched canonical identity, and events outside the current authenticated scope.

## User-visible states

Realtime-dependent UI must distinguish:

- connecting;
- live;
- delayed;
- disconnected;
- stale;
- sequence gap detected;
- recovering snapshot;
- unavailable;
- session expired;
- scope changed;
- recovery failed.

Do not show stale prices as tradable, optimistic fills as executions, or uncertain account state as current.

## Release gate

Production is blocked until exact-source integrated tests prove:

- no browser-originated trusted-data publishing;
- server-side subscription authorization and scoped credentials;
- one public route and protocol;
- duplicate/stale rejection;
- sequence-gap pause and authoritative snapshot recovery;
- bounded reconnect behavior;
- session/logout disconnection;
- REST-only user commands;
- no temporary credential leakage in logs;
- correct source and image identity for the paired frontend/backend release.
