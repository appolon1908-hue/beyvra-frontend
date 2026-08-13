import { IndicatorPoint } from "./types";

export function rsi(values: readonly number[], period: number): IndicatorPoint[] {
  if (!Number.isInteger(period) || period < 2 || period > 200) throw new Error("RSI_PERIOD_OUT_OF_RANGE");
  const output: IndicatorPoint[] = Array(values.length).fill(null);
  if (values.length <= period) return output;
  let gains = 0; let losses = 0;
  for (let index = 1; index <= period; index += 1) {
    const change = values[index] - values[index - 1]; gains += Math.max(change, 0); losses += Math.max(-change, 0);
  }
  let averageGain = gains / period; let averageLoss = losses / period;
  output[period] = averageLoss === 0 ? 100 : 100 - 100 / (1 + averageGain / averageLoss);
  for (let index = period + 1; index < values.length; index += 1) {
    const change = values[index] - values[index - 1];
    averageGain = (averageGain * (period - 1) + Math.max(change, 0)) / period;
    averageLoss = (averageLoss * (period - 1) + Math.max(-change, 0)) / period;
    output[index] = averageLoss === 0 ? 100 : 100 - 100 / (1 + averageGain / averageLoss);
  }
  return output;
}
