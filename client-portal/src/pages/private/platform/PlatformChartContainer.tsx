import { useEffect, useRef, useState } from "react";
import TradeForm from "../../../components/tradeForm/TradeForm";
import "./platform.scss";
import {
  AreaChartIcon,
  BarChartIcon,
  CandleStickIcon,
  MainChartChangeIcon,
  ZoomInChartIcon,
  ZoomOutChartIcon,
} from "../../../assets/icons";
import { timeScaleMenu } from "utils/utils";
import DropdownMenu from "components/dropdownMenu/DropdownMenu";
import {
  CandlestickData,
  ColorType,
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  LineStyle,
  Time,
} from "lightweight-charts";

interface PlatformProps {
  themeSelect: string;
  topbarHeight: number;
  tradeFormHeight: number;
  bottomSidebarHeight: number;
}

const getBinanceWebSocketUrl = (symbol: string, interval: string) =>
  `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`;

const fetchHistoricalData = async (symbol: string, interval: string) => {
  const response = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1000`
  );
  const data = await response.json();
  return data.map((k: any) => ({
    time: (k[0] / 1000) as Time,
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
  }));
};

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
  const [tradingPair] = useState("BTCUSDT");
  const [candleInterval] = useState("1m");
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [userInteracted, setUserInteracted] = useState(false);

  // ------------------------------------------------------------------
  // 1) Fetch historical data + initialize WebSocket
  // ------------------------------------------------------------------
  useEffect(() => {
    let ws: WebSocket;

    const initializeChartData = async () => {
      try {
        const historicalData = await fetchHistoricalData(tradingPair, candleInterval);
        setChartData(historicalData);

        ws = new WebSocket(getBinanceWebSocketUrl(tradingPair, candleInterval));
        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.k) {
            const newCandle = {
              time: (message.k.t / 1000) as Time,
              open: parseFloat(message.k.o),
              high: parseFloat(message.k.h),
              low: parseFloat(message.k.l),
              close: parseFloat(message.k.c),
            };

            setChartData((prev) => {
              const lastCandle = prev[prev.length - 1];
              // Update existing candle or add new one
              return lastCandle?.time === newCandle.time
                ? [...prev.slice(0, -1), newCandle]
                : [...prev, newCandle];
            });
          }
        };
      } catch (error) {
        console.error("Failed to initialize chart data:", error);
      }
    };

    initializeChartData();
    return () => ws?.close();
  }, [tradingPair, candleInterval]);

  // ------------------------------------------------------------------
  // 2) Initialize / update the chart
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return;

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
    series.setData(chartData);
    chart.timeScale().fitContent();

    // Auto-scroll until user interacts
    const syncHandler = () => {
      if (!userInteracted) {
        chart.timeScale().scrollToRealTime();
      }
    };
    const interactionHandler = () => setUserInteracted(true);
    chart.subscribeCrosshairMove(interactionHandler);
    chart.timeScale().subscribeVisibleTimeRangeChange(syncHandler);

    chartRef.current = chart;
    seriesRef.current = series;

    return () => {
      chart.unsubscribeCrosshairMove(interactionHandler);
      chart.timeScale().unsubscribeVisibleTimeRangeChange(syncHandler);
      chart.remove();
    };
  }, [selectedChart, themeSelect, chartData, userInteracted]);

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
        <div ref={chartContainerRef} className="chart-container" style={{ height: "94%", position: 'relative', width: "84%", float: "right" }} >
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
              <button className="chart-type-button">
                <MainChartChangeIcon />
              </button>
            </DropdownMenu>

            {/* Zoom Buttons */}
            <div className="zoom-controls">
              <button onClick={() => handleZoom(true)}>
                <ZoomInChartIcon />
              </button>
              <button onClick={() => handleZoom(false)}>
                <ZoomOutChartIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section (Trade Form) */}
      <TradeForm bottomSidebarHeight={bottomSidebarHeight} />
    </div>
  );
};

export default PlatformChartContainer;
