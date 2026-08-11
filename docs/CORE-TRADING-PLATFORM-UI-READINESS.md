# Core trading platform UI readiness

The browser consumes only Beyvra `/api/v1/*` and `/ws/v2/` contracts. A build-time boundary check rejects direct CoinGecko, NewsData, Massive/Polygon, Alpaca, TradeStation, and IBKR host references from frontend source.

The platform labels order actions and results as simulation. Portfolio, positions, orders, trades, balances, news, and charts use provider-neutral fields. Missing authoritative values remain unavailable rather than inferred. The UI cannot enable server-side real trading, execution, deposits, withdrawals, transfers, custody, or payment rails.

Current state: `SIMULATION`; `PAPER` and `LIVE` are unavailable. Production and real-money flags remain false.

