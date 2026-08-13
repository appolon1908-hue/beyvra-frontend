import * as echarts from "echarts";
import { CanonicalCandle, ChartConnectionState } from "./chartTypes";
import { IndicatorEngine } from "./indicators/IndicatorEngine";
import { IndicatorConfig, IndicatorResult } from "./indicators/types";
import { DrawingLayer, DrawingLayerCallbacks } from "./drawings/DrawingLayer";
import { ChartDrawing, DrawingType } from "./drawings/types";
import { TradeMarkerLayer } from "./trades/TradeMarkerLayer";
import { TradeChartMarker } from "./trades/types";
import { NewsCalendarMarkerLayer } from "./events/NewsCalendarMarkerLayer";
import { OverlayMarker } from "./events/types";
import { calculatePaneLayout } from "./paneLayout";

export type ChartType = "candlesticks" | "heikin-ashi" | "bar" | "line" | "area";

function heikinAshi(candles: CanonicalCandle[]) {
  let previousOpen = Number(candles[0]?.open || 0); let previousClose = Number(candles[0]?.close || 0);
  return candles.map((candle) => {
    const close = (Number(candle.open) + Number(candle.high) + Number(candle.low) + Number(candle.close)) / 4;
    const open = (previousOpen + previousClose) / 2;
    const transformed = [open, close, Math.min(Number(candle.low), open, close), Math.max(Number(candle.high), open, close)];
    previousOpen = open; previousClose = close; return transformed;
  });
}

export class EChartsAdapter {
  private chart?: echarts.ECharts;
  private candles: CanonicalCandle[] = [];
  private chartType: ChartType = "candlesticks";
  private followLive = true;
  private historyHandler?: () => void;
  private indicatorConfigs: IndicatorConfig[] = [];
  private readonly indicatorEngine = new IndicatorEngine();
  private currentPrice?: string;
  private currentPriceState: ChartConnectionState = "disconnected";
  private readonly drawingLayer = new DrawingLayer();
  private drawingGraphics: object[] = [];
  private tradeGraphics: object[] = [];
  private eventGraphics: object[] = [];
  private eventMarkerActivation: (marker: OverlayMarker) => void = () => undefined;
  private readonly tradeMarkerLayer = new TradeMarkerLayer((graphics, anchors) => { this.tradeGraphics = graphics; this.newsCalendarLayer.setReservedX(anchors); this.renderGraphics(); });
  private readonly newsCalendarLayer = new NewsCalendarMarkerLayer((graphics) => { this.eventGraphics = graphics; this.renderGraphics(); }, (marker) => this.eventMarkerActivation(marker));

  mount(container: HTMLElement, theme: string, onHistoryBoundary: () => void, drawingCallbacks?: DrawingLayerCallbacks) {
    if (this.chart) return;
    this.chart = echarts.init(container, undefined, { renderer: "canvas" });
    this.historyHandler = onHistoryBoundary;
    this.chart.on("datazoom", () => {
      const option = this.chart?.getOption(); const zoom = (option?.dataZoom as Array<{ start?: number }> | undefined)?.[0];
      if ((zoom?.start ?? 100) <= 3) this.historyHandler?.();
      this.followLive = false;
      this.drawingLayer.render();
      this.tradeMarkerLayer.render();
      this.newsCalendarLayer.render();
    });
    this.drawingLayer.mount(this.chart, drawingCallbacks ?? { onCreate: () => undefined, onSelect: () => undefined, onMove: () => undefined }, (graphics) => { this.drawingGraphics = graphics; this.renderGraphics(); });
    this.tradeMarkerLayer.mount(this.chart);
    this.newsCalendarLayer.mount(this.chart);
    this.setTheme(theme);
  }

  setTheme(theme: string) {
    this.chart?.setOption({ backgroundColor: "transparent", textStyle: { color: theme === "night" ? "#fff" : "#111" }, xAxis: { axisLabel: { color: theme === "night" ? "#aaa" : "#444" } }, yAxis: { scale: true, position: "right", axisLabel: { color: theme === "night" ? "#aaa" : "#444" }, splitLine: { lineStyle: { color: theme === "night" ? "#2b2b43" : "#e5e7eb" } } } });
  }

