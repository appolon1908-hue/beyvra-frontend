import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
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
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";
import { ChartDataController } from "./chart/ChartDataController";
import { EChartsAdapter, ChartType } from "./chart/EChartsAdapter";
import { ChartInterval } from "./chart/chartTypes";
import { IndicatorConfig } from "./chart/indicators/types";
import { loadIndicatorPreferences, saveIndicatorPreferences } from "./chart/indicators/preferences";
import { validateIndicatorConfig } from "./chart/indicators/IndicatorEngine";
import { DrawingStore } from "./chart/drawings/DrawingStore";
import { DrawingType } from "./chart/drawings/types";
import { TradeMarkerStore } from "./chart/trades/TradeMarkerStore";
import { NewsCalendarOverlayStore } from "./chart/events/NewsCalendarOverlayStore";
import { ChartEventDrawer } from "./chart/events/ChartEventDrawer";
import { useNewsCalendarOverlay } from "./hooks/useNewsCalendarOverlay";
import { ChartWorkspaceUIStore } from "./chart/ChartWorkspaceUIStore";
import { ChartOverlayErrorBoundary } from "./chart/ChartOverlayErrorBoundary";

interface PlatformProps { themeSelect: string; tradeFormHeight: number; bottomSidebarHeight: number }
const instrumentIdFor = (value: string) => `${value.replace(/USDT$|\/USD$/i, "").toUpperCase()}-USD`;

