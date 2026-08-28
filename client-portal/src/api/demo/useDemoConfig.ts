import { useQuery } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { DemoConfiguration } from "./types";

const fallback: DemoConfiguration = {
  durations: [5, 15, 30, 60],
  minAmount: 1,
  maxAmount: 10000,
  amountStep: 1,
  payoutRate: "0.80",
  assets: ["BTCUSDT"],
};

export function useDemoConfig() {
  return useQuery({
    queryKey: ["demo-config"],
    queryFn: () => authenticatedRequest<DemoConfiguration>(apiEndpoints.demo.config, "", { timeoutMs: 10_000 }),
    placeholderData: fallback,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export { fallback as demoConfigFallback };
