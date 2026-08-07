# Chart Phase 4: demo trade markers

Trade markers are a read-only presentation of existing demo order and execution state. `TradeMarkerStore` consumes one bounded initial demo-state read and ordered `demo.order` / `demo.execution` events from the existing unified realtime connection. The marker layer cannot place, cancel, settle, or modify an order.

Each trade has one canonical marker keyed by trade ID. Per-trade status versions or event sequences reject duplicate and stale updates. Asset filtering hides unrelated markers without deleting state; timeframe changes retain the same time/price coordinates.

The overlay renders:

- UP/DOWN opening marker and open-price line;
- server-authoritative expiry boundary and locally ticking countdown;
- WON, LOST, DRAW, CANCELLED, REJECTED, or EXPIRED terminal marker when authoritative state arrives.

Countdown uses the clock offset derived from API/realtime server timestamps. The one-second display timer makes no HTTP requests. Missing settlement timestamps are never fabricated.

Safety classification:

```text
TRADE_MARKERS=DISPLAY_ONLY_DEMO_STATE
TRADE_MARKER_CREATES_ORDER=NO
TRADE_MARKER_CANCELS_ORDER=NO
TRADE_MARKER_SETTLES_ORDER=NO
TRADE_MARKER_LEDGER_EFFECT=0
TRADE_MARKER_FINANCIAL_DB_EFFECT=0
TRADE_MARKER_MARKET_API_CALLS=0
TRADE_MARKER_MARKET_WS_RECONNECTS=0
CANONICAL_CANDLE_MUTATIONS=0
INDICATOR_MUTATIONS=0
DRAWING_MUTATIONS=0
COUNTDOWN_HTTP_CALLS=0
```
