import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
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
  const [cookies] = useCookies(["access_token"]);
  return useQuery({
    queryKey: ["demo-config"],
    enabled: Boolean(cookies.access_token),
    queryFn: () => authenticatedRequest<DemoConfiguration>(apiEndpoints.demo.config, cookies.access_token, { timeoutMs: 10_000 }),
    placeholderData: fallback,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export { fallback as demoConfigFallback };
