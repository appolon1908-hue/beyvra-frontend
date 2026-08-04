import { SeriesMarker, Time } from "lightweight-charts";
import DropdownMenu from "components/dropdownMenu/DropdownMenu";
import { MainChartChangeIcon, ZoomInChartIcon, ZoomOutChartIcon } from "../../../assets/icons";
import { DemoTrade } from "api/demo/types";

export function MarketStatus({ symbol, interval, state, error }: { symbol: string; interval: string; state: string; error: string }) {
  return <>
    {state !== "connected" && <div className={`market-data-state market-data-state--${state}`} role="status" aria-live="polite">
      {state === "loading" ? "Loading market history…" : state === "disconnected" ? "Live market feed disconnected. Reconnecting…" : error}
    </div>}
    <div className="chart-status-bar" role="status" aria-live="polite">
      <span>{symbol}</span><span className={`quote-state quote-state--${state}`}>{state === "connected" ? "Demo feed connected" : state}</span><span>Interval: {interval}</span>
    </div>
  </>;
}

export function ChartToolbar({ selectedChart, setSelectedChart, candleInterval, setCandleInterval, handleZoom }: {
  selectedChart: "area" | "candlesticks" | "bar";
  setSelectedChart: (value: "area" | "candlesticks" | "bar") => void;
  candleInterval: string;
  setCandleInterval: (value: string) => void;
  handleZoom: (zoomIn: boolean) => void;
}) {
  return <div className="chart-controls">
    <DropdownMenu menuItems={[{ text: "Candlesticks", onclick: () => setSelectedChart("candlesticks") }, { text: "Area", onclick: () => setSelectedChart("area") }, { text: "Bars", onclick: () => setSelectedChart("bar") }]}>
      <button type="button" className="chart-type-button" aria-label="Select chart type"><MainChartChangeIcon /></button>
    </DropdownMenu>
    <div className="zoom-controls">
      <button type="button" onClick={() => handleZoom(true)} aria-label="Zoom chart in"><ZoomInChartIcon /></button>
      <button type="button" onClick={() => handleZoom(false)} aria-label="Zoom chart out"><ZoomOutChartIcon /></button>
    </div>
    <div className="timeframe-controls" aria-label="Chart timeframe">
      {["1m", "5m", "15m"].map((interval) => <button key={interval} type="button" className={candleInterval === interval ? "selected" : ""} onClick={() => setCandleInterval(interval)} aria-pressed={candleInterval === interval}>{interval}</button>)}
    </div>
  </div>;
}

export function TradeMarkers({ trades }: { trades: DemoTrade[] }): SeriesMarker<Time>[] {
  const markers: SeriesMarker<Time>[] = [];
  trades.forEach((trade) => {
    const openedAt = Date.parse(trade.openedAt);
    if (!Number.isFinite(openedAt)) return;
    const settled = ["WON", "LOST", "DRAW"].includes(String(trade.result || trade.state).toUpperCase());
    const result = String(trade.result || trade.state || "OPEN").toUpperCase();
    const direction = trade.direction.toLowerCase();
    const label = `#${String(trade.id)} ${direction === "up" ? "UP" : "DOWN"} $${String(trade.amount)}`;
    markers.push({ time: Math.floor(openedAt / 1000) as Time, position: direction === "up" ? "belowBar" : "aboveBar", color: settled ? (result === "LOST" ? "#ff5c68" : "#34d27b") : "#12e6d0", shape: direction === "up" ? "arrowUp" : "arrowDown", text: settled ? `${label} · ${result}` : `${label} · OPEN` });
    if (settled && trade.closingPrice != null && trade.expiresAt) {
      const expiresAt = Date.parse(trade.expiresAt);
      if (Number.isFinite(expiresAt)) markers.push({ time: Math.floor(expiresAt / 1000) as Time, position: direction === "up" ? "aboveBar" : "belowBar", color: result === "LOST" ? "#ff5c68" : "#34d27b", shape: "circle", text: `${result} ${String(trade.closingPrice)}` });
    }
  });
  return markers.sort((a, b) => Number(a.time) - Number(b.time));
}

export function OpenTrades({ trades }: { trades: DemoTrade[] }) {
  const open = trades.filter((trade) => trade.state === "OPEN");
  return <details className="open-demo-trades" open><summary>Open Trades ({open.length})</summary>{open.map((trade) => <p key={String(trade.id)}>{trade.symbol} · {trade.direction.toUpperCase()} · {String(trade.amount)} · expires {new Date(trade.expiresAt).toLocaleTimeString()}</p>)}{open.length === 0 && <p>No open demo trades.</p>}</details>;
}

export function TradeTicket({ symbol, quote, amount, setAmount, duration, setDuration, orderState, orderError, connectionState, submitDemoOrder, trades, close, open }: {
  symbol: string; quote?: number; amount: number; setAmount: (value: number) => void; duration: number; setDuration: (value: number) => void; orderState: string; orderError: string; connectionState: string; submitDemoOrder: (direction: "up" | "down") => void; trades: DemoTrade[]; close: () => void; open: boolean;
}) {
  const durations = [5, 15, 30, 60];
  const index = durations.indexOf(duration);
  const canSubmit = orderState !== "submitting" && connectionState === "connected" && Boolean(quote);
  return <div className={`trade-ticket-shell${open ? " is-open" : ""}`} data-open={open}><div className="trade-ticket-header"><span>Demo order</span><button type="button" onClick={close} aria-label="Close demo trade ticket">×</button></div><div className="demo-order-form" aria-label="Demo order ticket">
    <div className="demo-ticket-account"><span>DEMO Account</span><strong>Virtual funds only</strong></div><p className="demo-ticket-disclosure">{symbol} · Quote {quote ? quote.toFixed(2) : "unavailable"}</p>
    <div className="demo-control"><label htmlFor="demo-order-amount">Amount, Virtual USD</label><div className="demo-control-row"><button type="button" aria-label="Decrease demo amount" onClick={() => setAmount(Math.max(1, amount - 10))}>−</button><input id="demo-order-amount" type="number" min={1} step={1} value={amount} onChange={(event) => setAmount(Math.max(1, Number(event.target.value) || 1))} /><button type="button" aria-label="Increase demo amount" onClick={() => setAmount(amount + 10)}>+</button></div></div>
    <div className="demo-control"><label htmlFor="demo-order-duration">Duration</label><div className="demo-control-row"><button type="button" aria-label="Decrease demo duration" onClick={() => setDuration(durations[Math.max(0, index - 1)])}>−</button><select id="demo-order-duration" value={duration} onChange={(event) => setDuration(Number(event.target.value))}>{durations.map((value) => <option key={value} value={value}>{value} seconds</option>)}</select><button type="button" aria-label="Increase demo duration" onClick={() => setDuration(durations[Math.min(durations.length - 1, index + 1)])}>+</button></div></div>
    <p className="demo-estimate">Estimated demo return is calculated from the active simulated-market rules.</p><div className="demo-direction-actions"><button type="button" className="demo-up" disabled={!canSubmit} onClick={() => submitDemoOrder("up")}>↑ Up</button><button type="button" className="demo-down" disabled={!canSubmit} onClick={() => submitDemoOrder("down")}>↓ Down</button></div><p className="demo-quote">Quote: {quote ? quote.toFixed(2) : "Unavailable"}</p><p role="status" aria-live="polite">{orderState === "submitting" ? "Submitting…" : orderState === "accepted" ? "Demo trade accepted." : orderError}</p><button type="button" className="demo-how-it-works">ⓘ How it works</button><OpenTrades trades={trades} />
  </div></div>;
}
