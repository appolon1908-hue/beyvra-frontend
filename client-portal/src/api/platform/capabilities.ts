import { useQuery } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

export type AssetClass = "CRYPTO" | "FOREX" | "EQUITY" | "COMMODITY" | "INDEX";
export type OrderType = "MARKET" | "LIMIT" | "STOP" | "STOP_LIMIT" | "TRAILING_STOP";
export type MarketDataInterval = "1s" | "1m" | "5m" | "15m" | "1h" | "4h" | "1d" | "1w";
export type PlatformMode = "NORMAL" | "DEGRADED" | "MAINTENANCE";

export interface ProviderHealth {
  provider: string;
  status: "HEALTHY" | "DEGRADED" | "DOWN" | "UNKNOWN";
  last_checked_at: string;
}

/**
 * Authoritative source of enabled financial capabilities. The frontend must not
 * infer or guess any of these values locally; unavailable/unknown fields must
 * disable the corresponding feature rather than assume it is on.
 */
export interface PlatformCapabilities {
  simulation_enabled: boolean;
  live_trading_enabled: boolean;
  supported_asset_classes: AssetClass[];
  supported_order_types: OrderType[];
  market_data_intervals: MarketDataInterval[];
  deposits_enabled: boolean;
  withdrawals_enabled: boolean;
  provider_health: ProviderHealth[];
  mode: PlatformMode;
  degraded_reason_codes: string[];
  compliance_requirements: string[];
  schema_version: string;
  as_of: string;
}

export async function fetchPlatformCapabilities(token: string): Promise<PlatformCapabilities> {
  return authenticatedRequest<PlatformCapabilities>(apiEndpoints.platform.capabilities, token);
}

export function usePlatformCapabilities(token?: string) {
  return useQuery({
    queryKey: ["platform-capabilities"],
    queryFn: () => fetchPlatformCapabilities(token!),
    enabled: Boolean(token),
    staleTime: 30_000,
    retry: 1,
  });
}
