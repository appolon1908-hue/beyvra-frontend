import { beforeEach, describe, expect, it, vi } from "vitest";
import { applyLiveCandle, normalizeCandles, prependHistory } from "./candles";
import { CanonicalCandle, MarketSnapshot } from "./chartTypes";

const candle = (time: string, close = "2"): CanonicalCandle => ({ openTime: time, closeTime: new Date(Date.parse(time) + 60_000).toISOString(), open: "1", high: "3", low: "0.5", close, volume: "4", complete: true, sequence: Date.parse(time) / 1000 });
const raw = (time: string, close = "2"): MarketSnapshot["candles"][number] => ({ open_time: time, close_time: new Date(Date.parse(time) + 60_000).toISOString(), open: "1", high: "3", low: "0.5", close, volume: "4", complete: true, sequence: Date.parse(time) / 1000 });

describe("canonical candles", () => {
  it("validates and deduplicates by open time", () => {
    const time = "2026-08-07T00:00:00.000Z";
    const result = normalizeCandles([raw(time), raw(time, "2.5"), { ...raw("2026-08-07T00:01:00.000Z"), high: "0" }]);
    expect(result).toHaveLength(1); expect(result[0].close).toBe("2.5");
  });
  it("mutates latest, appends newer, and rejects older candles", () => {
    const first = candle("2026-08-07T00:00:00.000Z"); const updated = candle(first.openTime, "2.5");
    expect(applyLiveCandle([first], updated)).toEqual([updated]);
    const newer = candle("2026-08-07T00:01:00.000Z"); expect(applyLiveCandle([updated], newer)).toEqual([updated, newer]);
    expect(applyLiveCandle([updated, newer], first)).toEqual([updated, newer]);
  });
  it("prepends history without duplicates", () => {
    const oldest = candle("2026-08-06T23:59:00.000Z"); const current = candle("2026-08-07T00:00:00.000Z");
    expect(prependHistory([current], [oldest, current])).toEqual([oldest, current]);
  });
});

const request = vi.fn(); const subscribe = vi.fn();
const setOption = vi.fn(); const dispatchAction = vi.fn(); const chartOn = vi.fn(); const dispose = vi.fn();
const chart = { on: chartOn, setOption, dispatchAction, getOption: () => ({ dataZoom: [{ start: 70, end: 100 }] }), resize: vi.fn(), dispose };
const init = vi.fn(() => chart);
vi.mock("echarts", () => ({ init }));
vi.mock("api/client", () => ({ authenticatedRequest: (...args: unknown[]) => request(...args) }));
vi.mock("api/user/useWebSocketTicket", () => ({ webSocketTicketFetcher: vi.fn() }));
vi.mock("realtime/UnifiedRealtimeClient", () => ({ getUnifiedRealtimeClient: () => ({ subscribe }) }));

