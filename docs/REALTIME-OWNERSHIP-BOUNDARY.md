# Realtime Ownership Boundary

This document defines the production security and ownership boundary for Beyvra
realtime data. It applies to the frontend SDK, realtime gateway, BFF, and provider
integrations.

## Trust direction

```text
MARKET / NEWS DATA
Provider -> Backend -> Realtime Gateway -> Frontend

USER COMMANDS
Frontend -> Authenticated REST API -> Backend
```

The backend/provider tier is the sole publisher and authority for market prices,
quotes, candles, order books, trades, executions, economic events, and news. Browser
clients have subscribe-only access to trusted realtime channels. Knowledge of a channel
name never grants subscription or publication authority.

## Frontend responsibilities

The browser must authenticate through the normal backend session flow, obtain
short-lived realtime authorization, open the approved authenticated transport, wait for
`gateway.ready`, subscribe to backend-authorized channels, process sequenced events,
and recover from reconnects or sequence gaps.

The frontend may expose `connect`, `subscribe`, `unsubscribe`, `resume`, and `close`.
It must not expose `publishMarket`, `publishQuote`, `publishNews`, `publishTrade`, or
another API that sends trusted data into market or news channels.

Initial market, news, calendar, and account state comes from authenticated REST
snapshots. Realtime messages provide deltas. On a sequence gap, the client must stop
applying live deltas for that channel until snapshot recovery completes.

## Realtime authorization and gateway rules

- Tickets or connection tokens are short-lived, single-use, tenant-bound, user-bound,
  and scope-bound to authorized channels where supported.
- The gateway authorizes every requested channel server-side and rejects all client
  publication attempts for market, news, and economic channels.
- Validate WebSocket `Origin` and enforce connection, subscription, message-size,
  channel-count, heartbeat, and reconnect limits.
- Avoid URL ticket exposure when a secure subprotocol or equivalent is supported. When
  a ticket must be in a URL, edge and application logs must redact query parameters.
- A resume request must use a server-issued cursor or last accepted sequence when the
  gateway cannot safely retain recovery state itself.
- The public V2 route represents one protocol and one gateway only. Centrifugo frames
  must never be sent to a Django Channels endpoint.

## Canonical channel and event contract

News channel identity uses Beyvra canonical instrument UUIDs, never provider symbols:

```text
news.market
news.instrument.{instrument_uuid}
news.economic
```

Economic event types remain in the news domain:

```text
news.economic.scheduled
news.economic.updated
news.economic.cancelled
```

Every event must include a versioned event type, channel, monotonic per-channel
sequence, `source`, `server_time`, and one canonical `data` object. News articles use
`article_id`, `canonical_url`, and `affected_instruments`; the frontend must not accept
legacy aliases such as `news_id`, `article_url`, or `instrument_refs` as trusted
production payloads.

## REST-only business mutations

Browser-originated business mutations use authenticated REST APIs only. This includes
order preview, order creation, cancellation, replacement, watchlist updates, compliance
acknowledgements, and notification preferences.

REST mutations require authentication, authorization, CSRF protection for cookie-based
sessions, request validation, rate limiting, audit logging, correlation IDs,
idempotency, and optimistic concurrency where applicable. Orders use preview -> user
confirmation -> idempotent submit; the backend remains authoritative for all lifecycle
states received later over private realtime channels.

## Release gate

Production is blocked until code and end-to-end tests demonstrate this boundary: no
browser-originated trusted-data publishing, server-side channel authorization, scoped
realtime credentials, sequence-gap snapshot recovery, REST-only user commands, and
unambiguous transport routing.