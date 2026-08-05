import { useCallback, useEffect, useState } from "react";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { DemoTrade } from "api/demo/types";

export function useDemoTrades(token?: string) {
  const [trades, setTrades] = useState<DemoTrade[]>([]);
  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const payload = await authenticatedRequest<DemoTrade[] | { results: DemoTrade[] }>(apiEndpoints.demo.trades, token, { timeoutMs: 10_000 });
      const next = Array.isArray(payload) ? payload : payload.results;
      if (Array.isArray(next)) setTrades(next);
    } catch {
      // Preserve the last server state during transient polling failures.
    }
  }, [token]);
  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 5_000);
    return () => window.clearInterval(timer);
  }, [refresh]);
  return { trades, refresh };
}