  setChartType(type: ChartType) { this.chartType = type; this.renderSeries(); }
  setIndicators(configs: readonly IndicatorConfig[]) { this.indicatorConfigs = configs.map((config) => ({ ...config })); this.renderSeries(); }
  setDrawings(drawings: readonly ChartDrawing[], selectedId: string | undefined, visible: boolean) { this.drawingLayer.setDrawings(drawings, selectedId, visible); }
  setDrawingTool(tool: DrawingType) { const drawing = tool !== "select"; this.drawingLayer.setTool(tool); this.newsCalendarLayer.setInteractionEnabled(!drawing); this.chart?.setOption({ dataZoom: [{ disabled: drawing }, { disabled: drawing }] }, { lazyUpdate: true }); }
  setTradeMarkers(markers: readonly TradeChartMarker[], estimatedServerNow: number) { this.tradeMarkerLayer.setMarkers(markers, estimatedServerNow); }
  setNewsCalendarMarkers(markers: readonly OverlayMarker[]) { this.newsCalendarLayer.setMarkers(markers); }
  setNewsCalendarMarkerActivation(callback: (marker: OverlayMarker) => void) { this.eventMarkerActivation = callback; }
  cancelDrawing() { this.drawingLayer.cancelPending(); }
  setCandles(candles: CanonicalCandle[]) {
    const previousCount = this.candles.length;
    const prepended = previousCount > 0 && candles.length > previousCount && candles.at(-(previousCount))?.openTime === this.candles[0]?.openTime ? candles.length - previousCount : 0;
    this.candles = candles; this.renderSeries(previousCount, prepended); this.drawingLayer.setCandles(candles); this.tradeMarkerLayer.setCandles(candles); this.newsCalendarLayer.setCandles(candles); if (this.followLive) this.centerLive();
  }

  setCurrentPrice(price: string | undefined, state: ChartConnectionState) {
    this.currentPrice = price; this.currentPriceState = state;
    const value = Number(price); const visible = Number.isFinite(value) && !["disconnected", "error"].includes(state);
    this.chart?.setOption({ series: [{ id: "price", markLine: { silent: true, symbol: "none", data: visible ? [{ yAxis: value, label: { show: true, formatter: value.toFixed(2), color: state === "stale" ? "#f59e0b" : "#12e6d0" }, lineStyle: { color: state === "stale" ? "#f59e0b" : "#12e6d0", type: state === "stale" ? "dashed" : "solid" } }] : [] } }] });
  }

  zoom(delta: number) {
    const zoom = ((this.chart?.getOption().dataZoom as Array<{ start?: number; end?: number }> | undefined)?.[0]) || {};
    const start = zoom.start ?? 70; const end = zoom.end ?? 100; const midpoint = (start + end) / 2; const width = Math.max(5, Math.min(100, end - start + delta));
    this.chart?.dispatchAction({ type: "dataZoom", start: Math.max(0, midpoint - width / 2), end: Math.min(100, midpoint + width / 2) });
  }
  resetView() { this.followLive = true; this.chart?.dispatchAction({ type: "dataZoom", start: 70, end: 100 }); }
  centerLive() { this.followLive = true; this.chart?.dispatchAction({ type: "dataZoom", start: Math.max(0, 100 - Math.min(100, 3000 / Math.max(1, this.candles.length))), end: 100 }); }
  resize() { this.chart?.resize(); this.drawingLayer.render(); this.tradeMarkerLayer.render(); this.newsCalendarLayer.render(); }
  dispose() { this.drawingLayer.dispose(); this.tradeMarkerLayer.dispose(); this.newsCalendarLayer.dispose(); this.chart?.dispose(); this.chart = undefined; }

