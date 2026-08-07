import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import "./platform.scss";
import { useCookies } from "react-cookie";
import { useAppSelector } from "@store/hooks";
import { ApiError, authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { usePlatformOverlay } from "./PlatformOverlayContext";
import { DemoOrderRequest, DemoTrade } from "api/demo/types";
import { ChartToolbar, MarketStatus, TradeMarkerSummary, TradeTicket } from "./PlatformChartParts";
import { demoConfigFallback } from "api/demo/useDemoConfig";
import { useWorkspaceBootstrap } from "api/workspace/useWorkspaceBootstrap";
import { useDemoTrades } from "./hooks/useDemoTrades";
import { recordPlatformEvent } from "../../../observability/platformTelemetry";
import { ChartDataController } from "./chart/ChartDataController";
import { EChartsAdapter, ChartType } from "./chart/EChartsAdapter";
import { ChartInterval } from "./chart/chartTypes";
import { IndicatorConfig } from "./chart/indicators/types";
import { loadIndicatorPreferences, saveIndicatorPreferences } from "./chart/indicators/preferences";
import { validateIndicatorConfig } from "./chart/indicators/IndicatorEngine";
import { DrawingStore } from "./chart/drawings/DrawingStore";
import { DrawingType } from "./chart/drawings/types";
import { TradeMarkerStore } from "./chart/trades/TradeMarkerStore";

interface PlatformProps { themeSelect: string; tradeFormHeight: number; bottomSidebarHeight: number }
const instrumentIdFor = (value: string) => `${value.replace(/USDT$|\/USD$/i, "").toUpperCase()}-USD`;

const PlatformChartContainer: React.FunctionComponent<PlatformProps> = ({ themeSelect }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<EChartsAdapter | undefined>(undefined);
  const initialThemeRef = useRef(themeSelect);
  const [selectedChart, setSelectedChart] = useState<ChartType>("candlesticks");
  const [indicators, setIndicators] = useState<IndicatorConfig[]>(loadIndicatorPreferences);
  const [drawingTool, setDrawingTool] = useState<DrawingType>("select");
  const chartSymbol = useAppSelector((state) => state.socketStockCrypto.chartSymbol) || "BTC";
  const tradingPair = `${chartSymbol.replace(/USDT$|\/USD$/i, "").toUpperCase()}USDT`;
  const instrumentId = instrumentIdFor(tradingPair);
  const [cookies] = useCookies(["access_token"]);
  const accountScope = useAppSelector((state) => state.user.user?.id || state.user.user?.trader_id) || "guest-demo";
  const controller = useMemo(() => new ChartDataController(cookies.access_token || ""), [cookies.access_token]);
  const drawingStore = useMemo(() => new DrawingStore(), []);
  const tradeMarkerStore = useMemo(() => new TradeMarkerStore(), []);
  const chartState = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  const drawingState = useSyncExternalStore(drawingStore.subscribe, drawingStore.getSnapshot, drawingStore.getSnapshot);
  const tradeMarkerState = useSyncExternalStore(tradeMarkerStore.subscribe, tradeMarkerStore.getSnapshot, tradeMarkerStore.getSnapshot);
  const { overlay, openOverlay, closeOverlay } = usePlatformOverlay();
  const { data: workspaceBootstrap } = useWorkspaceBootstrap();
  const demoAccountId = workspaceBootstrap?.payload.account.id;
  const demoConfig = workspaceBootstrap?.rules ?? demoConfigFallback;
  const isTicketOpen = overlay.type === "trade";
  const [amount, setAmount] = useState(demoConfigFallback.minAmount * 100);
  const [duration, setDuration] = useState(15);
  const [orderState, setOrderState] = useState<"idle" | "submitting" | "accepted" | "rejected">("idle");
  const [orderError, setOrderError] = useState("");
  const ticketTriggerRef = useRef<HTMLButtonElement>(null);
  const { trades: openTrades, refresh: refreshTrades, lastEvent: demoTradeEvent } = useDemoTrades(cookies.access_token, demoAccountId);
  const quote = chartState.quote ? Number(chartState.quote.mid) : undefined;

  useEffect(() => { void controller.selectInstrument(instrumentId, "1m"); return () => controller.stop(); }, [controller, instrumentId]);
  useEffect(() => { const timer = window.setInterval(() => controller.refreshQuoteAge(), 1_000); return () => window.clearInterval(timer); }, [controller]);
  useEffect(() => { const timer = window.setInterval(() => tradeMarkerStore.tick(), 1_000); return () => window.clearInterval(timer); }, [tradeMarkerStore]);
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const adapter = new EChartsAdapter(); adapter.mount(chartContainerRef.current, initialThemeRef.current, () => void controller.loadOlder(), { onCreate: (type, points) => drawingStore.create(type, points), onSelect: (id) => drawingStore.select(id), onMove: (id, points) => drawingStore.move(id, points) }); adapterRef.current = adapter;
    const observer = new ResizeObserver(() => adapter.resize()); observer.observe(chartContainerRef.current);
    return () => { observer.disconnect(); adapter.dispose(); adapterRef.current = undefined; };
  }, [controller, drawingStore]);
  useEffect(() => adapterRef.current?.setTheme(themeSelect), [themeSelect]);
  useEffect(() => adapterRef.current?.setChartType(selectedChart), [selectedChart]);
  useEffect(() => { adapterRef.current?.setIndicators(indicators); saveIndicatorPreferences(indicators); }, [indicators]);
  useEffect(() => drawingStore.setScope(accountScope, instrumentId, chartState.interval), [drawingStore, accountScope, instrumentId, chartState.interval]);
  useEffect(() => adapterRef.current?.setDrawingTool(drawingTool), [drawingTool]);
  useEffect(() => adapterRef.current?.setDrawings(drawingState.drawings, drawingState.selectedId, drawingState.visible), [drawingState]);
  useEffect(() => adapterRef.current?.setCandles(chartState.candles), [chartState.candles]);
  useEffect(() => adapterRef.current?.setCurrentPrice(chartState.quote?.mid, chartState.connectionState), [chartState.quote?.mid, chartState.connectionState]);
  useEffect(() => { if (chartState.quote?.occurredAt) tradeMarkerStore.synchronizeServerTime(chartState.quote.occurredAt); }, [tradeMarkerStore, chartState.quote?.occurredAt]);
  useEffect(() => tradeMarkerStore.replaceInitial(openTrades, demoAccountId || accountScope), [tradeMarkerStore, openTrades, demoAccountId, accountScope]);
  useEffect(() => { if (demoTradeEvent) tradeMarkerStore.applyRealtime(demoTradeEvent, demoAccountId || accountScope); }, [tradeMarkerStore, demoTradeEvent, demoAccountId, accountScope]);
  useEffect(() => adapterRef.current?.setTradeMarkers(tradeMarkerStore.markersFor(instrumentId), tradeMarkerState.estimatedServerNow), [tradeMarkerStore, tradeMarkerState, instrumentId]);
  useEffect(() => { setAmount((current) => Math.min(demoConfig.maxAmount, Math.max(demoConfig.minAmount, current))); if (!demoConfig.durations.includes(duration)) setDuration(demoConfig.durations[0] ?? 15); }, [demoConfig, duration]);

  const submitDemoOrder = async (direction: "up" | "down") => {
    if (orderState === "submitting" || !quote || chartState.connectionState !== "connected") return;
    setOrderState("submitting"); setOrderError("");
    try { const order: DemoOrderRequest = { symbol: tradingPair, amount, duration, direction }; await authenticatedRequest<DemoTrade>(apiEndpoints.demo.orders, cookies.access_token, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(order) }); setOrderState("accepted"); await refreshTrades(); window.setTimeout(() => setOrderState("idle"), 1800); }
    catch (error) { recordPlatformEvent("order_rejected", { code: error instanceof ApiError ? error.code || `HTTP_${error.status}` : "UNKNOWN" }); setOrderError(error instanceof Error ? error.message : "Demo order was rejected."); setOrderState("rejected"); }
  };

  const closeTicket = () => { closeOverlay(); window.setTimeout(() => ticketTriggerRef.current?.focus(), 0); };
  const updateIndicator = (id: string, patch: Record<string, number | boolean | string>) => setIndicators((current) => current.map((indicator) => {
    if (indicator.id !== id) return indicator;
    const candidate = { ...indicator, ...patch } as IndicatorConfig;
    try { validateIndicatorConfig(candidate); return candidate; } catch { return indicator; }
  }));
  return <div className="trade-content"><div className="trade-graph"><div className="chart-container" aria-label={`${tradingPair} market chart`}><div ref={chartContainerRef} className="chart-surface" />
    <MarketStatus symbol={tradingPair} interval={chartState.interval} state={chartState.connectionState} error={chartState.error || ""} lastUpdate={chartState.quote ? Date.parse(chartState.quote.occurredAt) : undefined} onRetry={() => void controller.selectInstrument(instrumentId, chartState.interval)} />
    <ChartToolbar selectedChart={selectedChart} setSelectedChart={setSelectedChart} candleInterval={chartState.interval} capabilities={chartState.capabilities} setCandleInterval={(interval) => void controller.selectInterval(interval)} handleZoom={(zoomIn) => adapterRef.current?.zoom(zoomIn ? -10 : 10)} resetView={() => adapterRef.current?.resetView()} centerLive={() => adapterRef.current?.centerLive()} indicators={indicators} updateIndicator={updateIndicator} drawingTool={drawingTool} setDrawingTool={setDrawingTool} drawingState={drawingState} drawingActions={{ remove: () => drawingStore.remove(), clear: () => drawingStore.clear(), lock: () => drawingStore.toggleLock(), visibility: () => drawingStore.toggleDrawingVisibility(), allVisibility: () => drawingStore.toggleAllVisibility(), undo: () => drawingStore.undo(), redo: () => drawingStore.redo(), updateText: (id, text) => drawingStore.updateText(id, text) }} />
    <TradeMarkerSummary markers={tradeMarkerStore.markersFor(instrumentId)} serverNow={tradeMarkerState.estimatedServerNow} />
  </div></div>
  <button type="button" className="ticket-trigger" ref={ticketTriggerRef} onClick={() => openOverlay("trade")} aria-controls="platform-order-ticket" aria-expanded={isTicketOpen}>Open Demo Trade</button>
  {isTicketOpen && <button type="button" className="ticket-backdrop" onClick={closeTicket} aria-label="Close demo trade ticket" />}
  <TradeTicket open={isTicketOpen} symbol={tradingPair} quote={quote} amount={amount} setAmount={setAmount} duration={duration} setDuration={setDuration} orderState={orderState} orderError={orderError} connectionState={chartState.connectionState} submitDemoOrder={(direction) => void submitDemoOrder(direction)} trades={openTrades} durations={demoConfig.durations} minAmount={demoConfig.minAmount} maxAmount={demoConfig.maxAmount} amountStep={demoConfig.amountStep} payoutRate={demoConfig.payoutRate} close={closeTicket} />
  </div>;
};
export default PlatformChartContainer;
