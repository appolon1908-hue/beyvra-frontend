import { useCallback, useEffect, useRef, useState } from "react";
import { CandlestickData, Time } from "lightweight-charts";
import { authenticatedRequest } from "api/client";
import { recordPlatformEvent } from "../../../../observability/platformTelemetry";

export function useMarketHistory({ token, symbol, interval, onState, onError }: { token?: string; symbol: string; interval: string; onState: (state: "loading" | "connected" | "error") => void; onError: (message: string) => void }) {
  const [history, setHistory] = useState<CandlestickData[]>([]);
  const [retryKey, setRetryKey] = useState(0);
  const stateRef = useRef(onState); const errorRef = useRef(onError);
  stateRef.current = onState; errorRef.current = onError;
  useEffect(() => {
    let disposed = false;
    const load = async () => {
      if (!token) return;
      setHistory([]);
      stateRef.current("loading");
      const started = performance.now();
      try {
        const payload = await authenticatedRequest<{ results?: CandlestickData[] }>(`trades/market/history/?symbol=${symbol}&interval=${interval}&limit=200`, token, { timeoutMs: 15_000 });
        if (disposed) return;
        const results = Array.isArray(payload.results) ? payload.results : [];
        recordPlatformEvent("market_snapshot", { symbol, interval, durationMs: Math.round(performance.now() - started), status: "ok" });
        setHistory(results as CandlestickData[]);
        if (results.length) stateRef.current("connected");
        if (!results.length) errorRef.current("No market history is available for this asset");
      } catch (error) {
        recordPlatformEvent("market_snapshot", { symbol, interval, durationMs: Math.round(performance.now() - started), status: "error" });
        if (!disposed) errorRef.current(error instanceof Error ? error.message : "Market data is unavailable");
      }
    };
    void load();
    return () => { disposed = true; };
  }, [token, symbol, interval, retryKey]);
  return { history, retry: useCallback(() => setRetryKey((value) => value + 1), []) };
}

export type MarketCandle = { time: Time; open: number; high: number; low: number; close: number };
