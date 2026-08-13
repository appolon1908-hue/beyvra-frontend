import { CanonicalCandle, MarketSnapshot } from "./chartTypes";

export function normalizeCandle(candle: MarketSnapshot["candles"][number]): CanonicalCandle | undefined {
  const values = [candle.open, candle.high, candle.low, candle.close, candle.volume];
  if (values.some((value) => typeof value !== "string" || !Number.isFinite(Number(value)))) return undefined;
  const [open, high, low, close] = values.slice(0, 4).map(Number);
  if (high < open || high < close || low > open || low > close || high < low) return undefined;
  if (!Number.isFinite(Date.parse(candle.open_time)) || !Number.isFinite(Date.parse(candle.close_time))) return undefined;
  return { openTime: candle.open_time, closeTime: candle.close_time, open: candle.open, high: candle.high, low: candle.low, close: candle.close, volume: candle.volume, complete: candle.complete, sequence: candle.sequence };
}

export function normalizeCandles(candles: MarketSnapshot["candles"]): CanonicalCandle[] {
  const unique = new Map<string, CanonicalCandle>();
  for (const raw of candles) {
    const candle = normalizeCandle(raw);
    if (candle) unique.set(candle.openTime, candle);
  }
  return [...unique.values()].sort((a, b) => Date.parse(a.openTime) - Date.parse(b.openTime));
}

export function applyLiveCandle(current: CanonicalCandle[], candle: CanonicalCandle): CanonicalCandle[] {
  const last = current.at(-1);
  if (!last) return [candle];
  const incomingTime = Date.parse(candle.openTime);
  const lastTime = Date.parse(last.openTime);
  if (incomingTime < lastTime) return current;
  if (incomingTime === lastTime) return [...current.slice(0, -1), candle];
  return [...current, candle];
}

export function prependHistory(current: CanonicalCandle[], older: CanonicalCandle[]): CanonicalCandle[] {
  const unique = new Map([...older, ...current].map((candle) => [candle.openTime, candle]));
  return [...unique.values()].sort((a, b) => Date.parse(a.openTime) - Date.parse(b.openTime));
}
