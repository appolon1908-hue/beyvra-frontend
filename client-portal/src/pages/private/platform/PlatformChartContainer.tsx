import { useEffect, useRef, useState } from "react";
import TradeForm from "../../../components/tradeForm/TradeForm";
import "./platform.scss";
import {
  MainChartChangeIcon,
  ZoomInChartIcon,
  ZoomOutChartIcon,
} from "../../../assets/icons";
import DropdownMenu from "components/dropdownMenu/DropdownMenu";
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
import { getApiUrl, getSocketUrl } from "utils/env";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";

interface PlatformProps {
  themeSelect: string;
  topbarHeight: number;
  tradeFormHeight: number;
  bottomSidebarHeight: number;
}

const PlatformChartContainer: React.FunctionComponent<PlatformProps> = ({
  themeSelect,
  topbarHeight,
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
  const [cookies] = useCookies(["access_token"]);
  const hasChartData = chartData.length > 0;

  useEffect(() => { chartDataRef.current = chartData; }, [chartData]);

  // ------------------------------------------------------------------
  // 1) Fetch historical data + initialize WebSocket
  // ------------------------------------------------------------------
  useEffect(() => {
    let ws: WebSocket | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    let retryCount = 0;
    let connecting = false;

    const connect = async () => {
      if (disposed || connecting || !cookies.access_token || ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) return;
      connecting = true;
      try {
        const { ws_ticket } = await webSocketTicketFetcher(cookies.access_token);
        if (disposed) return;
        ws = new WebSocket(getSocketUrl("ws/market-data/", {
          ws_ticket,
          symbol: tradingPair,
          interval: candleInterval,
        }));
      } catch (error) {
        if (disposed) return;
        setConnectionState("error");
        setChartError(error instanceof Error ? error.message : "Live market access is unavailable");
        retryCount += 1;
        retryTimer = setTimeout(() => void connect(), Math.min(1000 * 2 ** retryCount, 30000));
        return;
      } finally {
        connecting = false;
      }
      if (!ws) return;
      ws.onopen = () => {
        retryCount = 0;
        setConnectionState("connected");
        setChartError("");
      };
      ws.onclose = () => {
        if (disposed) return;
        setConnectionState("disconnected");
        retryCount += 1;
        retryTimer = setTimeout(() => void connect(), Math.min(1000 * 2 ** retryCount, 30000));
      };
      ws.onerror = () => setConnectionState("disconnected");
      ws.onmessage = (event) => {
        let message: Record<string, unknown>;
        try {
          message = JSON.parse(event.data) as Record<string, unknown>;
        } catch {
          setChartError("The market feed returned an invalid response");
          setConnectionState("error");
          return;
        }
        if (message.type === "status") {
          setConnectionState(message.status === "connected" ? "connected" : "disconnected");
          return;
        }
        if (message.type !== "candle") return;
        const newCandle = {
          time: message.time as Time,
          open: Number(message.open), high: Number(message.high),
          low: Number(message.low), close: Number(message.close),
        };
        setChartData((current) => {
          const lastCandle = current[current.length - 1];
          return lastCandle?.time === newCandle.time
            ? [...current.slice(0, -1), newCandle]
            : [...current, newCandle].slice(-1000);
        });
      };
    };

    const initializeChartData = async () => {
      try {
        setConnectionState("loading");
        userInteractedRef.current = false;
        setUserInteracted(false);
        const response = await fetch(
          getApiUrl(`trades/market/history/?symbol=${tradingPair}&interval=${candleInterval}&limit=500`),
          { headers: { Authorization: `Bearer ${cookies.access_token}` } },
        );
        if (!response.ok) throw new Error("Market history is unavailable");
        const payload = await response.json();
        if (!disposed) {
          const results = Array.isArray(payload.results) ? payload.results : [];
          setChartData(results);
          if (results.length === 0) setChartError("No market history is available for this asset");
        }
        void connect();
      } catch (error) {
        if (disposed) return;
        setChartError(error instanceof Error ? error.message : "Market data is unavailable");
        setConnectionState("error");
      }
    };

    if (cookies.access_token) void initializeChartData();
    return () => {
      disposed = true;
      if (retryTimer) clearTimeout(retryTimer);
      ws?.close();
    };
  }, [cookies.access_token, tradingPair, candleInterval]);

  // ------------------------------------------------------------------
  // 2) Initialize / update the chart
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!chartContainerRef.current || !hasChartData) return;

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
    series.setData(chartDataRef.current);
    chart.timeScale().fitContent();

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

    return () => {
      chart.unsubscribeCrosshairMove(interactionHandler);
      chart.timeScale().unsubscribeVisibleTimeRangeChange(syncHandler);
      chart.remove();
    };
  }, [selectedChart, themeSelect, hasChartData]);

  useEffect(() => {
    if (!seriesRef.current || chartData.length === 0) return;
    seriesRef.current.setData(chartData as never);
    if (!userInteracted) chartRef.current?.timeScale().scrollToRealTime();
  }, [chartData, userInteracted]);

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
    <div
      className="trade-content"
      style={{
        height: `calc(100% - ${topbarHeight}px)`,
      }}
    >
      <div className="trade-graph">
        {/* Chart Container */}
        <div ref={chartContainerRef} className="chart-container" aria-label={`${tradingPair} market chart`}>
          {connectionState !== "connected" && (
            <div className={`market-data-state market-data-state--${connectionState}`} role="status" aria-live="polite">
              {connectionState === "loading" && "Loading market history…"}
              {connectionState === "disconnected" && "Live market feed disconnected. Reconnecting…"}
              {connectionState === "error" && chartError}
            </div>
          )}
          <div className="chart-status-bar" role="status" aria-live="polite">
            <span>{tradingPair}</span>
            <span className={`quote-state quote-state--${connectionState}`}>{connectionState === "connected" ? "Demo feed connected" : connectionState}</span>
            <span>Interval: {candleInterval}</span>
          </div>
          {/* Chart Controls */}
          <div className="chart-controls">
            {/* Chart Type Dropdown */}
            <DropdownMenu
              menuItems={[
                { text: "Candlesticks", onclick: () => setSelectedChart("candlesticks") },
                { text: "Area", onclick: () => setSelectedChart("area") },
                { text: "Bars", onclick: () => setSelectedChart("bar") },
              ]}
            >
              <button type="button" className="chart-type-button" aria-label="Select chart type">
                <MainChartChangeIcon />
              </button>
            </DropdownMenu>

            {/* Zoom Buttons */}
            <div className="zoom-controls">
              <button type="button" onClick={() => handleZoom(true)} aria-label="Zoom chart in">
                <ZoomInChartIcon />
              </button>
              <button type="button" onClick={() => handleZoom(false)} aria-label="Zoom chart out">
                <ZoomOutChartIcon />
              </button>
            </div>
            <div className="timeframe-controls" aria-label="Chart timeframe">
              {["1m", "5m", "15m"].map((interval) => (
                <button
                  key={interval}
                  type="button"
                  className={candleInterval === interval ? "selected" : ""}
                  onClick={() => { userInteractedRef.current = false; setUserInteracted(false); setCandleInterval(interval); }}
                  aria-pressed={candleInterval === interval}
                >{interval}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section (Trade Form) */}
      <TradeForm
        bottomSidebarHeight={bottomSidebarHeight}
        disabled={connectionState !== "connected" || chartData.length === 0}
        showSetupOrder={false}
        showProfit={false}
      />
    </div>
  );
};

export default PlatformChartContainer;
