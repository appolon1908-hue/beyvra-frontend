import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { PlatformFeatureFlags, stagingPlatformFeatures } from "config/platformFeatures";
import { beyvraRequest } from "api/generated/beyvra";
import type { WorkspaceBootstrap } from "api/workspace/useWorkspaceBootstrap";

export async function fetchPlatformConfig(token: string): Promise<PlatformFeatureFlags> {
  const payload = await beyvraRequest<WorkspaceBootstrap>("v1/workspace/bootstrap", { token });
  const live = payload.account.execution_mode === "LIVE";
  return {
    ...stagingPlatformFeatures,
    paperTrading: payload.account.execution_mode === "PAPER" && payload.account.trading_enabled === true,
    liveTrading: live && payload.account.trading_enabled === true && payload.features.realTrading === true,
    deposits: live && payload.account.funding_enabled === true && payload.features.payments === true,
    withdrawals: live && payload.account.withdrawals_enabled === true && payload.features.payments === true,
  };
}

export function usePlatformConfig() {
  const [cookies] = useCookies(["access_token"]);
  return useQuery({
    queryKey: ["platform-config", cookies.access_token ?? "anonymous"],
    queryFn: () => fetchPlatformConfig(cookies.access_token ?? ""),
    enabled: Boolean(cookies.access_token),
    staleTime: 5 * 60_000,
    retry: 1,
    placeholderData: stagingPlatformFeatures,
  });
}