describe("ChartDataController request budgets", () => {
  beforeEach(() => { request.mockReset(); subscribe.mockReset(); subscribe.mockReturnValue(vi.fn()); });
  it("does not request or subscribe when genuine 5s is unavailable", async () => {
    const { ChartDataController } = await import("./ChartDataController");
    request.mockResolvedValueOnce({ instrument_id: "BTC-USD", timeframes: [{ interval: "1m", available: true }, { interval: "5s", available: false, reason: "GENUINE_5S_SOURCE_UNAVAILABLE" }] });
    const controller = new ChartDataController("token"); await controller.selectInstrument("BTC-USD", "5s");
    expect(request).toHaveBeenCalledTimes(1); expect(subscribe).not.toHaveBeenCalled(); expect(controller.getSnapshot().error).toBe("GENUINE_5S_SOURCE_UNAVAILABLE");
  });
  it("uses one snapshot and two required subscriptions", async () => {
    const { ChartDataController } = await import("./ChartDataController"); const time = "2026-08-07T00:00:00.000Z";
    request.mockResolvedValueOnce({ instrument_id: "BTC-USD", timeframes: [{ interval: "1m", available: true }] }).mockResolvedValueOnce({ instrument_id: "BTC-USD", interval: "1m", sequence: 1, server_time: time, market_status: "OPEN", quote: { bid: "1", ask: "2", mid: "1.5", occurred_at: time }, candles: [raw(time)] });
    const controller = new ChartDataController("token"); await controller.selectInstrument("BTC-USD", "1m");
    expect(request).toHaveBeenCalledTimes(2); expect(subscribe.mock.calls.map((call) => call[0])).toEqual(["market.quote:BTC-USD", "market.candle:BTC-USD:1m"]);
    controller.refreshQuoteAge(Date.parse(time) + 16_000); expect(controller.getSnapshot().connectionState).toBe("stale");
  });
  it("rapid asset switching applies only the final generation", async () => {
    const { ChartDataController } = await import("./ChartDataController"); const time = "2026-08-07T00:00:00.000Z";
    const deferred = new Map<string, (value: unknown) => void>();
    request.mockImplementation((url: string) => url.includes("market-data-capabilities") ? Promise.resolve({ instrument_id: url.includes("ETH") ? "ETH-USD" : "BTC-USD", timeframes: [{ interval: "1m", available: true }] }) : new Promise((resolve) => deferred.set(url.includes("ETH") ? "ETH-USD" : `BTC-${deferred.has("BTC-1") ? "2" : "1"}`, resolve)));
    const controller = new ChartDataController("token"); const first = controller.selectInstrument("BTC-USD", "1m"); await Promise.resolve(); await Promise.resolve();
    const second = controller.selectInstrument("ETH-USD", "1m"); await Promise.resolve(); await Promise.resolve();
    const third = controller.selectInstrument("BTC-USD", "1m"); await Promise.resolve(); await Promise.resolve();
    const snapshot = (instrument_id: string) => ({ instrument_id, interval: "1m", sequence: 1, server_time: time, market_status: "OPEN", quote: { bid: "1", ask: "2", mid: "1.5", occurred_at: time }, candles: [raw(time)] });
    deferred.get("BTC-2")?.(snapshot("BTC-USD")); await third; deferred.get("ETH-USD")?.(snapshot("ETH-USD")); deferred.get("BTC-1")?.(snapshot("BTC-USD")); await Promise.all([first, second]);
    expect(controller.getSnapshot().instrumentId).toBe("BTC-USD"); expect(subscribe).toHaveBeenCalledTimes(2);
  });
});

describe("ECharts lifecycle and local controls", () => {
  beforeEach(() => { request.mockClear(); init.mockClear(); setOption.mockClear(); dispatchAction.mockClear(); dispose.mockClear(); chartOn.mockClear(); });
  it("creates one instance and chart changes stay local", async () => {
    const { EChartsAdapter } = await import("./EChartsAdapter"); const adapter = new EChartsAdapter(); const container = {} as HTMLElement;
    adapter.mount(container, "night", vi.fn()); adapter.mount(container, "night", vi.fn());
    adapter.setCandles([candle("2026-08-07T00:00:00.000Z")]); adapter.setChartType("area"); adapter.zoom(-10); adapter.resetView(); adapter.centerLive();
    expect(init).toHaveBeenCalledTimes(1); expect(dispatchAction).toHaveBeenCalledTimes(4); expect(request).not.toHaveBeenCalled();
    adapter.dispose(); expect(dispose).toHaveBeenCalledTimes(1);
  });
});

describe("chart data performance", () => {
  it("normalizes 5,000 candles within the bounded test budget", () => {
    const candles = Array.from({ length: 5_000 }, (_, index) => raw(new Date(Date.UTC(2026, 7, 1) + index * 60_000).toISOString()));
    const started = performance.now(); const result = normalizeCandles(candles); const elapsed = performance.now() - started;
    expect(result).toHaveLength(5_000); expect(elapsed).toBeLessThan(1_000);
  });
});
