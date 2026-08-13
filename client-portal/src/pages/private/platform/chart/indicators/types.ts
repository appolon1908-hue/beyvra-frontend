import { CanonicalCandle } from "../chartTypes";

export type IndicatorType = "sma" | "ema" | "rsi" | "macd" | "bollinger";

export type IndicatorConfig =
  | { id: string; type: "sma" | "ema"; enabled: boolean; period: number; color: string; pane: "price" }
  | { id: string; type: "rsi"; enabled: boolean; period: number; color: string; pane: "rsi" }
  | { id: string; type: "macd"; enabled: boolean; fast: number; slow: number; signal: number; color: string; pane: "macd" }
  | { id: string; type: "bollinger"; enabled: boolean; period: number; deviation: number; color: string; pane: "price" };

export type IndicatorPoint = number | null;
export type IndicatorResult = {
  id: string;
  type: IndicatorType;
  pane: "price" | "rsi" | "macd";
  values: Record<string, IndicatorPoint[]>;
};

export const DEFAULT_INDICATORS: IndicatorConfig[] = [
  { id: "sma-20", type: "sma", enabled: false, period: 20, color: "#f6b73c", pane: "price" },
  { id: "ema-20", type: "ema", enabled: false, period: 20, color: "#8b5cf6", pane: "price" },
  { id: "rsi-14", type: "rsi", enabled: false, period: 14, color: "#22d3ee", pane: "rsi" },
  { id: "macd-12-26-9", type: "macd", enabled: false, fast: 12, slow: 26, signal: 9, color: "#60a5fa", pane: "macd" },
  { id: "bollinger-20-2", type: "bollinger", enabled: false, period: 20, deviation: 2, color: "#ec4899", pane: "price" },
];

export const closeValues = (candles: readonly CanonicalCandle[]): number[] => candles.map((candle) => {
  const value = Number(candle.close);
  if (!Number.isFinite(value)) throw new Error("INDICATOR_INVALID_CANDLE");
  return value;
});
