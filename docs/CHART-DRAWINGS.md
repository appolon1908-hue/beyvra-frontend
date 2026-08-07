# Chart Phase 3: display-only drawings

The drawing subsystem is local display state layered over the single Phase-1 ECharts instance. It does not read or write market APIs, open WebSockets, create subscriptions, trigger orders, or mutate candles and indicators.

Implemented tools:

- select/move, trendline, horizontal support/resistance, vertical line;
- Fibonacci retracement at 0%, 23.6%, 38.2%, 50%, 61.8%, 78.6%, and 100%;
- measurement/ruler and text annotations;
- delete, clear all, lock/unlock, per-drawing and global visibility, undo, and redo.

Every persisted point uses `{time, price}` chart coordinates. Drawings are keyed in local storage by authenticated account reference, instrument, and interval. Calculated screen pixels are never persisted. Invalid records are ignored and storage failures do not prevent chart loading.

`DrawingLayer` converts chart coordinates to pixels only for rendering. It redraws after candle/history replacement, zoom, pan, auto-fit/reset, and resize. A drawing never changes follow-live mode or forces the viewport to the latest candle.

Safety classification:

```text
DRAWINGS=DISPLAY_ONLY_USER_STATE
DRAWING_MARKET_API_CALLS=0
DRAWING_WS_CONNECTIONS=0
DRAWING_WS_SUBSCRIPTIONS=0
CANONICAL_CANDLE_MUTATIONS=0
INDICATOR_DATA_MUTATIONS=0
DRAWING_CREATES_ORDER=NO
DRAWING_AFFECTS_SETTLEMENT=NO
DRAWING_AFFECTS_LEDGER=NO
```
