import DropdownMenu from "components/dropdownMenu/DropdownMenu";
import { MainChartChangeIcon, ZoomInChartIcon, ZoomOutChartIcon } from "../../../assets/icons";
import { DemoTrade } from "api/demo/types";
import { ChartType } from "./chart/EChartsAdapter";
import { ChartInterval, TimeframeCapability } from "./chart/chartTypes";
import { IndicatorConfig } from "./chart/indicators/types";
import { DrawingState, DrawingType } from "./chart/drawings/types";
import { TradeChartMarker } from "./chart/trades/types";
import { WorkspaceDrawer } from "./chart/ChartWorkspaceUIStore";

export function MarketStatus({ symbol, interval, state, marketStatus, error, lastUpdate, candleCount, historyLoading, onRetry }: { symbol: string; interval: string; state: string; marketStatus: string; error: string; lastUpdate?: number; candleCount: number; historyLoading: boolean; onRetry: () => void }) {
  const label = marketStatus === "CLOSED" ? "MARKET CLOSED" : state === "connected" ? "LIVE" : state === "reconnected" ? "RECONNECTED" : state === "recovering" ? "RECOVERING GAP" : state === "loading" || state === "reconnecting" ? "RECONNECTING" : state === "stale" ? "STALE" : state === "disconnected" ? "DISCONNECTED" : "UNAVAILABLE";
  const stateMessage = state === "loading" ? "Loading market history…"
    : state === "recovering" ? "A live update was missed. Refreshing the trusted market snapshot…"
      : state === "reconnecting" ? "Live market feed interrupted. Reconnecting…"
        : state === "reconnected" ? "Live market feed restored."
          : state === "disconnected" ? "Live market feed disconnected."
            : state === "provider-unavailable" ? error || "Market data is temporarily unavailable."
              : error;
  return <>
    {state !== "connected" && <div className={`market-data-state market-data-state--${state}`} role="status" aria-live="polite">
      {stateMessage}
      {lastUpdate ? <span className="market-data-last-update">Last update {new Date(lastUpdate).toLocaleTimeString()}</span> : null}
      {(state === "error" || state === "disconnected" || state === "provider-unavailable") && <button type="button" onClick={onRetry}>Retry</button>}
    </div>}
    {state !== "loading" && candleCount === 0 && <div className="chart-empty-state" role="status">No market history is available for this instrument and timeframe.</div>}
    {historyLoading && <div className="chart-history-loading" role="status">Loading earlier candles…</div>}
    <div className="chart-status-bar" role="status" aria-live="polite">
      <span>{symbol}</span><span className={`quote-state quote-state--${state}`}>{label}</span><span>Interval: {interval}</span>
    </div>
  </>;
}

