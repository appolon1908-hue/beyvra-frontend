import { describe, expect, it } from "vitest";
import { ChartWorkspaceUIStore } from "./ChartWorkspaceUIStore";
import { calculatePaneLayout } from "./paneLayout";

describe("ChartWorkspaceUIStore", () => {
  it("owns transient workspace UI without chart-domain data", () => { const writes: string[] = []; const store = new ChartWorkspaceUIStore({ getItem: () => null, setItem: (_key, value) => writes.push(value) }); store.setDrawer("events"); store.setDrawingTool("fibonacci"); expect(store.getSnapshot()).toMatchObject({ activeDrawer: "drawings", drawingTool: "fibonacci", pointerMode: "draw" }); expect(store.getSnapshot()).not.toHaveProperty("candles"); expect(store.getSnapshot()).not.toHaveProperty("trades"); store.cancelDrawing(); expect(store.getSnapshot().pointerMode).toBe("navigate"); store.setChartType("area"); expect(writes).toEqual([JSON.stringify({ chartType: "area" })]); });
  it("ignores invalid persisted workspace state", () => { const store = new ChartWorkspaceUIStore({ getItem: () => JSON.stringify({ chartType: "provider-payload", token: "secret" }), setItem: () => undefined }); expect(store.getSnapshot().chartType).toBe("candlesticks"); expect(store.getSnapshot()).not.toHaveProperty("token"); });
});

describe("central pane layout", () => {
  it("keeps price and lower panes bounded and aligned on desktop and mobile", () => { for (const height of [420, 768, 1080]) { const layout = calculatePaneLayout(["rsi", "macd"], height); expect(layout.grids).toHaveLength(3); const serialized = JSON.stringify(layout.grids); expect(serialized).toContain('"left":12'); expect(serialized).toContain('"right":74'); } });
});
