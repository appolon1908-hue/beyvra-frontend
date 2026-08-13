import { IndicatorPoint } from "./types";

export function sma(values: readonly number[], period: number): IndicatorPoint[] {
  if (!Number.isInteger(period) || period < 2 || period > 500) throw new Error("SMA_PERIOD_OUT_OF_RANGE");
  let sum = 0;
  return values.map((value, index) => {
    sum += value;
    if (index >= period) sum -= values[index - period];
    return index < period - 1 ? null : sum / period;
  });
}
