import { useCallback, useEffect, useState } from "react";
import { listSimulationAccounts, listSimulationOrders, listSimulationPositions, SimulationAccount, SimulationOrder, SimulationPosition } from "api/trading/simulation";
import { getUnifiedRealtimeClient, UnifiedRealtimeMessage } from "realtime/UnifiedRealtimeClient";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";

export function useSimulationTrading(token?: string, userId?: string | number) {
  const [orders, setOrders] = useState<SimulationOrder[]>([]);
  const [positions, setPositions] = useState<SimulationPosition[]>([]);
  const [accounts, setAccounts] = useState<SimulationAccount[]>([]);
  const [lastEvent, setLastEvent] = useState<UnifiedRealtimeMessage>();
  const refresh = useCallback(async () => {
    if (!token || !userId) return;
    const [nextOrders, nextPositions, nextAccounts] = await Promise.all([
      listSimulationOrders(token), listSimulationPositions(token), listSimulationAccounts(token),
    ]);
    setOrders(nextOrders.results); setPositions(nextPositions.results); setAccounts(nextAccounts.results);
  }, [token, userId]);
  useEffect(() => { void refresh().catch(() => undefined); }, [refresh]);
  useEffect(() => {
    if (!token || !userId) return;
    const client = getUnifiedRealtimeClient(token, async () => (await webSocketTicketFetcher(token)).ws_ticket);
    const accountRef = `sim-${userId}`;
    const receive = (event: UnifiedRealtimeMessage) => { setLastEvent(event); void refresh().catch(() => undefined); };
    const recover = async () => { await refresh(); };
    const channels = ["order", "execution", "position"].map((kind) => `simulation.${kind}.${accountRef}`);
    const unsubscribe = channels.map((channel) => client.subscribe(channel, receive, recover));
    return () => unsubscribe.forEach((stop) => stop());
  }, [token, userId, refresh]);
  return { orders, positions, accounts, lastEvent, refresh };
}
