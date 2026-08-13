import { useQuery } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

export interface PortfolioHolding {
  id: number;
  name: string;
  asset_type: string;
  number_of_shares: number;
  initial_price: number;
  current_price: number;
  current_balance: number;
  profit_loss: number;
}

export interface PortfolioSummary {
  cash_balance: number;
  invested_balance: number;
  total_balance: number;
  profit_loss: number;
  holdings: PortfolioHolding[];
  distributions: Array<{ name: string; value: number; percentage: number }>;
  wallets: Array<{ id: number; name: string; balance: number; currency: string; is_real: boolean }>;
}

export function usePortfolioSummary(token: string) {
  return useQuery({
    queryKey: ["portfolio-summary"],
    queryFn: () => authenticatedRequest<PortfolioSummary>(apiEndpoints.portfolio.summary, token),
    enabled: Boolean(token),
    refetchInterval: 30_000,
  });
}
