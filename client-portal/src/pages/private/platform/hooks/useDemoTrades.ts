import { useCallback, useEffect, useRef, useState } from "react";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { DemoTrade } from "api/demo/types";
import { getUnifiedRealtimeClient, UnifiedRealtimeMessage } from "realtime/UnifiedRealtimeClient";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";
import { demoTradeFromRealtime, tradeEventVersion } from "../chart/trades/TradeMarkerStore";

export const demoTradeChannels = (accountId: string) => ({
  order: `demo.order.${accountId}`,
  execution: `demo.execution.${accountId}`,
});

export function useDemoTrades(token?: string, accountId?: string) {
  const [trades, setTrades] = useState<DemoTrade[]>([]);
  const [lastEvent, setLastEvent] = useState<UnifiedRealtimeMessage>();
  const versions = useRef(new Map<string, number>());
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
  }, [refresh]);
  useEffect(() => {
    if (!token || !accountId) return;
    versions.current.clear();
    const client = getUnifiedRealtimeClient(token, async () => (await webSocketTicketFetcher(token)).ws_ticket);
    const receive = (event: UnifiedRealtimeMessage) => {
      const trade = demoTradeFromRealtime(event); const version = tradeEventVersion(event);
      if (!trade || !Number.isFinite(version)) return;
      const id = String(trade.id); if ((versions.current.get(id) ?? -1) >= version) { setLastEvent({ ...event }); return; }
      versions.current.set(id, version); setTrades((current) => current.some((item) => String(item.id) === id) ? current.map((item) => String(item.id) === id ? trade : item) : [trade, ...current]); setLastEvent({ ...event });
    };
    const channels = demoTradeChannels(accountId);
    const order = client.subscribe(channels.order, receive); const execution = client.subscribe(channels.execution, receive);
    return () => { order(); execution(); };
  }, [token, accountId]);
  return { trades, refresh, lastEvent };
}
