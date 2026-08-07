import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { DemoTrade } from "api/demo/types";
import { getUnifiedRealtimeClient, UnifiedRealtimeMessage } from "realtime/UnifiedRealtimeClient";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";
import { demoTradeFromRealtime, tradeEventVersion } from "../chart/trades/TradeMarkerStore";

export type DemoRealtimeScope = { demo_order_channel: string; demo_execution_channel: string };
export const authorizedDemoChannels = (scope: DemoRealtimeScope) => [scope.demo_order_channel, scope.demo_execution_channel] as const;

export function useDemoTrades(token?: string, accountId?: string, realtime?: DemoRealtimeScope) {
  const orderChannel = realtime?.demo_order_channel;
  const executionChannel = realtime?.demo_execution_channel;
  const [trades, setTrades] = useState<DemoTrade[]>([]);
  const [lastEvent, setLastEvent] = useState<UnifiedRealtimeMessage>();
  const versions = useRef(new Map<string, number>());
  const requestGeneration = useRef(0);
  useLayoutEffect(() => {
    requestGeneration.current += 1;
    versions.current.clear();
    setTrades([]);
    setLastEvent(undefined);
  }, [accountId, orderChannel, executionChannel]);
  const refresh = useCallback(async () => {
    if (!token || !accountId) return;
    const generation = requestGeneration.current;
    try {
      const payload = await authenticatedRequest<DemoTrade[] | { results: DemoTrade[] }>(apiEndpoints.demo.trades, token, { timeoutMs: 10_000 });
      const next = Array.isArray(payload) ? payload : payload.results;
      if (generation === requestGeneration.current && Array.isArray(next)) setTrades(next);
    } catch {
      // Preserve the last server state during transient polling failures.
    }
  }, [token, accountId]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  useEffect(() => {
    if (!token || !accountId || !orderChannel || !executionChannel) return;
    const client = getUnifiedRealtimeClient(token, async () => (await webSocketTicketFetcher(token)).ws_ticket);
    const receive = (event: UnifiedRealtimeMessage) => {
      const trade = demoTradeFromRealtime(event); const version = tradeEventVersion(event);
      if (!trade || !Number.isFinite(version)) return;
      const id = String(trade.id); if ((versions.current.get(id) ?? -1) >= version) { setLastEvent({ ...event }); return; }
      versions.current.set(id, version); setTrades((current) => current.some((item) => String(item.id) === id) ? current.map((item) => String(item.id) === id ? trade : item) : [trade, ...current]); setLastEvent({ ...event });
    };
    const [authorizedOrder, authorizedExecution] = authorizedDemoChannels({ demo_order_channel: orderChannel, demo_execution_channel: executionChannel });
    const order = client.subscribe(authorizedOrder, receive); const execution = client.subscribe(authorizedExecution, receive);
    return () => { order(); execution(); };
  }, [token, accountId, orderChannel, executionChannel]);
  return { trades, refresh, lastEvent };
}