export function ChartToolbar({ selectedChart, setSelectedChart, candleInterval, capabilities, setCandleInterval, handleZoom, resetView, centerLive, indicators, updateIndicator, drawingTool, setDrawingTool, drawingState, drawingActions, activeToolbar, setActiveToolbar, fullscreen, toggleFullscreen }: {
  selectedChart: ChartType;
  setSelectedChart: (value: ChartType) => void;
  candleInterval: ChartInterval;
  capabilities: TimeframeCapability[];
  setCandleInterval: (value: ChartInterval) => void;
  handleZoom: (zoomIn: boolean) => void;
  resetView: () => void;
  centerLive: () => void;
  indicators: IndicatorConfig[];
  updateIndicator: (id: string, patch: Record<string, number | boolean | string>) => void;
  drawingTool: DrawingType;
  setDrawingTool: (tool: DrawingType) => void;
  drawingState: DrawingState;
  drawingActions: { remove: () => void; clear: () => void; lock: () => void; visibility: () => void; allVisibility: () => void; undo: () => void; redo: () => void; updateText: (id: string, text: string) => void };
  activeToolbar: WorkspaceDrawer;
  setActiveToolbar: (drawer: WorkspaceDrawer) => void;
  fullscreen: boolean;
  toggleFullscreen: () => void;
}) {
  return <div className="chart-controls">
    <DropdownMenu menuItems={[{ text: "Candlesticks", onclick: () => setSelectedChart("candlesticks") }, { text: "Heikin-Ashi", onclick: () => setSelectedChart("heikin-ashi") }, { text: "Area", onclick: () => setSelectedChart("area") }, { text: "Line", onclick: () => setSelectedChart("line") }, { text: "Bars", onclick: () => setSelectedChart("bar") }]}>
      <button type="button" className="chart-type-button" aria-label="Select chart type"><MainChartChangeIcon /></button>
    </DropdownMenu>
    <div className="zoom-controls">
      <button type="button" onClick={() => handleZoom(true)} aria-label="Zoom chart in"><ZoomInChartIcon /></button>
      <button type="button" onClick={() => handleZoom(false)} aria-label="Zoom chart out"><ZoomOutChartIcon /></button>
      <button type="button" onClick={resetView} aria-label="Reset chart view">Reset</button>
      <button type="button" onClick={centerLive} aria-label="Center live price">Live</button>
      <button type="button" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit chart fullscreen" : "Enter chart fullscreen"}>{fullscreen ? "Exit full screen" : "Full screen"}</button>
    </div>
    <div className="timeframe-controls" aria-label="Chart timeframe">
      {(["5s", "1m", "5m", "15m", "1h", "4h", "1d"] as ChartInterval[]).map((interval) => {
        const capability = capabilities.find((item) => item.interval === interval);
        const disabled = !capability?.available;
        return <button key={interval} type="button" disabled={disabled} title={disabled ? capability?.reason || "Market-data capability unavailable" : undefined} className={candleInterval === interval ? "selected" : ""} onClick={() => setCandleInterval(interval)} aria-pressed={candleInterval === interval}>{interval}</button>;
      })}
    </div>
    <details className="indicator-controls" open={activeToolbar === "indicators"} onToggle={(event) => setActiveToolbar(event.currentTarget.open ? "indicators" : "none")}><summary aria-label="Open indicators">Indicators</summary><div className="indicator-menu">
      {indicators.map((indicator) => <fieldset key={indicator.id}><label><input type="checkbox" checked={indicator.enabled} onChange={(event) => updateIndicator(indicator.id, { enabled: event.target.checked })} /> {indicator.type === "bollinger" ? "Bollinger Bands" : indicator.type.toUpperCase()}</label>
        {indicator.type === "macd" ? <><label>Fast<input aria-label="MACD fast period" type="number" min="2" max="200" value={indicator.fast} onChange={(event) => updateIndicator(indicator.id, { fast: Number(event.target.value) })} /></label><label>Slow<input aria-label="MACD slow period" type="number" min="3" max="500" value={indicator.slow} onChange={(event) => updateIndicator(indicator.id, { slow: Number(event.target.value) })} /></label><label>Signal<input aria-label="MACD signal period" type="number" min="2" max="200" value={indicator.signal} onChange={(event) => updateIndicator(indicator.id, { signal: Number(event.target.value) })} /></label></>
          : <label>Period<input aria-label={`${indicator.type.toUpperCase()} period`} type="number" min="2" max={indicator.type === "rsi" ? 200 : 500} value={indicator.period} onChange={(event) => updateIndicator(indicator.id, { period: Number(event.target.value) })} /></label>}
        {indicator.type === "bollinger" && <label>Deviation<input aria-label="Bollinger deviation" type="number" min="0.1" max="10" step="0.1" value={indicator.deviation} onChange={(event) => updateIndicator(indicator.id, { deviation: Number(event.target.value) })} /></label>}
      </fieldset>)}
    </div></details>
    <details className="drawing-controls" open={activeToolbar === "drawings"} onToggle={(event) => setActiveToolbar(event.currentTarget.open ? "drawings" : "none")}><summary aria-label="Open drawing tools">Drawings</summary><div className="drawing-menu" aria-label="Drawing tools">
      <div className="drawing-tools">{(["select", "trendline", "horizontal", "vertical", "fibonacci", "measurement", "text"] as DrawingType[]).map((tool) => <button key={tool} type="button" className={drawingTool === tool ? "selected" : ""} aria-pressed={drawingTool === tool} onClick={() => setDrawingTool(tool)}>{tool === "horizontal" ? "Support / resistance" : tool === "measurement" ? "Measure" : tool[0].toUpperCase() + tool.slice(1)}</button>)}</div>
      <div className="drawing-actions"><button type="button" disabled={!drawingState.selectedId} onClick={drawingActions.remove}>Delete</button><button type="button" disabled={!drawingState.drawings.length} onClick={drawingActions.clear}>Clear all</button><button type="button" disabled={!drawingState.selectedId} onClick={drawingActions.lock}>{drawingState.drawings.find((item) => item.id === drawingState.selectedId)?.locked ? "Unlock" : "Lock"}</button><button type="button" disabled={!drawingState.selectedId} onClick={drawingActions.visibility}>Hide/show selected</button><button type="button" onClick={drawingActions.allVisibility}>{drawingState.visible ? "Hide all" : "Show all"}</button><button type="button" disabled={!drawingState.canUndo} onClick={drawingActions.undo}>Undo</button><button type="button" disabled={!drawingState.canRedo} onClick={drawingActions.redo}>Redo</button></div>
      {drawingState.drawings.find((item) => item.id === drawingState.selectedId)?.type === "text" && <label>Annotation<input aria-label="Annotation text" maxLength={500} value={drawingState.drawings.find((item) => item.id === drawingState.selectedId)?.text || ""} onChange={(event) => drawingActions.updateText(drawingState.selectedId!, event.target.value)} /></label>}
    </div></details>
  </div>;
}

export function OpenTrades({ trades }: { trades: DemoTrade[] }) {
  const open = trades.filter((trade) => trade.state === "OPEN");
  return <details className="open-demo-trades" open><summary>Open Trades ({open.length})</summary>{open.map((trade) => <p key={String(trade.id)}>{trade.symbol} · {trade.direction.toUpperCase()} · {String(trade.amount)} · expires {new Date(trade.expiresAt).toLocaleTimeString()}</p>)}{open.length === 0 && <p>No open demo trades.</p>}</details>;
}

