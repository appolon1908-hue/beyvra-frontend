import { useQuery } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import type { SimulationOrder, SimulationOrderState } from "api/trading/simulation";

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

export function useTrades(token = "", status: "open" | "pending" | "completed") {
  return useQuery({
    queryKey: ["trades", status],
    queryFn: async () => {
      if (status !== "completed") {
        const payload = await authenticatedRequest<{ results: SimulationOrder[] }>(apiEndpoints.simulationTrading.orders, token, {
          headers: { "X-Beyvra-Simulation-Mode": "true" },
        });
        const states: Record<"open" | "pending", SimulationOrderState[]> = {
          open: ["OPEN", "PARTIALLY_FILLED"],
          pending: ["PENDING", "ACCEPTED", "CANCEL_PENDING"],
        };
        return payload.results
          .filter((order) => states[status].includes(order.state))
          .map<TradeRecord>((order) => ({
            id: order.id,
            instrument: order.instrument,
            side: order.side,
            quantity: order.quantity,
            price: "0",
            fee: "0",
            state: order.state,
            trade_time: "",
            simulation: true,
          }));
      }
      const payload = await authenticatedRequest<{ results: TradeRecord[] }>(apiEndpoints.trades.list, token, {
        headers: { "X-Beyvra-Simulation-Mode": "true" },
      });
      return payload.results;
    },
    refetchInterval: status === "completed" ? 30_000 : 5_000,
  });
}