  private renderSeries(previousCount = this.candles.length, prepended = 0) {
    if (!this.chart) return;
    const labels = this.candles.map((candle) => candle.openTime);
    const ohlc = this.chartType === "heikin-ashi" ? heikinAshi(this.candles) : this.candles.map((candle) => [Number(candle.open), Number(candle.close), Number(candle.low), Number(candle.high)]);
    const closes = this.candles.map((candle) => Number(candle.close));
    const volumes = this.candles.map((candle) => ({
      value: Number(candle.volume),
      itemStyle: { color: Number(candle.close) >= Number(candle.open) ? "rgba(38,166,154,.55)" : "rgba(239,83,80,.55)" },
    }));
    const isCandle = this.chartType === "candlesticks" || this.chartType === "heikin-ashi";
    const priceSeries = isCandle
      ? { id: "price", type: "candlestick", data: ohlc, itemStyle: { color: "#26a69a", color0: "#ef5350", borderColor: "#26a69a", borderColor0: "#ef5350" } }
      : this.chartType === "bar"
        ? { id: "price", type: "bar", data: closes, itemStyle: { color: (params: { dataIndex: number }) => Number(this.candles[params.dataIndex]?.close) >= Number(this.candles[params.dataIndex]?.open) ? "#26a69a" : "#ef5350" } }
        : { id: "price", type: "line", data: closes, showSymbol: false, smooth: false, lineStyle: { color: "#1973fa" }, areaStyle: this.chartType === "area" ? { color: "rgba(25,115,250,.22)" } : undefined };
    const currentZoom = ((this.chart.getOption().dataZoom as Array<{ start?: number; end?: number }> | undefined)?.[0]) || {};
    let start = currentZoom.start ?? 70; let end = currentZoom.end ?? 100;
    if (prepended && previousCount) { start = ((start / 100 * previousCount) + prepended) / this.candles.length * 100; end = ((end / 100 * previousCount) + prepended) / this.candles.length * 100; }
    const priceValue = Number(this.currentPrice); const priceVisible = Number.isFinite(priceValue) && !["disconnected", "error"].includes(this.currentPriceState);
    Object.assign(priceSeries, { markLine: { silent: true, symbol: "none", data: priceVisible ? [{ yAxis: priceValue, label: { show: true, formatter: priceValue.toFixed(2), color: this.currentPriceState === "stale" ? "#f59e0b" : "#12e6d0" }, lineStyle: { color: this.currentPriceState === "stale" ? "#f59e0b" : "#12e6d0", type: this.currentPriceState === "stale" ? "dashed" : "solid" } }] : [] } });
    let results: IndicatorResult[] = []; try { results = this.indicatorEngine.calculate(this.candles, this.indicatorConfigs); } catch (error) { console.error("Indicator overlay disabled", error instanceof Error ? error.name : "UNKNOWN"); }
    const panes = ["volume", ...new Set(results.map((result) => result.pane).filter((pane) => pane !== "price"))];
    const { grids } = calculatePaneLayout(panes, this.chart.getHeight());
    const xAxes = grids.map((_, index) => ({ type: "category", gridIndex: index, data: labels, boundaryGap: true, axisLabel: { show: index === grids.length - 1 }, axisPointer: { show: true, snap: true, label: { show: true } } }));
    const yAxes = grids.map((_, index) => ({ type: "value", gridIndex: index, scale: index === 0, min: panes[index - 1] === "rsi" || panes[index - 1] === "volume" ? 0 : undefined, max: panes[index - 1] === "rsi" ? 100 : undefined, position: "right", axisPointer: { show: true, label: { show: true } } }));
    const indicatorSeries = results.flatMap((result) => this.indicatorSeries(result, panes.indexOf(result.pane) + 1));
    const xAxisIndex = grids.map((_, index) => index);
    const volumeSeries = { id: "volume", name: "Volume", type: "bar", xAxisIndex: 1, yAxisIndex: 1, data: volumes, animation: false, barMaxWidth: 8 };
    this.chart.setOption({
      animation: false,
      axisPointer: { type: "cross", link: [{ xAxisIndex: "all" }], label: { show: true } },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" },
        formatter: (params: Array<{ dataIndex?: number }> | { dataIndex?: number }) => {
          const first = Array.isArray(params) ? params[0] : params; const candle = this.candles[first?.dataIndex ?? -1];
          if (!candle) return "";
          const value = (input: string) => Number(input).toLocaleString(undefined, { maximumFractionDigits: 8 });
          return `${new Date(candle.openTime).toLocaleString()}<br/>O ${value(candle.open)} · H ${value(candle.high)} · L ${value(candle.low)} · C ${value(candle.close)}<br/>Volume ${value(candle.volume)}`;
        },
      },
      grid: grids,
      xAxis: xAxes,
      yAxis: yAxes,
      dataZoom: [{ type: "inside", xAxisIndex, start, end, filterMode: "none", zoomOnMouseWheel: true, moveOnMouseMove: true, moveOnMouseWheel: false }, { type: "slider", xAxisIndex, height: 18, bottom: 8, start, end, showDetail: false }],
      series: [priceSeries, volumeSeries, ...indicatorSeries],
    }, { notMerge: true, lazyUpdate: true });
    this.drawingLayer.render();
  }

  private indicatorSeries(result: IndicatorResult, paneIndex: number): object[] {
    const config = this.indicatorConfigs.find((item) => item.id === result.id)!;
    const base = { xAxisIndex: result.pane === "price" ? 0 : paneIndex, yAxisIndex: result.pane === "price" ? 0 : paneIndex, showSymbol: false, connectNulls: false, animation: false };
    if (result.type === "macd") return [
      { ...base, id: `${result.id}-histogram`, name: "MACD histogram", type: "bar", data: result.values.histogram, itemStyle: { color: (params: { value: number }) => params.value >= 0 ? "#26a69a" : "#ef5350" } },
      { ...base, id: `${result.id}-line`, name: "MACD", type: "line", data: result.values.macd, lineStyle: { color: config.color, width: 1.5 } },
      { ...base, id: `${result.id}-signal`, name: "Signal", type: "line", data: result.values.signal, lineStyle: { color: "#f6b73c", width: 1.5 } },
    ];
    if (result.type === "bollinger") return ["upper", "middle", "lower"].map((key) => ({ ...base, id: `${result.id}-${key}`, name: `Bollinger ${key}`, type: "line", data: result.values[key], lineStyle: { color: config.color, width: key === "middle" ? 1.5 : 1, type: key === "middle" ? "solid" : "dashed" } }));
    const guide = result.type === "rsi" ? { silent: true, symbol: "none", data: [{ yAxis: 30 }, { yAxis: 70 }], lineStyle: { color: "#64748b", type: "dashed" }, label: { show: false } } : undefined;
    return [{ ...base, id: result.id, name: result.type.toUpperCase(), type: "line", data: result.values.value, lineStyle: { color: config.color, width: 1.5 }, markLine: guide }];
  }
  private renderGraphics() { this.chart?.setOption({ graphic: [...this.drawingGraphics, ...this.tradeGraphics, ...this.eventGraphics] }, { replaceMerge: ["graphic"], lazyUpdate: true }); }
}
