import * as echarts from "echarts";
import { CanonicalCandle } from "../chartTypes";
import { ChartDrawing, DrawingPoint, DrawingType, PersistedDrawingType, TWO_POINT_DRAWINGS } from "./types";

export type DrawingLayerCallbacks = {
  onCreate: (type: PersistedDrawingType, points: DrawingPoint[]) => void;
  onSelect: (id?: string) => void;
  onMove: (id: string, points: DrawingPoint[]) => void;
};

type ZrClick = { offsetX: number; offsetY: number; target?: { id?: string } };
const pointTime = (point: DrawingPoint) => new Date(point.time * 1000).toISOString();

export class DrawingLayer {
  private chart?: echarts.ECharts;
  private candles: CanonicalCandle[] = [];
  private drawings: ChartDrawing[] = [];
  private selectedId?: string;
  private allVisible = true;
  private tool: DrawingType = "select";
  private pending: DrawingPoint[] = [];
  private callbacks?: DrawingLayerCallbacks;
  private onGraphics?: (graphics: object[]) => void;
  private readonly clickHandler = (event: ZrClick) => this.handleCanvasClick(event);

  mount(chart: echarts.ECharts, callbacks: DrawingLayerCallbacks, onGraphics: (graphics: object[]) => void) { this.chart = chart; this.callbacks = callbacks; this.onGraphics = onGraphics; chart.getZr().on("click", this.clickHandler); }
  dispose() { this.chart?.getZr().off("click", this.clickHandler); this.chart = undefined; this.pending = []; }
  setTool(tool: DrawingType) { this.tool = tool; this.pending = []; this.chart?.getZr().setCursorStyle?.(tool === "select" ? "default" : "crosshair"); }
  cancelPending() { this.pending = []; }
  setCandles(candles: readonly CanonicalCandle[]) { this.candles = [...candles]; this.render(); }
  setDrawings(drawings: readonly ChartDrawing[], selectedId: string | undefined, visible: boolean) { this.drawings = drawings.map((drawing) => ({ ...drawing, points: drawing.points.map((point) => ({ ...point })) })); this.selectedId = selectedId; this.allVisible = visible; this.render(); }
  render() {
    if (!this.chart) return;
    const graphics = this.allVisible ? this.drawings.filter((drawing) => drawing.visible).map((drawing) => { try { return this.graphic(drawing); } catch { return undefined; } }).filter(Boolean) : [];
    this.onGraphics?.(graphics as object[]);
  }

