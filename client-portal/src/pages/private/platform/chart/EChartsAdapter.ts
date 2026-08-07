import * as echarts from "echarts";
import { CanonicalCandle, ChartConnectionState } from "./chartTypes";

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

  mount(container: HTMLElement, theme: string, onHistoryBoundary: () => void) {
    if (this.chart) return;
    this.chart = echarts.init(container, undefined, { renderer: "canvas" });
    this.historyHandler = onHistoryBoundary;
    this.chart.on("datazoom", () => {
      const option = this.chart?.getOption(); const zoom = (option?.dataZoom as Array<{ start?: number }> | undefined)?.[0];
      if ((zoom?.start ?? 100) <= 3) this.historyHandler?.();
      this.followLive = false;
    });
    this.setTheme(theme);
  }

  setTheme(theme: string) {
    this.chart?.setOption({ backgroundColor: "transparent", textStyle: { color: theme === "night" ? "#fff" : "#111" }, xAxis: { axisLabel: { color: theme === "night" ? "#aaa" : "#444" } }, yAxis: { scale: true, position: "right", axisLabel: { color: theme === "night" ? "#aaa" : "#444" }, splitLine: { lineStyle: { color: theme === "night" ? "#2b2b43" : "#e5e7eb" } } } });
  }

  setChartType(type: ChartType) { this.chartType = type; this.renderSeries(); }
  setCandles(candles: CanonicalCandle[]) {
    const previousCount = this.candles.length;
    const prepended = previousCount > 0 && candles.length > previousCount && candles.at(-(previousCount))?.openTime === this.candles[0]?.openTime ? candles.length - previousCount : 0;
    this.candles = candles; this.renderSeries(previousCount, prepended); if (this.followLive) this.centerLive();
  }

  setCurrentPrice(price: string | undefined, state: ChartConnectionState) {
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
  resize() { this.chart?.resize(); }
  dispose() { this.chart?.dispose(); this.chart = undefined; }

  private renderSeries(previousCount = this.candles.length, prepended = 0) {
    if (!this.chart) return;
    const labels = this.candles.map((candle) => candle.openTime);
    const ohlc = this.chartType === "heikin-ashi" ? heikinAshi(this.candles) : this.candles.map((candle) => [Number(candle.open), Number(candle.close), Number(candle.low), Number(candle.high)]);
    const closes = this.candles.map((candle) => Number(candle.close));
    const isCandle = this.chartType === "candlesticks" || this.chartType === "heikin-ashi";
    const series = isCandle
      ? { id: "price", type: "candlestick", data: ohlc, itemStyle: { color: "#26a69a", color0: "#ef5350", borderColor: "#26a69a", borderColor0: "#ef5350" } }
      : this.chartType === "bar"
        ? { id: "price", type: "bar", data: closes, itemStyle: { color: (params: { dataIndex: number }) => Number(this.candles[params.dataIndex]?.close) >= Number(this.candles[params.dataIndex]?.open) ? "#26a69a" : "#ef5350" } }
        : { id: "price", type: "line", data: closes, showSymbol: false, smooth: false, lineStyle: { color: "#1973fa" }, areaStyle: this.chartType === "area" ? { color: "rgba(25,115,250,.22)" } : undefined };
    const currentZoom = ((this.chart.getOption().dataZoom as Array<{ start?: number; end?: number }> | undefined)?.[0]) || {};
    let start = currentZoom.start ?? 70; let end = currentZoom.end ?? 100;
    if (prepended && previousCount) { start = ((start / 100 * previousCount) + prepended) / this.candles.length * 100; end = ((end / 100 * previousCount) + prepended) / this.candles.length * 100; }
    this.chart.setOption({ animation: false, tooltip: { trigger: "axis" }, grid: { left: 12, right: 74, top: 48, bottom: 45, containLabel: true }, xAxis: { type: "category", data: labels, boundaryGap: true }, yAxis: { type: "value", scale: true }, dataZoom: [{ type: "inside", start, end, filterMode: "none", zoomOnMouseWheel: true, moveOnMouseMove: true, moveOnMouseWheel: false }, { type: "slider", height: 18, bottom: 8, start, end, showDetail: false }], series: [series] }, { notMerge: false, lazyUpdate: true });
  }
}
