import { describe, expect, it } from "vitest";
import { IndicatorEngine } from "./IndicatorEngine";
import { bollinger } from "./bollinger";
import { ema } from "./ema";
import { macd } from "./macd";
import { rsi } from "./rsi";
import { sma } from "./sma";
import { DEFAULT_INDICATORS, IndicatorConfig } from "./types";
import { loadIndicatorPreferences, saveIndicatorPreferences } from "./preferences";
import { CanonicalCandle } from "../chartTypes";

const candles = (values: number[]): CanonicalCandle[] => values.map((value, index) => ({
  openTime: new Date(Date.UTC(2026, 7, 1) + index * 60_000).toISOString(),
  closeTime: new Date(Date.UTC(2026, 7, 1) + (index + 1) * 60_000).toISOString(),
  open: String(value), high: String(value + 1), low: String(value - 1), close: String(value), volume: "1", complete: true, sequence: index + 1,
}));

describe("technical indicator known series", () => {
  it("calculates SMA with null warm-up", () => expect(sma([1, 2, 3, 4], 2)).toEqual([null, 1.5, 2.5, 3.5]));
  it("calculates seeded EMA with null warm-up", () => expect(ema([1, 2, 3, 4, 5], 3)).toEqual([null, null, 2, 3, 4]));
  it("calculates Wilder RSI and leaves warm-up null", () => expect(rsi([1, 2, 3, 4, 5], 2)).toEqual([null, null, 100, 100, 100]));
  it("calculates MACD line, signal, and histogram after warm-up", () => {
    const result = macd([1, 2, 3, 4, 5, 6], 2, 3, 2);
    expect(result.macd).toEqual([null, null, 0.5, 0.5, 0.5, 0.5]);
    expect(result.signal).toEqual([null, null, null, 0.5, 0.5, 0.5]);
    expect(result.histogram).toEqual([null, null, null, 0, 0, 0]);
  });
  it("calculates population-standard-deviation Bollinger bands", () => {
    const result = bollinger([1, 2, 3], 2, 2);
    expect(result.middle).toEqual([null, 1.5, 2.5]);
    expect(result.upper).toEqual([null, 2.5, 3.5]);
    expect(result.lower).toEqual([null, 0.5, 1.5]);
  });
});

describe("indicator validation and authority boundary", () => {
  it("rejects parameter bounds and invalid MACD ordering", () => {
    expect(() => sma([1, 2], 1)).toThrow("SMA_PERIOD_OUT_OF_RANGE");
    expect(() => ema([1, 2], 501)).toThrow("EMA_PERIOD_OUT_OF_RANGE");
    expect(() => rsi([1, 2], 201)).toThrow("RSI_PERIOD_OUT_OF_RANGE");
    expect(() => macd([1, 2, 3], 26, 12, 9)).toThrow("MACD_FAST_MUST_BE_LESS_THAN_SLOW");
    expect(() => bollinger([1, 2], 2, 10.1)).toThrow("BOLLINGER_DEVIATION_OUT_OF_RANGE");
  });
  it("persists configuration only and rejects invalid stored parameters", () => {
    let stored = ""; const storage = { getItem: () => stored, setItem: (_key: string, value: string) => { stored = value; } };
    const configured = DEFAULT_INDICATORS.map((config) => config.type === "sma" ? { ...config, enabled: true, period: 30 } : config) as IndicatorConfig[];
    saveIndicatorPreferences(configured, storage); expect(loadIndicatorPreferences(storage)[0]).toMatchObject({ enabled: true, period: 30 });
    stored = JSON.stringify([{ ...DEFAULT_INDICATORS[0], enabled: true, period: 0 }]);
    expect(loadIndicatorPreferences(storage)[0]).toMatchObject({ enabled: false, period: 20 });
  });
  it("never mutates canonical candles", () => {
    const source = candles(Array.from({ length: 80 }, (_, index) => index + 1)); const before = structuredClone(source);
    new IndicatorEngine().calculate(source, DEFAULT_INDICATORS.map((config) => ({ ...config, enabled: true })) as IndicatorConfig[]);
    expect(source).toEqual(before);
  });
  it("recalculates updated, appended, prepended, asset, and timeframe datasets without stale points", () => {
    const engine = new IndicatorEngine(); const config = [{ ...DEFAULT_INDICATORS[0], enabled: true, period: 2 }] as IndicatorConfig[];
    expect(engine.calculate(candles([1, 2]), config)[0].values.value).toEqual([null, 1.5]);
    expect(engine.calculate(candles([1, 4]), config)[0].values.value).toEqual([null, 2.5]);
    expect(engine.calculate(candles([1, 2, 3]), config)[0].values.value).toEqual([null, 1.5, 2.5]);
    expect(engine.calculate(candles([0, 1, 2]), config)[0].values.value).toEqual([null, 0.5, 1.5]);
    expect(engine.calculate(candles([10, 20]), config)[0].values.value).toEqual([null, 15]);
  });
});

describe("indicator performance", () => {
  it("computes five indicators over 5,000 candles within the interaction budget", () => {
    const source = candles(Array.from({ length: 5_000 }, (_, index) => 100 + Math.sin(index / 20) * 5 + index / 1000));
    const configs = DEFAULT_INDICATORS.map((config) => ({ ...config, enabled: true })) as IndicatorConfig[];
    const started = performance.now(); const result = new IndicatorEngine().calculate(source, configs); const elapsed = performance.now() - started;
    expect(result).toHaveLength(5); expect(elapsed).toBeLessThan(250);
  });
});
