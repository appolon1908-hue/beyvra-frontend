import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

export interface TradeRecord {
  id: number;
  wallet: number;
  asset: number;
  quantity: number;
  price_per_unit: number;
  trade_type: string;
  duration: number | null;
  result_time: string | null;
  net: number;
  open: number;
  close: number;
  is_active: boolean;
  created_at: string;
}

export function useTrades(token: string, status: "open" | "pending" | "completed") {
  return useQuery({
    queryKey: ["trades", status],
    queryFn: async () => {
      const payload = await authenticatedRequest<TradeRecord[] | { results: TradeRecord[] }>(
        `${apiEndpoints.trades.list}?status=${status}`,
        token,
      );
      return Array.isArray(payload) ? payload : payload.results;
    },
    enabled: Boolean(token),
    refetchInterval: status === "completed" ? 30_000 : 5_000,
  });
}

export function useCancelTrade(token: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tradeId: number) => authenticatedRequest<TradeRecord>(apiEndpoints.trades.cancel(tradeId), token, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["trades"] }),
  });
}
