import { useAppSelector } from "@store/hooks";
import { useEffect, useState } from "react";
import { getUnifiedRealtimeClient } from "realtime/UnifiedRealtimeClient";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";

export type ChartDataType = { open: number; high: number; low: number; close: number; timestamp: number; time: number; value: number };
interface SocketConnectReturn { oldData: ChartDataType[]; data: ChartDataType | null }

/** Legacy facade backed by the shared gateway. Kept until old consumers are removed. */
const useSocketConnect = (wsTicket: string): SocketConnectReturn => {
  const [oldData, setOldData] = useState<ChartDataType[]>([]);
  const [data, setData] = useState<ChartDataType | null>(null);
  const { chartSymbol } = useAppSelector((state) => state.socketStockCrypto);

  useEffect(() => {
    if (!wsTicket) return;
    const symbol = `${chartSymbol || "BTC"}USDT`;
    const client = getUnifiedRealtimeClient(wsTicket, async () => (await webSocketTicketFetcher(wsTicket)).ws_ticket);
    let first = true; let open = 0; let high = 0; let low = 0;
    return client.subscribe(`market.${symbol}.candle.1m`, (message) => {
      const candle = (message.data || {}) as Record<string, any>;
      if (candle.type !== "candle") return;
      const price = Number(candle.close); const time = Number(candle.time);
      if (first) { first = false; open = Number(candle.open); high = Number(candle.high); low = Number(candle.low); setOldData([{ open, high, low, close: price, timestamp: time, time, value: price }]); }
      else { high = Math.max(high, Number(candle.high)); low = Math.min(low, Number(candle.low)); setData({ open, high, low, close: price, timestamp: time, time, value: price }); }
    });
  }, [chartSymbol, wsTicket]);
  return { data, oldData };
};

export default useSocketConnect;
