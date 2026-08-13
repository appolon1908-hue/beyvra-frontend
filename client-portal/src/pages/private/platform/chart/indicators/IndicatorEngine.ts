import { CanonicalCandle } from "../chartTypes";
import { bollinger } from "./bollinger";
import { ema } from "./ema";
import { macd } from "./macd";
import { rsi } from "./rsi";
import { sma } from "./sma";
import { closeValues, IndicatorConfig, IndicatorResult } from "./types";

export function validateIndicatorConfig(config: IndicatorConfig): void {
  if (config.type === "sma") { sma([], config.period); return; }
  if (config.type === "ema") { ema([], config.period); return; }
  if (config.type === "rsi") { rsi([], config.period); return; }
  if (config.type === "macd") { macd([], config.fast, config.slow, config.signal); return; }
  if (config.type === "bollinger") { bollinger([], config.period, config.deviation); return; }
  throw new Error("INDICATOR_TYPE_UNSUPPORTED");
}

export class IndicatorEngine {
  calculate(candles: readonly CanonicalCandle[], configs: readonly IndicatorConfig[]): IndicatorResult[] {
    const closes = closeValues(candles);
    return configs.filter((config) => config.enabled).map((config) => {
      validateIndicatorConfig(config);
      if (config.type === "sma") return { id: config.id, type: config.type, pane: config.pane, values: { value: sma(closes, config.period) } };
      if (config.type === "ema") return { id: config.id, type: config.type, pane: config.pane, values: { value: ema(closes, config.period) } };
      if (config.type === "rsi") return { id: config.id, type: config.type, pane: config.pane, values: { value: rsi(closes, config.period) } };
      if (config.type === "macd") return { id: config.id, type: config.type, pane: config.pane, values: macd(closes, config.fast, config.slow, config.signal) };
      if (config.type === "bollinger") return { id: config.id, type: config.type, pane: config.pane, values: bollinger(closes, config.period, config.deviation) };
      throw new Error("INDICATOR_TYPE_UNSUPPORTED");
    });
  }
}
