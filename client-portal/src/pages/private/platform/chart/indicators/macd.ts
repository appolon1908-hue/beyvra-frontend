import { ema, emaNullable } from "./ema";
import { IndicatorPoint } from "./types";

export type MacdResult = { macd: IndicatorPoint[]; signal: IndicatorPoint[]; histogram: IndicatorPoint[] };

export function macd(values: readonly number[], fast = 12, slow = 26, signalPeriod = 9): MacdResult {
  if (!Number.isInteger(fast) || fast < 2 || fast > 200) throw new Error("MACD_FAST_OUT_OF_RANGE");
  if (!Number.isInteger(slow) || slow < 3 || slow > 500) throw new Error("MACD_SLOW_OUT_OF_RANGE");
  if (!Number.isInteger(signalPeriod) || signalPeriod < 2 || signalPeriod > 200) throw new Error("MACD_SIGNAL_OUT_OF_RANGE");
  if (fast >= slow) throw new Error("MACD_FAST_MUST_BE_LESS_THAN_SLOW");
  const fastValues = ema(values, fast); const slowValues = ema(values, slow);
  const line = values.map((_, index) => fastValues[index] === null || slowValues[index] === null ? null : fastValues[index]! - slowValues[index]!);
  const signal = emaNullable(line, signalPeriod);
  const histogram = line.map((value, index) => value === null || signal[index] === null ? null : value - signal[index]!);
  return { macd: line, signal, histogram };
}
