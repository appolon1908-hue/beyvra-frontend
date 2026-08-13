import { sma } from "./sma";
import { IndicatorPoint } from "./types";

export type BollingerResult = { upper: IndicatorPoint[]; middle: IndicatorPoint[]; lower: IndicatorPoint[] };

export function bollinger(values: readonly number[], period = 20, deviation = 2): BollingerResult {
  if (!Number.isInteger(period) || period < 2 || period > 500) throw new Error("BOLLINGER_PERIOD_OUT_OF_RANGE");
  if (!Number.isFinite(deviation) || deviation < 0.1 || deviation > 10) throw new Error("BOLLINGER_DEVIATION_OUT_OF_RANGE");
  const middle = sma(values, period);
  const upper: IndicatorPoint[] = []; const lower: IndicatorPoint[] = [];
  values.forEach((_, index) => {
    if (index < period - 1) { upper.push(null); lower.push(null); return; }
    const mean = middle[index]!; const window = values.slice(index - period + 1, index + 1);
    const standardDeviation = Math.sqrt(window.reduce((sum, value) => sum + (value - mean) ** 2, 0) / period);
    upper.push(mean + standardDeviation * deviation); lower.push(mean - standardDeviation * deviation);
  });
  return { upper, middle, lower };
}
