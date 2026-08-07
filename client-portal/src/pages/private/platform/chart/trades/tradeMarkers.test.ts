import { describe, expect, it } from "vitest";
import { DemoTrade } from "api/demo/types";
import { TradeMarkerStore } from "./TradeMarkerStore";
import { demoTradeChannels } from "../../hooks/useDemoTrades";
import { TradeMarkerStatus } from "./types";

const opened = "2026-08-07T00:00:00.000Z"; const expiry = "2026-08-07T00:01:00.000Z";
const trade = (id: string, direction: "up" | "down" = "up", state: DemoTrade["state"] = "OPEN", result: DemoTrade["result"] = null): DemoTrade => ({ id, symbol: "BTCUSDT", direction, amount: "100", state, result, openingPrice: "116200.50", closingPrice: result ? "116500.25" : null, openedAt: opened, expiresAt: expiry, settledAt: result ? "2026-08-07T00:01:01.000Z" : undefined, payoutPercent: "82" });
const event = (id: string, status: string, sequence: number, direction = "up", extra: Record<string, unknown> = {}) => ({ channel: sequence % 2 ? "demo.order" : "demo.execution", sequence, server_time: `2026-08-07T00:00:${String(sequence).padStart(2, "0")}.000Z`, data: { trade_id: id, symbol: "BTCUSDT", direction, status, open_time: opened, open_price: "116200.50", expiry_time: expiry, status_version: sequence, ...extra } });

describe("TradeMarkerStore", () => {
  it("derives account-scoped demo channels from workspace bootstrap identity", () => {
    expect(demoTradeChannels("19")).toEqual({ order: "demo.order.19", execution: "demo.execution.19" });
  });
  it("creates active UP and DOWN markers with one open and expiry model", () => {
    const store = new TradeMarkerStore(); store.replaceInitial([trade("up"), trade("down", "down")], "demo-account");
    expect(store.getSnapshot().markers).toEqual(expect.arrayContaining([expect.objectContaining({ tradeId: "up", direction: "UP", status: "ACTIVE", openPrice: "116200.50" }), expect.objectContaining({ tradeId: "down", direction: "DOWN", status: "ACTIVE" })]));
  });
  it.each([["WON", "WON"], ["LOST", "LOST"], ["DRAW", "DRAW"], ["CANCELLED", "CANCELLED"], ["REJECTED", "REJECTED"], ["EXPIRED", "EXPIRED"]] as [DemoTrade["state"], TradeMarkerStatus][])("maps %s settlement status", (state, expected) => {
    const store = new TradeMarkerStore(); store.replaceInitial([trade(state, "up", state, ["WON", "LOST", "DRAW"].includes(state) ? state as DemoTrade["result"] : null)], "demo-account");
    expect(store.getSnapshot().markers[0].status).toBe(expected);
  });
  it("mutates one marker across order/execution events and rejects duplicates and stale events", () => {
    const store = new TradeMarkerStore(); expect(store.applyRealtime(event("42", "PENDING", 1), "demo-account")).toBe(true); expect(store.applyRealtime(event("42", "ACTIVE", 2), "demo-account")).toBe(true);
    expect(store.applyRealtime(event("42", "ACTIVE", 2), "demo-account")).toBe(false); expect(store.applyRealtime(event("42", "PENDING", 1), "demo-account")).toBe(false);
    expect(store.applyRealtime(event("42", "WON", 3, "up", { settlement_time: "2026-08-07T00:01:01.000Z", settlement_price: "116500.25", result: "WON" }), "demo-account")).toBe(true);
    expect(store.getSnapshot()).toMatchObject({ duplicateEvents: 1, staleEvents: 1 }); expect(store.getSnapshot().markers).toHaveLength(1); expect(store.getSnapshot().markers[0]).toMatchObject({ status: "WON", version: 3, settlementPrice: "116500.25" });
  });
  it("uses server time for countdown without network activity", () => {
    const store = new TradeMarkerStore(); const received = Date.parse(opened); store.replaceInitial([trade("clock")], "demo-account", received); store.synchronizeServerTime("2026-08-07T00:00:10.000Z", received);
    expect(store.remainingSeconds(store.getSnapshot().markers[0])).toBe(50); store.tick(received + 20_000); expect(store.remainingSeconds(store.getSnapshot().markers[0])).toBe(30);
  });
  it("isolates assets while preserving markers across timeframe changes", () => {
    const eth = { ...trade("eth"), symbol: "ETHUSDT" }; const store = new TradeMarkerStore(); store.replaceInitial([trade("btc"), eth], "demo-account");
    expect(store.markersFor("BTC-USD").map((marker) => marker.tradeId)).toEqual(["btc"]); expect(store.markersFor("ETH-USD").map((marker) => marker.tradeId)).toEqual(["eth"]);
    expect(store.markersFor("BTC-USD")[0].expiryTime).toBe(Date.parse(expiry) / 1000);
  });
  it("does not mutate demo trade input", () => { const input = [trade("immutable")]; const before = structuredClone(input); new TradeMarkerStore().replaceInitial(input, "demo-account"); expect(input).toEqual(before); });
});