const PlatformChartContainer: React.FunctionComponent<PlatformProps> = ({ themeSelect }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<EChartsAdapter | undefined>(undefined);
  const initialThemeRef = useRef(themeSelect);
  const [indicators, setIndicators] = useState<IndicatorConfig[]>(loadIndicatorPreferences);
  const chartSymbol = useAppSelector((state) => state.socketStockCrypto.chartSymbol) || "BTC";
  const tradingPair = `${chartSymbol.replace(/USDT$|\/USD$/i, "").toUpperCase()}USDT`;
  const instrumentId = instrumentIdFor(tradingPair);
  const [cookies] = useCookies(["access_token"]);
  const accountScope = useAppSelector((state) => state.user.user?.id || state.user.user?.trader_id) || "guest-demo";
  const controller = useMemo(() => new ChartDataController(cookies.access_token || ""), [cookies.access_token]);
  const drawingStore = useMemo(() => new DrawingStore(), []);
  const tradeMarkerStore = useMemo(() => new TradeMarkerStore(), []);
  const newsCalendarStore = useMemo(() => new NewsCalendarOverlayStore(), []);
  const workspaceUIStore = useMemo(() => new ChartWorkspaceUIStore(), []);
  const chartState = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  const drawingState = useSyncExternalStore(drawingStore.subscribe, drawingStore.getSnapshot, drawingStore.getSnapshot);
  const tradeMarkerState = useSyncExternalStore(tradeMarkerStore.subscribe, tradeMarkerStore.getSnapshot, tradeMarkerStore.getSnapshot);
  const eventOverlayState = useSyncExternalStore(newsCalendarStore.subscribe, newsCalendarStore.getSnapshot, newsCalendarStore.getSnapshot);
  const workspaceUI = useSyncExternalStore(workspaceUIStore.subscribe, workspaceUIStore.getSnapshot, workspaceUIStore.getSnapshot);
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
  const eventTriggerRef = useRef<HTMLButtonElement>(null);
  const drawerOriginRef = useRef<HTMLElement | null>(null);
  const { trades: openTrades, refresh: refreshTrades, lastEvent: demoTradeEvent } = useDemoTrades(cookies.access_token, demoAccountId, workspaceBootstrap?.payload.realtime);
  const eventOverlay = useNewsCalendarOverlay(newsCalendarStore, cookies.access_token, instrumentId, eventOverlayState.visibility);
  const quote = chartState.quote ? Number(chartState.quote.mid) : undefined;
  const selectedChart: ChartType = workspaceUI.chartType; const drawingTool: DrawingType = workspaceUI.drawingTool;

  useEffect(() => { void controller.selectInstrument(instrumentId); return () => controller.stop(); }, [controller, instrumentId]);
  useEffect(() => { const timer = window.setInterval(() => controller.refreshQuoteAge(), 1_000); return () => window.clearInterval(timer); }, [controller]);
  useEffect(() => { const timer = window.setInterval(() => tradeMarkerStore.tick(), 1_000); return () => window.clearInterval(timer); }, [tradeMarkerStore]);
  useLayoutEffect(() => tradeMarkerStore.clearAccountScope(), [tradeMarkerStore, demoAccountId]);
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const adapter = new EChartsAdapter(); adapter.setNewsCalendarMarkerActivation((marker) => { drawerOriginRef.current = eventTriggerRef.current; newsCalendarStore.selectMarker(marker); workspaceUIStore.setDrawer("events"); }); adapter.mount(chartContainerRef.current, initialThemeRef.current, () => void controller.loadOlder(), { onCreate: (type, points) => drawingStore.create(type, points), onSelect: (id) => drawingStore.select(id), onMove: (id, points) => drawingStore.move(id, points) }); adapterRef.current = adapter;
    const observer = new ResizeObserver(([entry]) => { adapter.resize(); workspaceUIStore.setCompact(entry.contentRect.width < 768); }); observer.observe(chartContainerRef.current);
    return () => { observer.disconnect(); adapter.dispose(); adapterRef.current = undefined; };
  }, [controller, drawingStore, newsCalendarStore, workspaceUIStore]);
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
  useEffect(() => adapterRef.current?.setTradeMarkers(["all", "trades"].includes(eventOverlayState.filter) ? tradeMarkerStore.markersFor(instrumentId) : [], tradeMarkerState.estimatedServerNow), [tradeMarkerStore, tradeMarkerState, instrumentId, eventOverlayState.filter]);
  useEffect(() => newsCalendarStore.setInstrumentFilter(instrumentId), [newsCalendarStore, instrumentId]);
  useEffect(() => adapterRef.current?.setNewsCalendarMarkers(newsCalendarStore.markersFor()), [newsCalendarStore, eventOverlayState]);
  useEffect(() => { if (eventOverlayState.selectedEventType !== "NEWS" || !eventOverlayState.selectedEventId) return; const article = eventOverlayState.news.find((item) => item.article_id === eventOverlayState.selectedEventId); if (article && article.summary === undefined) void eventOverlay.loadNewsDetail(article.article_id); }, [eventOverlay, eventOverlayState.news, eventOverlayState.selectedEventId, eventOverlayState.selectedEventType]);
  useEffect(() => { setAmount((current) => Math.min(demoConfig.maxAmount, Math.max(demoConfig.minAmount, current))); if (!demoConfig.durations.includes(duration)) setDuration(demoConfig.durations[0] ?? 15); }, [demoConfig, duration]);
  useEffect(() => { const sync = () => workspaceUIStore.setFullscreen(Boolean(document.fullscreenElement)); document.addEventListener("fullscreenchange", sync); return () => document.removeEventListener("fullscreenchange", sync); }, [workspaceUIStore]);

  const submitDemoOrder = async (direction: "up" | "down") => {
    if (orderState === "submitting" || !quote || chartState.connectionState !== "connected") return;
    setOrderState("submitting"); setOrderError("");
    try { const order: DemoOrderRequest = { symbol: tradingPair, amount, duration, direction }; await authenticatedRequest<DemoTrade>(apiEndpoints.demo.orders, cookies.access_token, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(order) }); setOrderState("accepted"); await refreshTrades(); window.setTimeout(() => setOrderState("idle"), 1800); }
    catch (error) { recordPlatformEvent("order_rejected", { code: error instanceof ApiError ? error.code || `HTTP_${error.status}` : "UNKNOWN" }); logInternalError(error, { endpoint: "trading.order" }); setOrderError(toUserSafeErrorText(error, "trading")); setOrderState("rejected"); }
  };

  const closeTicket = () => { closeOverlay(); window.setTimeout(() => ticketTriggerRef.current?.focus(), 0); };
  const closeEventDrawer = useCallback(() => { newsCalendarStore.closeDrawer(); window.setTimeout(() => (drawerOriginRef.current || eventTriggerRef.current)?.focus(), 0); }, [newsCalendarStore]);
  const toggleFullscreen = useCallback(() => { const next = !workspaceUIStore.getSnapshot().fullscreen; workspaceUIStore.setFullscreen(next); const element = workspaceRef.current; if (next && element?.requestFullscreen) void element.requestFullscreen().catch(() => undefined); else if (!next && document.fullscreenElement) void document.exitFullscreen().catch(() => undefined); }, [workspaceUIStore]);
  const handleWorkspaceKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement; const editing = target.matches("input, textarea, select, [contenteditable='true']");
    if ((event.ctrlKey || event.metaKey) && !editing && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? drawingStore.redo() : drawingStore.undo(); return; }
    if ((event.ctrlKey || event.metaKey) && !editing && event.key.toLowerCase() === "y") { event.preventDefault(); drawingStore.redo(); return; }
    if (editing) return;
    if (event.key === "Escape") { if (drawingTool !== "select") { adapterRef.current?.cancelDrawing(); workspaceUIStore.cancelDrawing(); } else if (eventOverlayState.drawerOpen) closeEventDrawer(); else workspaceUIStore.setDrawer("none"); event.preventDefault(); }
    else if ((event.key === "Delete" || event.key === "Backspace") && drawingState.selectedId) { event.preventDefault(); drawingStore.remove(); }
    else if (event.key === "+" || event.key === "=") { event.preventDefault(); adapterRef.current?.zoom(-10); }
    else if (event.key === "-") { event.preventDefault(); adapterRef.current?.zoom(10); }
    else if (event.key === "Home") { event.preventDefault(); adapterRef.current?.centerLive(); }
  };
  const updateIndicator = (id: string, patch: Record<string, number | boolean | string>) => setIndicators((current) => current.map((indicator) => {
    if (indicator.id !== id) return indicator;
    const candidate = { ...indicator, ...patch } as IndicatorConfig;
    try { validateIndicatorConfig(candidate); return candidate; } catch { return indicator; }
  }));
  return <div className="trade-content"><div className="trade-graph"><div ref={workspaceRef} className={`chart-container chart-workspace${workspaceUI.fullscreen ? " is-fullscreen" : ""}${workspaceUI.compact ? " is-compact" : ""}`} aria-label={`${tradingPair} market chart`} tabIndex={0} onKeyDown={handleWorkspaceKeyDown}><div ref={chartContainerRef} className={`chart-surface chart-cursor-${workspaceUI.pointerMode}`} />
    <MarketStatus symbol={tradingPair} interval={chartState.interval} state={chartState.connectionState} marketStatus={chartState.marketStatus} error={chartState.error || ""} lastUpdate={chartState.quote ? Date.parse(chartState.quote.occurredAt) : undefined} onRetry={() => void controller.selectInstrument(instrumentId, chartState.interval)} />
    <ChartToolbar selectedChart={selectedChart} setSelectedChart={(type) => workspaceUIStore.setChartType(type)} candleInterval={chartState.interval} capabilities={chartState.capabilities} setCandleInterval={(interval) => void controller.selectInterval(interval)} handleZoom={(zoomIn) => adapterRef.current?.zoom(zoomIn ? -10 : 10)} resetView={() => adapterRef.current?.resetView()} centerLive={() => adapterRef.current?.centerLive()} indicators={indicators} updateIndicator={updateIndicator} drawingTool={drawingTool} setDrawingTool={(tool) => workspaceUIStore.setDrawingTool(tool)} drawingState={drawingState} drawingActions={{ remove: () => drawingStore.remove(), clear: () => drawingStore.clear(), lock: () => drawingStore.toggleLock(), visibility: () => drawingStore.toggleDrawingVisibility(), allVisibility: () => drawingStore.toggleAllVisibility(), undo: () => drawingStore.undo(), redo: () => drawingStore.redo(), updateText: (id, text) => drawingStore.updateText(id, text) }} activeToolbar={workspaceUI.activeDrawer} setActiveToolbar={(drawer) => workspaceUIStore.setDrawer(drawer)} fullscreen={workspaceUI.fullscreen} toggleFullscreen={toggleFullscreen} />
    <TradeMarkerSummary markers={["all", "trades"].includes(eventOverlayState.filter) ? tradeMarkerStore.markersFor(instrumentId) : []} serverNow={tradeMarkerState.estimatedServerNow} />
    <button ref={eventTriggerRef} type="button" className="event-overlay-trigger" aria-label="Open market events" aria-expanded={eventOverlayState.drawerOpen} onClick={(event) => { drawerOriginRef.current = event.currentTarget; if (!eventOverlayState.visibility) newsCalendarStore.setVisible(true); if (eventOverlayState.drawerOpen) { closeEventDrawer(); workspaceUIStore.setDrawer("none"); } else { newsCalendarStore.openDrawer(); workspaceUIStore.setDrawer("events"); } }}>News &amp; events</button>
    <div className="platform-visually-hidden" aria-label="Chart event markers">{newsCalendarStore.markersFor().map((marker) => <button type="button" key={marker.id} aria-label={`${marker.importance} ${marker.kind === "news" ? "news" : "economic event"}, ${marker.title}, ${new Date(marker.time).toUTCString()}`} onClick={(event) => { drawerOriginRef.current = event.currentTarget; newsCalendarStore.selectMarker(marker); }}>{marker.kind === "news" ? "N" : "E"}{marker.count > 1 ? ` ${marker.count}` : ""}</button>)}</div>
    {eventOverlayState.drawerOpen && <ChartOverlayErrorBoundary name="Market events"><ChartEventDrawer state={eventOverlayState} selectedEvents={newsCalendarStore.eventsForSelection()} message={eventOverlay.message} modal={workspaceUI.compact} close={closeEventDrawer} setFilter={(filter) => newsCalendarStore.setFilter(filter)} select={(id, type) => newsCalendarStore.openDrawer(id, type)} loadCalendar={() => void eventOverlay.loadCalendar()} /></ChartOverlayErrorBoundary>}
  </div></div>
  <button type="button" className="ticket-trigger" ref={ticketTriggerRef} onClick={() => openOverlay("trade")} aria-controls="platform-order-ticket" aria-expanded={isTicketOpen}>Open Demo Trade</button>
  {isTicketOpen && <button type="button" className="ticket-backdrop" onClick={closeTicket} aria-label="Close demo trade ticket" />}
  <TradeTicket open={isTicketOpen} symbol={tradingPair} quote={quote} amount={amount} setAmount={setAmount} duration={duration} setDuration={setDuration} orderState={orderState} orderError={orderError} connectionState={chartState.connectionState} submitDemoOrder={(direction) => void submitDemoOrder(direction)} trades={openTrades} durations={demoConfig.durations} minAmount={demoConfig.minAmount} maxAmount={demoConfig.maxAmount} amountStep={demoConfig.amountStep} payoutRate={demoConfig.payoutRate} close={closeTicket} />
  </div>;
};
export default PlatformChartContainer;