export function TradeMarkerSummary({ markers, serverNow }: { markers: TradeChartMarker[]; serverNow: number }) {
  return <div className="trade-marker-summary" aria-label="Demo trade chart markers">{markers.slice(0, 4).map((marker) => {
    const remaining = Math.max(0, Math.ceil(marker.expiryTime - serverNow / 1000)); const result = marker.status === "WON" ? "✓ WON" : marker.status === "LOST" ? "✕ LOST" : marker.status === "DRAW" ? "= DRAW" : marker.status;
    return <span key={marker.tradeId} data-trade-id={marker.tradeId} aria-label={`${marker.status === "ACTIVE" ? "Active" : marker.status.toLowerCase()} ${marker.direction} demo trade opened at ${marker.openPrice}, ${marker.status === "ACTIVE" || marker.status === "PENDING" ? `expires in ${remaining} seconds` : result}`}>{marker.direction === "UP" ? "▲" : "▼"} {marker.direction} · {result}{marker.status === "ACTIVE" || marker.status === "PENDING" ? ` · ${remaining}s` : ""}</span>;
  })}{markers.length > 4 && <span>+{markers.length - 4} more</span>}</div>;
}

export function TradeTicket({ symbol, quote, amount, setAmount, duration, setDuration, orderState, orderError, connectionState, submitDemoOrder, trades, close, open, durations, minAmount, maxAmount, amountStep, payoutRate }: {
  symbol: string; quote?: number; amount: number; setAmount: (value: number) => void; duration: number; setDuration: (value: number) => void; orderState: string; orderError: string; connectionState: string; submitDemoOrder: (direction: "up" | "down") => void; trades: DemoTrade[]; close: () => void; open: boolean; durations: number[]; minAmount: number; maxAmount: number; amountStep: number; payoutRate?: string;
}) {
  const safeDurations = durations.length ? durations : [5, 15, 30, 60];
  const index = Math.max(0, safeDurations.indexOf(duration));
  const canSubmit = orderState !== "submitting" && connectionState === "connected" && Boolean(quote);
  return <div id="platform-order-ticket" className={`trade-ticket-shell${open ? " is-open" : ""}`} data-open={open}><div className="trade-ticket-header"><span>Demo order</span><button type="button" onClick={close} aria-label="Close demo trade ticket">×</button></div><div className="demo-order-form" aria-label="Demo order ticket">
    <div className="demo-ticket-account"><span>DEMO Account</span><strong>Virtual funds only</strong></div><p className="demo-ticket-disclosure">{symbol} · Quote {quote ? quote.toFixed(2) : "unavailable"}</p>
    <div className="demo-control"><label htmlFor="demo-order-amount">Amount, Virtual USD</label><div className="demo-control-row"><button type="button" aria-label="Decrease demo amount" onClick={() => setAmount(Math.max(minAmount, amount - amountStep))}>−</button><input id="demo-order-amount" type="number" min={minAmount} max={maxAmount} step={amountStep} value={amount} onChange={(event) => setAmount(Math.min(maxAmount, Math.max(minAmount, Number(event.target.value) || minAmount)))} /><button type="button" aria-label="Increase demo amount" onClick={() => setAmount(Math.min(maxAmount, amount + amountStep))}>+</button></div></div>
    <div className="demo-control"><label htmlFor="demo-order-duration">Duration</label><div className="demo-control-row"><button type="button" aria-label="Decrease demo duration" disabled={index === 0} onClick={() => setDuration(safeDurations[Math.max(0, index - 1)])}>−</button><select id="demo-order-duration" value={duration} onChange={(event) => setDuration(Number(event.target.value))}>{safeDurations.map((value) => <option key={value} value={value}>{value} seconds</option>)}</select><button type="button" aria-label="Increase demo duration" disabled={index === safeDurations.length - 1} onClick={() => setDuration(safeDurations[Math.min(safeDurations.length - 1, index + 1)])}>+</button></div></div>
    <p className="demo-estimate">Estimated demo return: {payoutRate ? `${(Number(payoutRate) * 100).toFixed(0)}% payout under active demo rules.` : "calculated from active simulated-market rules."}</p>{!canSubmit && <p className="demo-safety-state" role="status">Waiting for a trusted market quote before enabling demo orders.</p>}<div className="demo-direction-actions"><button type="button" className="demo-up" disabled={!canSubmit} onClick={() => submitDemoOrder("up")}>↑ Up</button><button type="button" className="demo-down" disabled={!canSubmit} onClick={() => submitDemoOrder("down")}>↓ Down</button></div><p className="demo-quote">Quote: {quote ? quote.toFixed(2) : "Unavailable"}</p><p role="status" aria-live="polite">{orderState === "submitting" ? "Submitting…" : orderState === "accepted" ? "Demo trade accepted." : orderError}</p><button type="button" className="demo-how-it-works">ⓘ How it works</button><OpenTrades trades={trades} />
  </div></div>;
}