  private pixel(point: DrawingPoint): [number, number] | undefined {
    const converted = this.chart?.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [pointTime(point), Number(point.price)]);
    return Array.isArray(converted) && converted.every(Number.isFinite) ? converted as [number, number] : undefined;
  }
  private dataPoint(pixel: [number, number]): DrawingPoint | undefined {
    const converted = this.chart?.convertFromPixel({ xAxisIndex: 0, yAxisIndex: 0 }, pixel);
    if (!Array.isArray(converted) || !Number.isFinite(Number(converted[1]))) return undefined;
    const rawX = converted[0];
    const candle = typeof rawX === "number" ? this.candles[Math.max(0, Math.min(this.candles.length - 1, Math.round(rawX)))] : this.candles.find((item) => item.openTime === rawX);
    if (!candle) return undefined;
    return { time: Math.floor(Date.parse(candle.openTime) / 1000), price: String(Number(converted[1])) };
  }
  private handleCanvasClick(event: ZrClick) {
    if (this.tool === "select" || event.target?.id?.startsWith("drawing-")) return;
    const point = this.dataPoint([event.offsetX, event.offsetY]); if (!point) return;
    this.pending.push(point); const required = TWO_POINT_DRAWINGS.includes(this.tool as PersistedDrawingType) ? 2 : 1;
    if (this.pending.length === required) { this.callbacks?.onCreate(this.tool as PersistedDrawingType, this.pending); this.pending = []; }
  }
  private graphic(drawing: ChartDrawing): object | undefined {
    const pixels = drawing.points.map((point) => this.pixel(point)); if (pixels.some((point) => !point)) return undefined;
    const points = pixels as [number, number][]; const selected = drawing.id === this.selectedId; const color = selected ? "#22d3ee" : drawing.style.color;
    const lineStyle = { stroke: color, lineWidth: drawing.style.width, lineDash: drawing.style.dashed ? [6, 4] : undefined };
    const children: object[] = [];
    if (drawing.type === "trendline" || drawing.type === "measurement") {
      children.push({ type: "line", id: `drawing-${drawing.id}-line`, shape: { x1: points[0][0], y1: points[0][1], x2: points[1][0], y2: points[1][1] }, style: lineStyle });
      if (drawing.type === "measurement") {
        const priceDelta = Number(drawing.points[1].price) - Number(drawing.points[0].price); const timeDelta = drawing.points[1].time - drawing.points[0].time;
        children.push({ type: "text", id: `drawing-${drawing.id}-label`, x: (points[0][0] + points[1][0]) / 2, y: (points[0][1] + points[1][1]) / 2, style: { text: `${priceDelta.toFixed(2)} · ${timeDelta}s`, fill: color, backgroundColor: "rgba(15,23,42,.8)", padding: 4 } });
      }
    } else if (drawing.type === "horizontal") {
      children.push({ type: "line", id: `drawing-${drawing.id}-line`, shape: { x1: 12, y1: points[0][1], x2: this.chart!.getWidth() - 74, y2: points[0][1] }, style: lineStyle });
    } else if (drawing.type === "vertical") {
      children.push({ type: "line", id: `drawing-${drawing.id}-line`, shape: { x1: points[0][0], y1: 48, x2: points[0][0], y2: this.chart!.getHeight() - 45 }, style: lineStyle });
    } else if (drawing.type === "text") {
      children.push({ type: "text", id: `drawing-${drawing.id}-text`, x: points[0][0], y: points[0][1], style: { text: drawing.text || "Note", fill: color, backgroundColor: "rgba(15,23,42,.86)", borderColor: color, borderWidth: selected ? 1 : 0, padding: 6 } });
    } else if (drawing.type === "fibonacci") {
      [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1].forEach((level) => {
        const price = Number(drawing.points[0].price) + (Number(drawing.points[1].price) - Number(drawing.points[0].price)) * level;
        const y = this.pixel({ time: drawing.points[0].time, price: String(price) })?.[1]; if (y === undefined) return;
        children.push({ type: "line", id: `drawing-${drawing.id}-${level}`, shape: { x1: points[0][0], y1: y, x2: points[1][0], y2: y }, style: { ...lineStyle, lineWidth: 1 } });
        children.push({ type: "text", id: `drawing-${drawing.id}-${level}-label`, x: points[1][0] + 4, y, style: { text: `${(level * 100).toFixed(level === 0 || level === 1 ? 0 : 1)}%`, fill: color, fontSize: 10 } });
      });
    }
    if (selected) points.forEach(([x, y], index) => children.push({ type: "circle", id: `drawing-${drawing.id}-handle-${index}`, z: 90, shape: { cx: x, cy: y, r: 7 }, style: { fill: drawing.locked ? "#64748b" : "#22d3ee", stroke: "#fff", lineWidth: 2 } }));
    return { type: "group", id: `drawing-${drawing.id}`, z: selected ? 90 : 60, draggable: !drawing.locked, children, onclick: () => this.callbacks?.onSelect(drawing.id), ondragend: (event: { target?: { x?: number; y?: number } }) => {
      const dx = event.target?.x || 0; const dy = event.target?.y || 0;
      const moved = points.map((point) => this.dataPoint([point[0] + dx, point[1] + dy])).filter(Boolean) as DrawingPoint[];
      if (moved.length === drawing.points.length) this.callbacks?.onMove(drawing.id, moved); else this.render();
    } };
  }
}
