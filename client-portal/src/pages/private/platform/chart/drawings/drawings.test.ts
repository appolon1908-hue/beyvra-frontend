import { beforeEach, describe, expect, it } from "vitest";
import { DrawingStore } from "./DrawingStore";
import { ChartDrawing, DrawingPoint, PersistedDrawingType } from "./types";

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}
const first: DrawingPoint = { time: 1_786_050_000, price: "116200.50" };
const second: DrawingPoint = { time: 1_786_050_600, price: "116500.25" };

describe("DrawingStore tools and history", () => {
  let storage: MemoryStorage; let store: DrawingStore;
  beforeEach(() => { storage = new MemoryStorage(); store = new DrawingStore(storage); store.setScope("account-1", "BTC-USD", "1m"); });

  it.each([
    ["trendline", [first, second]], ["horizontal", [first]], ["vertical", [first]], ["fibonacci", [first, second]], ["measurement", [first, second]], ["text", [first]],
  ] as [PersistedDrawingType, DrawingPoint[]][])("creates, selects, moves and deletes %s", (type, points) => {
    const drawing = store.create(type, points, type === "text" ? "Chart note" : undefined);
    expect(drawing.instrumentId).toBe("BTC-USD"); expect(store.getSnapshot().selectedId).toBe(drawing.id);
    const moved = points.map((point) => ({ ...point, price: String(Number(point.price) + 10) }));
    expect(store.move(drawing.id, moved)).toBe(true); expect(store.getSnapshot().drawings[0].points).toEqual(moved);
    store.remove(); expect(store.getSnapshot().drawings).toHaveLength(0);
  });

  it("locks movement, hides/shows, clears, undoes, and redoes", () => {
    const drawing = store.create("trendline", [first, second]); store.toggleLock();
    expect(store.move(drawing.id, [{ ...first, price: "1" }, second])).toBe(false);
    store.toggleDrawingVisibility(); expect(store.getSnapshot().drawings[0].visible).toBe(false);
    store.toggleAllVisibility(); expect(store.getSnapshot().visible).toBe(false); store.toggleAllVisibility();
    store.clear(); expect(store.getSnapshot().drawings).toHaveLength(0); store.undo(); expect(store.getSnapshot().drawings).toHaveLength(1);
    store.redo(); expect(store.getSnapshot().drawings).toHaveLength(0);
  });

  it("isolates account, instrument, and timeframe persistence", () => {
    store.create("horizontal", [first]); store.setScope("account-1", "ETH-USD", "1m"); expect(store.getSnapshot().drawings).toHaveLength(0);
    store.create("vertical", [first]); store.setScope("account-1", "BTC-USD", "5m"); expect(store.getSnapshot().drawings).toHaveLength(0);
    store.setScope("account-1", "BTC-USD", "1m"); expect(store.getSnapshot().drawings[0].type).toBe("horizontal");
    store.setScope("account-2", "BTC-USD", "1m"); expect(store.getSnapshot().drawings).toHaveLength(0);
  });

  it("ignores invalid or outdated persisted drawings and continues", () => {
    storage.values.set("codestra.chart.drawings.v1:account-1:BTC-USD:1m", JSON.stringify([{ id: "bad", type: "trendline", points: [{ time: "screen-pixel", price: 12 }] }]));
    store = new DrawingStore(storage); store.setScope("account-1", "BTC-USD", "1m"); expect(store.getSnapshot().drawings).toEqual([]);
  });

  it("persists chart coordinates and display metadata only", () => {
    store.create("text", [first], "Display only"); const serialized = [...storage.values.values()][0]; const saved = JSON.parse(serialized) as ChartDrawing[];
    expect(saved[0]).toMatchObject({ instrumentId: "BTC-USD", interval: "1m", points: [first], text: "Display only" });
    expect(serialized).not.toContain("candle"); expect(serialized).not.toContain("order");
  });
});
