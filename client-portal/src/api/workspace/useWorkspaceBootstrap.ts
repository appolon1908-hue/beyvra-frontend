import { useQuery } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { DemoConfiguration } from "api/demo/types";

export type WorkspaceBootstrap = {
  state: "guest.ready" | "user.ready";
  tenant: { id: string };
  account: { id: string; kind: "DEMO"; demoOnly: true };
  realtime: { demo_order_channel: string; demo_execution_channel: string };
  wallet: { currency: "Virtual USD"; available: string; reserved: string; total: string };
  notifications: { unreadCount: number };
  features: { inZone: boolean; payments: boolean; realWallets: boolean; realTrading: boolean };
  instrument: { symbol: string; marketStatus: string };
  instruments: string[];
  tradingRules: { durations: number[]; minAmount: string; maxAmount: string; amountStep: string; payoutRate: string };
  savedAssetTabs: string[];
  chartPreferences: { interval: string; chartType: string };
};

export function useWorkspaceBootstrap() {
  return useQuery({
    queryKey: ["workspace-bootstrap"],
    staleTime: 60_000,
    retry: 1,
    queryFn: async () => {
      const payload = await authenticatedRequest<WorkspaceBootstrap>(apiEndpoints.workspace.bootstrap, "", { timeoutMs: 10_000 });
      const rules: DemoConfiguration = {
        durations: payload.tradingRules.durations,
        minAmount: Number(payload.tradingRules.minAmount),
        maxAmount: Number(payload.tradingRules.maxAmount),
        amountStep: Number(payload.tradingRules.amountStep),
        payoutRate: payload.tradingRules.payoutRate,
        assets: payload.instruments,
      };
      return { payload, rules };
    },
  });
}
