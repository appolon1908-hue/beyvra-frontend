import { authenticatedRequest, ApiError } from "api/client";
import { BFF_SESSION_MARKER } from "security/bffSession";

export type EvidenceQuality = "EMPTY" | "COMPLETE" | "PARTIAL" | "UNAVAILABLE";
export type PerformanceRange = "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL";

export interface PortfolioPosition {
  id: string;
  instrument_id: string;
  symbol: string;
  asset_class: string;
  currency: string;
  venue: string | null;
  quantity: string;
  average_entry_price: string;
  market_price: string | null;
  market_value: string | null;
  unrealized_pnl: string | null;
  realized_pnl: string;
  price_as_of: string | null;
  price_quality: string;
  simulation: true;
}

export interface PortfolioSummary {
  account_id: string;
  base_currency: string;
  cash: string;
  available_cash: string;
  reserved_cash: string;
  market_value: string;
  equity: string;
  unrealized_pnl: string;
  realized_pnl: string;
  positions: PortfolioPosition[];
  valuation_quality: EvidenceQuality;
  as_of: string;
  simulation: true;
  live_trading_enabled: false;
}

export interface PerformancePoint {
  period_start: string;
  period_end: string;
  opening_value: string;
  closing_value: string;
  pnl: string;
  return: string;
  quality: string;
}

export interface PortfolioPerformance {
  range: PerformanceRange;
  currency: string;
  results: PerformancePoint[];
  quality: EvidenceQuality;
  reason: string | null;
  simulation: true;
}

export interface AllocationBucket {
  asset_class: string;
  market_value: string;
  weight: string | null;
}

export interface PortfolioAllocations {
  currency: string;
  results: AllocationBucket[];
  unpriced_instruments: string[];
  quality: EvidenceQuality;
  simulation: true;
}

export interface PortfolioRisk {
  equity: string;
  gross_exposure: string;
  gross_exposure_ratio: string | null;
  largest_position_ratio: string | null;
  cash_ratio: string | null;
  open_orders: number;
  value_at_risk: string | null;
  stress_loss: string | null;
  advanced_risk_reason: string;
  valuation_quality: EvidenceQuality;
  simulation_available: boolean;
  simulation: true;
  live_trading_enabled: false;
}

export interface WatchlistItem {
  id: string;
  instrument_id: string;
  symbol: string | null;
  sort_order: number;
  created_at: string;
}

export interface Watchlist {
  id: string;
  name: string;
  is_default: boolean;
  items: WatchlistItem[];
  created_at: string;
  updated_at: string;
}

const ensureOnlineMutation = () => {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new ApiError(0, "OFFLINE_MUTATION_BLOCKED");
  }
};

const request = <T>(endpoint: string, init?: RequestInit) =>
  authenticatedRequest<T>(endpoint, BFF_SESSION_MARKER, init);

export const enterpriseApi = {
  portfolioSummary: () => request<PortfolioSummary>("v1/portfolio/summary"),
  portfolioPerformance: (range: PerformanceRange = "1M") =>
    request<PortfolioPerformance>(`v1/portfolio/performance?range=${range}`),
  portfolioAllocations: () => request<PortfolioAllocations>("v1/portfolio/allocations"),
  portfolioRisk: () => request<PortfolioRisk>("v1/portfolio/risk"),
  watchlists: () => request<{ results: Watchlist[] }>("v1/watchlists"),
  createWatchlist: (name: string) => {
    ensureOnlineMutation();
    return request<Watchlist>("v1/watchlists", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  },
  addWatchlistItem: (watchlistId: string, instrument: string) => {
    ensureOnlineMutation();
    return request<WatchlistItem>(`v1/watchlists/${watchlistId}/items`, {
      method: "POST",
      body: JSON.stringify({ instrument_id: instrument }),
    });
  },
};

