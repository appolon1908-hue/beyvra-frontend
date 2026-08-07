# Trading chart engine

The platform workspace uses Apache ECharts 6.1.x. `ChartDataController` is the only component allowed to request chart history or subscribe to market channels. `EChartsAdapter` owns the single canvas instance and disposes it only when the chart workspace unmounts.

The lifecycle is capabilities → snapshot → quote/candle subscriptions. Asset changes cancel prior HTTP, remove old subscriptions, fetch one snapshot, and reject responses or events for the previous generation. Timeframe changes retain the quote subscription and replace only candle history/subscription. Duplicate or older sequences are ignored; a sequence gap performs one snapshot recovery.

ECharts owns high-frequency rendering. Zoom, reset, center-live, chart-type changes, responsive panels, and demo-order controls do not call market APIs. Historical data is fetched once when the viewport crosses the oldest-loaded threshold and prepended without resetting the visible range.

## Five-second safety

The UI reads `/api/v1/instruments/{instrument}/market-data-capabilities`. Five seconds is disabled with `GENUINE_5S_SOURCE_UNAVAILABLE` unless the backend certifies a native or authoritative tick-derived source. There is no interpolation, polling fallback, browser aggregation, or silent 1m fallback.

## Current scope

Candlestick, Heikin-Ashi display transformation, bar, line, and area rendering share canonical candles. Current-price state and stale/disconnected styling use quote events. Indicator controls, drawing persistence, and news/economic-event markers remain later work and must not introduce additional market-data authorities.

The real staging snapshot remains fail-closed while provider governance is unresolved. The E2E suite uses an explicitly isolated deterministic response solely to test the deployed UI lifecycle; it is not real market data and is never stored.
