import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import "./platform.scss";
import { useCookies } from "react-cookie";
import { useAppSelector } from "@store/hooks";
import { ApiError, authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { usePlatformOverlay } from "./PlatformOverlayContext";
import { DemoOrderRequest, DemoTrade } from "api/demo/types";
import { ChartToolbar, MarketStatus, TradeTicket } from "./PlatformChartParts";
import { demoConfigFallback } from "api/demo/useDemoConfig";
import { useWorkspaceBootstrap } from "api/workspace/useWorkspaceBootstrap";
import { useDemoTrades } from "./hooks/useDemoTrades";
import { recordPlatformEvent } from "../../../observability/platformTelemetry";
import { ChartDataController } from "./chart/ChartDataController";
import { EChartsAdapter, ChartType } from "./chart/EChartsAdapter";
import { ChartInterval } from "./chart/chartTypes";

interface PlatformProps { themeSelect: string; tradeFormHeight: number; bottomSidebarHeight: number }
const instrumentIdFor = (value: string) => `${value.replace(/USDT$|\/USD$/i, "").toUpperCase()}-USD`;

const PlatformChartContainer: React.FunctionComponent<PlatformProps> = ({ themeSelect }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<EChartsAdapter | undefined>(undefined);
  const initialThemeRef = useRef(themeSelect);
  const [selectedChart, setSelectedChart] = useState<ChartType>("candlesticks");
  const chartSymbol = useAppSelector((state) => state.socketStockCrypto.chartSymbol) || "BTC";
  const tradingPair = `${chartSymbol.replace(/USDT$|\/USD$/i, "").toUpperCase()}USDT`;
  const instrumentId = instrumentIdFor(tradingPair);
  const [cookies] = useCookies(["access_token"]);
  const controller = useMemo(() => new ChartDataController(cookies.access_token || ""), [cookies.access_token]);
  const chartState = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);
  const { overlay, openOverlay, closeOverlay } = usePlatformOverlay();
  const { data: workspaceBootstrap } = useWorkspaceBootstrap();
  const demoConfig = workspaceBootstrap?.rules ?? demoConfigFallback;
  const isTicketOpen = overlay.type === "trade";
  const [amount, setAmount] = useState(demoConfigFallback.minAmount * 100);
  const [duration, setDuration] = useState(15);
  const [orderState, setOrderState] = useState<"idle" | "submitting" | "accepted" | "rejected">("idle");
  const [orderError, setOrderError] = useState("");
  const ticketTriggerRef = useRef<HTMLButtonElement>(null);
  const { trades: openTrades, refresh: refreshTrades } = useDemoTrades(cookies.access_token);
  const quote = chartState.quote ? Number(chartState.quote.mid) : undefined;

  useEffect(() => { void controller.selectInstrument(instrumentId, "1m"); return () => controller.stop(); }, [controller, instrumentId]);
  useEffect(() => { const timer = window.setInterval(() => controller.refreshQuoteAge(), 1_000); return () => window.clearInterval(timer); }, [controller]);
  useEffect(() => {
    if (!chartContainerRef.current) return;
    const adapter = new EChartsAdapter(); adapter.mount(chartContainerRef.current, initialThemeRef.current, () => void controller.loadOlder()); adapterRef.current = adapter;
    const observer = new ResizeObserver(() => adapter.resize()); observer.observe(chartContainerRef.current);
    return () => { observer.disconnect(); adapter.dispose(); adapterRef.current = undefined; };
  }, [controller]);
  useEffect(() => adapterRef.current?.setTheme(themeSelect), [themeSelect]);
  useEffect(() => adapterRef.current?.setChartType(selectedChart), [selectedChart]);
  useEffect(() => adapterRef.current?.setCandles(chartState.candles), [chartState.candles]);
  useEffect(() => adapterRef.current?.setCurrentPrice(chartState.quote?.mid, chartState.connectionState), [chartState.quote?.mid, chartState.connectionState]);
  useEffect(() => { setAmount((current) => Math.min(demoConfig.maxAmount, Math.max(demoConfig.minAmount, current))); if (!demoConfig.durations.includes(duration)) setDuration(demoConfig.durations[0] ?? 15); }, [demoConfig, duration]);

  const submitDemoOrder = async (direction: "up" | "down") => {
    if (orderState === "submitting" || !quote || chartState.connectionState !== "connected") return;
    setOrderState("submitting"); setOrderError("");
    try { const order: DemoOrderRequest = { symbol: tradingPair, amount, duration, direction }; await authenticatedRequest<DemoTrade>(apiEndpoints.demo.orders, cookies.access_token, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(order) }); setOrderState("accepted"); await refreshTrades(); window.setTimeout(() => setOrderState("idle"), 1800); }
    catch (error) { recordPlatformEvent("order_rejected", { code: error instanceof ApiError ? error.code || `HTTP_${error.status}` : "UNKNOWN" }); setOrderError(error instanceof Error ? error.message : "Demo order was rejected."); setOrderState("rejected"); }
  };

  const closeTicket = () => { closeOverlay(); window.setTimeout(() => ticketTriggerRef.current?.focus(), 0); };
  return <div className="trade-content"><div className="trade-graph"><div className="chart-container" aria-label={`${tradingPair} market chart`}><div ref={chartContainerRef} className="chart-surface" />
    <MarketStatus symbol={tradingPair} interval={chartState.interval} state={chartState.connectionState} error={chartState.error || ""} lastUpdate={chartState.quote ? Date.parse(chartState.quote.occurredAt) : undefined} onRetry={() => void controller.selectInstrument(instrumentId, chartState.interval)} />
    <ChartToolbar selectedChart={selectedChart} setSelectedChart={setSelectedChart} candleInterval={chartState.interval} capabilities={chartState.capabilities} setCandleInterval={(interval) => void controller.selectInterval(interval)} handleZoom={(zoomIn) => adapterRef.current?.zoom(zoomIn ? -10 : 10)} resetView={() => adapterRef.current?.resetView()} centerLive={() => adapterRef.current?.centerLive()} />
  </div></div>
  <button type="button" className="ticket-trigger" ref={ticketTriggerRef} onClick={() => openOverlay("trade")} aria-controls="platform-order-ticket" aria-expanded={isTicketOpen}>Open Demo Trade</button>
  {isTicketOpen && <button type="button" className="ticket-backdrop" onClick={closeTicket} aria-label="Close demo trade ticket" />}
  <TradeTicket open={isTicketOpen} symbol={tradingPair} quote={quote} amount={amount} setAmount={setAmount} duration={duration} setDuration={setDuration} orderState={orderState} orderError={orderError} connectionState={chartState.connectionState} submitDemoOrder={(direction) => void submitDemoOrder(direction)} trades={openTrades} durations={demoConfig.durations} minAmount={demoConfig.minAmount} maxAmount={demoConfig.maxAmount} amountStep={demoConfig.amountStep} payoutRate={demoConfig.payoutRate} close={closeTicket} />
  </div>;
};
export default PlatformChartContainer;
