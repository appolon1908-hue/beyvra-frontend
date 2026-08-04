import { useEffect, useRef, useState } from "react";
import "./platform.scss";
import {
  CandlestickData,
  ColorType,
  createChart,
  IChartApi,
  ISeriesApi,
  LineStyle,
  Time,
} from "lightweight-charts";
import { useCookies } from "react-cookie";
import { useAppSelector } from "@store/hooks";
import { ApiError, authenticatedRequest } from "api/client";
import { usePlatformOverlay } from "./PlatformOverlayContext";
import { DemoOrderRequest, DemoTrade } from "api/demo/types";
import { ChartToolbar, MarketStatus, TradeMarkers, TradeTicket } from "./PlatformChartParts";
import { useDemoConfig, demoConfigFallback } from "api/demo/useDemoConfig";
import { useMarketHistory } from "./hooks/useMarketHistory";
import { useMarketFeed } from "./hooks/useMarketFeed";
import { recordPlatformEvent } from "../../../observability/platformTelemetry";

interface PlatformProps {
  themeSelect: string;
  tradeFormHeight: number;
  bottomSidebarHeight: number;
}

const PlatformChartContainer: React.FunctionComponent<PlatformProps> = ({
  themeSelect,
  tradeFormHeight,
  bottomSidebarHeight,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick" | "Area" | "Bar", Time> | null>(null);

  const [selectedChart, setSelectedChart] = useState<"area" | "candlesticks" | "bar">("candlesticks");
  const chartSymbol = useAppSelector((state) => state.socketStockCrypto.chartSymbol) || "BTC";
  const tradingPair = `${chartSymbol.replace(/USDT$|\/USD$/i, "").toUpperCase()}USDT`;
  const [candleInterval, setCandleInterval] = useState("1m");
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [userInteracted, setUserInteracted] = useState(false);
  const chartDataRef = useRef<CandlestickData[]>([]);
  const userInteractedRef = useRef(false);
  const [connectionState, setConnectionState] = useState<"loading" | "connected" | "disconnected" | "error">("loading");
  const [chartError, setChartError] = useState("");
  const ticketTriggerRef = useRef<HTMLButtonElement>(null);
  const { overlay, openOverlay, closeOverlay } = usePlatformOverlay();
  const { data: demoConfig = demoConfigFallback } = useDemoConfig();
  const isTicketOpen = overlay.type === "trade";
  const [amount, setAmount] = useState(demoConfigFallback.minAmount * 100);
  const [duration, setDuration] = useState(15);
  const [orderState, setOrderState] = useState<"idle" | "submitting" | "accepted" | "rejected">("idle");
  const [orderError, setOrderError] = useState("");
  const [openTrades, setOpenTrades] = useState<DemoTrade[]>([]);
  const [cookies] = useCookies(["access_token"]);
  const quote = chartData.at(-1)?.close;

  useEffect(() => {
    setAmount((current) => Math.min(demoConfig.maxAmount, Math.max(demoConfig.minAmount, current)));
    if (!demoConfig.durations.includes(duration)) setDuration(demoConfig.durations[0] ?? 15);
  }, [demoConfig, duration]);

  const loadDemoTrades = async () => {
    if (!cookies.access_token) return;
    try {
      const payload = await authenticatedRequest<DemoTrade[] | { results: DemoTrade[] }>("v1/demo/trades", cookies.access_token);
      const trades = Array.isArray(payload) ? payload : payload.results;
      if (Array.isArray(trades)) setOpenTrades(trades);
    } catch {
      // A transient poll failure must not clear the last server-authoritative state.
    }
  };
  // Poll server state so refresh/reconnect never relies on browser-local trades.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void loadDemoTrades(); const timer = window.setInterval(() => void loadDemoTrades(), 5000); return () => window.clearInterval(timer); }, [cookies.access_token]);

  const submitDemoOrder = async (direction: "up" | "down") => {
    if (orderState === "submitting" || !quote || connectionState !== "connected") return;
    setOrderState("submitting"); setOrderError("");
    try {
      const order: DemoOrderRequest = { symbol: tradingPair, amount, duration, direction };
      await authenticatedRequest<DemoTrade>("v1/demo/orders", cookies.access_token, { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: JSON.stringify(order) });
      setOrderState("accepted"); await loadDemoTrades(); window.setTimeout(() => setOrderState("idle"), 1800);
    } catch (error) { recordPlatformEvent("order_rejected", { code: error instanceof ApiError ? error.code || `HTTP_${error.status}` : "UNKNOWN" }); setOrderError(error instanceof Error ? error.message : "Demo order was rejected."); setOrderState("rejected"); }
  };

  useEffect(() => {
    if (!isTicketOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeOverlay();
        window.setTimeout(() => ticketTriggerRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isTicketOpen, closeOverlay]);
  useEffect(() => { chartDataRef.current = chartData; }, [chartData]);

  const history = useMarketHistory({ token: cookies.access_token, symbol: tradingPair, interval: candleInterval, onState: setConnectionState, onError: setChartError });
  useEffect(() => {
    setChartData(history);
    userInteractedRef.current = false;
    setUserInteracted(false);
  }, [history]);
  useMarketFeed({ token: cookies.access_token, symbol: tradingPair, interval: candleInterval, enabled: history.length > 0, onState: setConnectionState, onError: setChartError, onCandle: (newCandle) => setChartData((current) => {
    const lastCandle = current[current.length - 1];
    return lastCandle?.time === newCandle.time ? [...current.slice(0, -1), newCandle] : [...current, newCandle].slice(-1000);
  }) });

  // ------------------------------------------------------------------
  // 2) Initialize / update the chart
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create or re-create the chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: themeSelect === "night" ? "#FFFFFF" : "#000000",
      },
      grid: {
        vertLines: { color: "#2B2B43", style: LineStyle.SparseDotted },
        horzLines: { color: "#363C4E", style: LineStyle.SparseDotted },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.1, bottom: 0.2 },
      },
      timeScale: {
        rightOffset: 15,
        barSpacing: 25,
        lockVisibleTimeRangeOnResize: true,
        fixLeftEdge: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    // Add the proper series (candlestick, area, or bar)
    let series: ISeriesApi<"Candlestick" | "Area" | "Bar", Time>;
    if (selectedChart === "candlesticks") {
      series = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        priceFormat: { type: "price", precision: 2, minMove: 0.01 },
      });
    } else if (selectedChart === "area") {
      series = chart.addAreaSeries({
        lineColor: "#1973FA",
        topColor: "rgba(25, 115, 250, 0.4)",
        bottomColor: "rgba(25, 115, 250, 0.05)",
        priceFormat: { type: "price", precision: 2, minMove: 0.01 },
      });
    } else {
      // 'bar'
      series = chart.addBarSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        priceFormat: { type: "price", precision: 2, minMove: 0.01 },
      });
    }

    // Set data and fit
    if (chartDataRef.current.length > 0) {
      series.setData(chartDataRef.current);
      chart.timeScale().fitContent();
    }

    // Auto-scroll until user interacts
    const syncHandler = () => {
      if (!userInteractedRef.current) {
        chart.timeScale().scrollToRealTime();
      }
    };
    const interactionHandler = () => {
      userInteractedRef.current = true;
      setUserInteracted(true);
    };
    chart.subscribeCrosshairMove(interactionHandler);
    chart.timeScale().subscribeVisibleTimeRangeChange(syncHandler);

    chartRef.current = chart;
    seriesRef.current = series;

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(([entry]) => {
          const { width, height } = entry.contentRect;
          if (width < 1 || height < 1) return;
          chart.applyOptions({ width: Math.floor(width), height: Math.floor(height) });
        })
      : undefined;
    resizeObserver?.observe(chartContainerRef.current);

    return () => {
      resizeObserver?.disconnect();
      chart.unsubscribeCrosshairMove(interactionHandler);
      chart.timeScale().unsubscribeVisibleTimeRangeChange(syncHandler);
      chart.remove();
    };
  }, [selectedChart, themeSelect]);

  useEffect(() => {
    if (!seriesRef.current || chartData.length === 0) return;
    seriesRef.current.setData(chartData as never);
    if (!userInteracted) chartRef.current?.timeScale().scrollToRealTime();
  }, [chartData, userInteracted]);

  // Trade markers are derived only from the server response. Mapping by trade id
  // makes polling/reconnects idempotent and replaces OPEN with the settled result.
  useEffect(() => {
    if (!seriesRef.current) return;
    seriesRef.current.setMarkers(TradeMarkers({ trades: openTrades }));
  }, [openTrades]);

  // ------------------------------------------------------------------
  // 3) Handle window resize
  // ------------------------------------------------------------------
  useEffect(() => {
    const handleResize = () => {
      if (!chartRef.current || !chartContainerRef.current) return;
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ------------------------------------------------------------------
  // 4) Zoom controls
  // ------------------------------------------------------------------
  const handleZoom = (zoomIn: boolean) => {
    if (!chartRef.current) return;
    const currentSpacing = chartRef.current.timeScale().options().barSpacing || 25;
    // Example: "zoom in" = multiply by 0.9, so that effectively moves the view closer
    const newSpacing = zoomIn ? currentSpacing * 0.9 : currentSpacing * 1.1;
    chartRef.current.timeScale().applyOptions({
      barSpacing: Math.max(5, Math.min(100, newSpacing)),
    });
  };

  // ------------------------------------------------------------------
  // 5) Return matching design
  // ------------------------------------------------------------------
  return (
    <div className="trade-content">
      <div className="trade-graph">
        {/* Chart Container */}
        <div ref={chartContainerRef} className="chart-container" aria-label={`${tradingPair} market chart`}>
          <MarketStatus symbol={tradingPair} interval={candleInterval} state={connectionState} error={chartError} />
          <ChartToolbar selectedChart={selectedChart} setSelectedChart={setSelectedChart} candleInterval={candleInterval} setCandleInterval={(interval) => { userInteractedRef.current = false; setUserInteracted(false); setCandleInterval(interval); }} handleZoom={handleZoom} />
        </div>
      </div>

      <button
        type="button"
        className="ticket-trigger"
        ref={ticketTriggerRef}
        onClick={() => openOverlay("trade")}
        aria-controls="platform-order-ticket"
        aria-expanded={isTicketOpen}
      >
        Open Demo Trade
      </button>
      {isTicketOpen && <button type="button" className="ticket-backdrop" onClick={() => { closeOverlay(); window.setTimeout(() => ticketTriggerRef.current?.focus(), 0); }} aria-label="Close demo trade ticket" />}
      <div id="platform-order-ticket">
        <TradeTicket open={isTicketOpen} symbol={tradingPair} quote={quote} amount={amount} setAmount={setAmount} duration={duration} setDuration={setDuration} orderState={orderState} orderError={orderError} connectionState={connectionState} submitDemoOrder={(direction) => void submitDemoOrder(direction)} trades={openTrades} durations={demoConfig.durations} minAmount={demoConfig.minAmount} maxAmount={demoConfig.maxAmount} amountStep={demoConfig.amountStep} payoutRate={demoConfig.payoutRate} close={() => { closeOverlay(); window.setTimeout(() => ticketTriggerRef.current?.focus(), 0); }} />
      </div>
    </div>
  );
};

export default PlatformChartContainer;
