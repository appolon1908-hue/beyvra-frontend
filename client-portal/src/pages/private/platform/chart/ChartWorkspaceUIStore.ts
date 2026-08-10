import { ChartType } from "./EChartsAdapter";
import { DrawingType } from "./drawings/types";
import { readWithLegacyMigration, writeCompatibilityValue } from "compat/storageKeys";

export type WorkspaceDrawer = "none" | "events" | "indicators" | "drawings";
export type PointerMode = "navigate" | "draw";
export type ChartWorkspaceUIState = { activeDrawer: WorkspaceDrawer; fullscreen: boolean; compact: boolean; pointerMode: PointerMode; drawingTool: DrawingType; chartType: ChartType; revision: number };
type StorageLike = Pick<Storage, "getItem" | "setItem">;
const KEY = "beyvra.chart.workspace-ui.v1";
const LEGACY_KEY = "codestra.chart.workspace-ui.v1";
const chartTypes = new Set<ChartType>(["candlesticks", "heikin-ashi", "bar", "line", "area"]);
const initial = (storage?: StorageLike): ChartWorkspaceUIState => { let chartType: ChartType = "candlesticks"; try { const saved = JSON.parse(readWithLegacyMigration(storage, KEY, LEGACY_KEY) || "null"); if (chartTypes.has(saved?.chartType)) chartType = saved.chartType; } catch { /* invalid preferences are isolated */ } return { activeDrawer: "none", fullscreen: false, compact: false, pointerMode: "navigate", drawingTool: "select", chartType, revision: 0 }; };

export class ChartWorkspaceUIStore {
  private state: ChartWorkspaceUIState; private listeners = new Set<() => void>();
  constructor(private readonly storage: StorageLike | undefined = typeof localStorage === "undefined" ? undefined : localStorage) { this.state = initial(storage); }
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  getSnapshot = () => this.state;
  setDrawer(activeDrawer: WorkspaceDrawer) { this.emit({ activeDrawer }); }
  setFullscreen(fullscreen: boolean) { this.emit({ fullscreen }); }
  setCompact(compact: boolean) { if (compact !== this.state.compact) this.emit({ compact }); }
  setDrawingTool(drawingTool: DrawingType) { this.emit({ drawingTool, pointerMode: drawingTool === "select" ? "navigate" : "draw", activeDrawer: "drawings" }); }
  cancelDrawing() { if (this.state.drawingTool !== "select") this.emit({ drawingTool: "select", pointerMode: "navigate" }); }
  setChartType(chartType: ChartType) { if (!chartTypes.has(chartType)) return; this.emit({ chartType }); try { writeCompatibilityValue(this.storage, KEY, JSON.stringify({ chartType })); } catch { /* preference failure is non-fatal */ } }
  private emit(patch: Partial<ChartWorkspaceUIState>) { this.state = { ...this.state, ...patch, revision: this.state.revision + 1 }; this.listeners.forEach((listener) => listener()); }
}
