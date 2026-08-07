import { IndicatorPoint } from "./types";

export function ema(values: readonly number[], period: number): IndicatorPoint[] {
  if (!Number.isInteger(period) || period < 2 || period > 500) throw new Error("EMA_PERIOD_OUT_OF_RANGE");
  const output: IndicatorPoint[] = Array(values.length).fill(null);
  if (values.length < period) return output;
  let current = values.slice(0, period).reduce((sum, value) => sum + value, 0) / period;
  output[period - 1] = current;
  const multiplier = 2 / (period + 1);
  for (let index = period; index < values.length; index += 1) {
    current = (values[index] - current) * multiplier + current;
    output[index] = current;
  }
  return output;
}

export function emaNullable(values: readonly (number | null)[], period: number): IndicatorPoint[] {
  const first = values.findIndex((value) => value !== null);
  if (first < 0) return Array(values.length).fill(null);
  const calculated = ema(values.slice(first) as number[], period);
  return [...Array(first).fill(null), ...calculated];
}
