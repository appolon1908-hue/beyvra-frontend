import * as echarts from "echarts";
import { CanonicalCandle } from "../chartTypes";
import { OverlayMarker } from "./types";

export class NewsCalendarMarkerLayer {
  private chart?: echarts.ECharts; private candles: CanonicalCandle[] = []; private markers: OverlayMarker[] = [];
  constructor(private readonly onGraphics: (graphics: object[]) => void) {}
  mount(chart: echarts.ECharts) { this.chart = chart; }
  dispose() { this.chart = undefined; }
  setCandles(candles: readonly CanonicalCandle[]) { this.candles = [...candles]; this.render(); }
  setMarkers(markers: readonly OverlayMarker[]) { this.markers = markers.map((item) => ({ ...item })); this.render(); }
  render() { if (!this.chart) return; const graphics = this.markers.map((marker) => { const nearest = this.candles.reduce((best, candle) => Math.abs(Date.parse(candle.openTime) - Date.parse(marker.time)) < Math.abs(Date.parse(best.openTime) - Date.parse(marker.time)) ? candle : best, this.candles[0]); if (!nearest) return undefined; const x = Number(this.chart!.convertToPixel({ xAxisIndex: 0 }, nearest.openTime)); if (!Number.isFinite(x)) return undefined; const color = marker.importance === "HIGH" ? "#ef4444" : marker.importance === "MEDIUM" ? "#f59e0b" : "#38bdf8"; return { id: marker.id, type: "group", silent: true, children: [{ type: "circle", shape: { cx: x, cy: 72, r: 10 }, style: { fill: color, stroke: "#fff", lineWidth: 1 } }, { type: "text", x: x - 4, y: 66, style: { text: marker.kind === "news" ? "N" : "E", fill: "#fff", fontWeight: 700 } }], tooltip: { formatter: `${marker.title}<br/>${marker.source}<br/>${marker.importance}<br/>${new Date(marker.time).toLocaleString()}<br/>${marker.detail}` } }; }); this.onGraphics(graphics.filter(Boolean) as object[]); }
}
