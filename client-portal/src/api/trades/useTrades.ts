import { useQuery } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

export interface TradeRecord {
  id: string;
  instrument: string;
  side: "BUY" | "SELL";
  quantity: string;
  price: string;
  fee: string;
  state: string;
  trade_time: string;
  simulation: true;
}

export function useTrades(token: string, status: "open" | "pending" | "completed") {
  return useQuery({
    queryKey: ["trades", status],
    queryFn: async () => {
      const payload = await authenticatedRequest<{ results: TradeRecord[] }>(apiEndpoints.trades.list, token, {
        headers: { "X-Beyvra-Simulation-Mode": "true" },
      });
      return status === "completed" ? payload.results : [];
    },
    enabled: Boolean(token),
    refetchInterval: status === "completed" ? 30_000 : 5_000,
  });
}
