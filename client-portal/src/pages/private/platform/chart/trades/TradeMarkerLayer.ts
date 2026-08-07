import * as echarts from "echarts";
import { CanonicalCandle } from "../chartTypes";
import { TradeChartMarker } from "./types";

const terminal = new Set(["WON", "LOST", "DRAW", "CANCELLED", "REJECTED", "EXPIRED"]);
const statusGlyph = (status: TradeChartMarker["status"]) => status === "WON" ? "✓ WON" : status === "LOST" ? "✕ LOST" : status === "DRAW" ? "= DRAW" : status;

export class TradeMarkerLayer {
  private chart?: echarts.ECharts;
  private candles: CanonicalCandle[] = [];
  private markers: TradeChartMarker[] = [];
  private estimatedServerNow = Date.now();
  constructor(private readonly onGraphics: (graphics: object[]) => void) {}
  mount(chart: echarts.ECharts) { this.chart = chart; }
  dispose() { this.chart = undefined; }
  setCandles(candles: readonly CanonicalCandle[]) { this.candles = [...candles]; this.render(); }
  setMarkers(markers: readonly TradeChartMarker[], estimatedServerNow: number) { this.markers = markers.map((marker) => ({ ...marker })); this.estimatedServerNow = estimatedServerNow; this.render(); }
  render() { this.onGraphics(this.markers.map((marker) => this.graphic(marker)).filter(Boolean) as object[]); }

  private timePixel(timestamp: number): number | undefined {
    if (!this.chart || !this.candles.length) return undefined;
    const times = this.candles.map((candle) => Date.parse(candle.openTime) / 1000);
    let right = times.findIndex((time) => time >= timestamp); if (right < 0) right = times.length;
    const left = Math.max(0, Math.min(times.length - 1, right - 1)); const next = Math.max(0, Math.min(times.length - 1, right));
    const leftPixel = this.chart.convertToPixel({ xAxisIndex: 0 }, this.candles[left].openTime); const rightPixel = this.chart.convertToPixel({ xAxisIndex: 0 }, this.candles[next].openTime);
    if (!Number.isFinite(Number(leftPixel))) return undefined;
    if (left === next || times[next] === times[left] || !Number.isFinite(Number(rightPixel))) {
      if (times.length < 2) return Number(leftPixel);
      const adjacent = left === 0 ? 1 : left - 1; const adjacentPixel = this.chart.convertToPixel({ xAxisIndex: 0 }, this.candles[adjacent].openTime);
      const secondsPerPixel = (Number(leftPixel) - Number(adjacentPixel)) / (times[left] - times[adjacent]);
      return Number(leftPixel) + (timestamp - times[left]) * secondsPerPixel;
    }
    return Number(leftPixel) + (timestamp - times[left]) / (times[next] - times[left]) * (Number(rightPixel) - Number(leftPixel));
  }
  private pricePixel(price: string): number | undefined {
    const converted = this.chart?.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [this.candles[0]?.openTime, Number(price)]);
    return Array.isArray(converted) && Number.isFinite(converted[1]) ? converted[1] : undefined;
  }
  private graphic(marker: TradeChartMarker): object | undefined {
    if (!this.chart) return undefined;
    const openX = this.timePixel(marker.openTime); const expiryX = this.timePixel(marker.expiryTime); const openY = this.pricePixel(marker.openPrice);
    if (openX === undefined || expiryX === undefined || openY === undefined) return undefined;
    const directionColor = marker.direction === "UP" ? "#26a69a" : "#ef5350"; const remaining = Math.max(0, Math.ceil(marker.expiryTime - this.estimatedServerNow / 1000));
    const children: object[] = [
      { id: `${marker.id}-open-price-line`, type: "line", shape: { x1: openX, y1: openY, x2: expiryX, y2: openY }, style: { stroke: directionColor, lineWidth: 1, lineDash: [5, 4] } },
      { id: `${marker.id}-open`, type: "text", x: openX, y: openY, style: { text: `${marker.direction === "UP" ? "▲" : "▼"} ${marker.direction}`, fill: directionColor, fontWeight: 700, backgroundColor: "rgba(15,23,42,.88)", padding: 5 } },
      { id: `${marker.id}-expiry`, type: "line", shape: { x1: expiryX, y1: 48, x2: expiryX, y2: this.chart.getHeight() - 45 }, style: { stroke: "#94a3b8", lineWidth: 1, lineDash: [4, 4] } },
      { id: `${marker.id}-countdown`, type: "text", x: expiryX + 4, y: 52, style: { text: terminal.has(marker.status) ? "Expired" : `${remaining}s`, fill: "#e2e8f0", backgroundColor: "rgba(15,23,42,.88)", padding: 4 } },
    ];
    if (terminal.has(marker.status)) {
      const settlementX = marker.settlementTime ? this.timePixel(marker.settlementTime) : undefined; const settlementY = marker.settlementPrice ? this.pricePixel(marker.settlementPrice) : undefined;
      children.push({ id: `${marker.id}-settlement`, type: "text", x: settlementX ?? expiryX, y: settlementY ?? openY, style: { text: statusGlyph(marker.status), fill: marker.status === "WON" ? "#26a69a" : marker.status === "LOST" ? "#ef5350" : "#f6b73c", fontWeight: 700, backgroundColor: "rgba(15,23,42,.9)", padding: 5 } });
    }
    return { type: "group", id: marker.id, silent: true, children, tooltip: { formatter: `${marker.direction} · ${marker.status}${marker.amount ? ` · ${marker.amount}` : ""}${marker.payoutPercent ? ` · ${marker.payoutPercent}%` : ""}` } };
  }
}
