# Chart Phase 2: technical indicators

The indicator engine consumes the immutable canonical candle array produced by `ChartDataController`. It does not fetch market data, open or reconnect WebSockets, subscribe to channels, or write calculated points to an API.

Implemented display analytics:

- SMA and EMA on the price pane, with periods bounded to 2–500.
- RSI in a synchronized lower pane, with a period bounded to 2–200 and 30/70 guides.
- MACD in a synchronized lower pane, with bounded fast/slow/signal periods and `fast < slow` enforcement.
- Bollinger Bands on the price pane, with a period bounded to 2–500 and deviation bounded to 0.1–10.

Configuration is stored locally under `codestra.chart.indicators.v1`. Calculated values are never persisted. Invalid stored preferences fall back to safe defaults. Warm-up points are represented as `null`, never zero or fabricated values.

The price, RSI, and MACD panes share category data, linked axis pointers, and the same ECharts `dataZoom` controls. All series remain in the single long-lived ECharts instance created in Phase 1.

Safety classification:

```text
INDICATORS=DISPLAY_ANALYTICS_ONLY
ORDER_SETTLEMENT_DEPENDENCY=NONE
FINANCIAL_LEDGER_DEPENDENCY=NONE
MARKET_DATA_API_CALLS_FROM_INDICATORS=0
WEBSOCKET_CONNECTIONS_FROM_INDICATORS=0
```
