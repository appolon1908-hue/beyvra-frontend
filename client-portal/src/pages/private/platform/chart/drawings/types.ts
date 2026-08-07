import { ChartInterval } from "../chartTypes";

export type DrawingType = "select" | "trendline" | "horizontal" | "vertical" | "fibonacci" | "measurement" | "text";
export type PersistedDrawingType = Exclude<DrawingType, "select">;
export type DrawingPoint = { time: number; price: string };
export type DrawingStyle = { color: string; width: number; dashed?: boolean };
export type ChartDrawing = {
  id: string;
  type: PersistedDrawingType;
  instrumentId: string;
  interval: ChartInterval;
  points: DrawingPoint[];
  style: DrawingStyle;
  text?: string;
  locked: boolean;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DrawingState = { drawings: ChartDrawing[]; selectedId?: string; visible: boolean; canUndo: boolean; canRedo: boolean };

export const DEFAULT_DRAWING_STYLE: DrawingStyle = { color: "#f6b73c", width: 2 };
export const TWO_POINT_DRAWINGS: PersistedDrawingType[] = ["trendline", "fibonacci", "measurement"];

export function validateDrawing(value: unknown, instrumentId: string, interval: ChartInterval): value is ChartDrawing {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ChartDrawing>;
  if (!item.id || typeof item.id !== "string" || !["trendline", "horizontal", "vertical", "fibonacci", "measurement", "text"].includes(item.type || "")) return false;
  if (item.instrumentId !== instrumentId || item.interval !== interval || !Array.isArray(item.points)) return false;
  const required = TWO_POINT_DRAWINGS.includes(item.type as PersistedDrawingType) ? 2 : 1;
  if (item.points.length !== required || !item.points.every((point) => Number.isFinite(point?.time) && point.time > 0 && typeof point.price === "string" && Number.isFinite(Number(point.price)))) return false;
  if (!item.style || typeof item.style.color !== "string" || !Number.isFinite(item.style.width) || item.style.width < 1 || item.style.width > 10) return false;
  if (typeof item.locked !== "boolean" || typeof item.visible !== "boolean" || typeof item.createdAt !== "string" || typeof item.updatedAt !== "string") return false;
  return item.type !== "text" || item.text === undefined || (typeof item.text === "string" && item.text.length <= 500);
}
