import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import type { PaginatedResponse } from "api/types";
import type { AssetClass, MarketDataInterval, OrderType } from "api/platform/capabilities";

export type VenueStatus = "OPEN" | "CLOSED" | "PRE_MARKET" | "AFTER_HOURS" | "HALTED";

export interface Instrument {
  id: string;
  symbol: string;
  asset_class: AssetClass;
  tradable: boolean;
  /** Populated when the instrument replaced a prior symbol; see symbol-change history. */
  previous_symbols: string[];
}

export interface CorporateAction {
  type: string;
  effective_date: string;
  details: Record<string, unknown>;
}

export interface SymbolChange {
  previous_symbol: string;
  new_symbol: string;
  effective_date: string;
}

export interface MarketStatus {
  venue: string;
  status: VenueStatus;
  session: string;
  next_change_at: string;
}

/** All quote-like payloads carry freshness metadata so the UI can reject stale prices instead of guessing. */
export interface FreshnessMetadata {
  as_of: string;
  received_at: string;
  is_stale: boolean;
  provider_gap_detected: boolean;
}

export interface MarketSnapshot extends FreshnessMetadata {
  instrument: string;
  bid: string;
  ask: string;
  last: string;
}

export interface Candle {
  instrument: string;
  interval: MarketDataInterval;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  start_time: string;
  end_time: string;
}

export interface OrderBookLevel {
  price: string;
  quantity: string;
}

export interface MarketOrderBook extends FreshnessMetadata {
  instrument: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface MarketTrade {
  instrument: string;
  price: string;
  quantity: string;
  side: "BUY" | "SELL";
  traded_at: string;
}

export interface MarketCapabilities {
  supported_asset_classes: AssetClass[];
  supported_order_types: OrderType[];
  intervals: MarketDataInterval[];
}

function withCursor(endpoint: string, cursor?: string): string {
  return cursor ? `${endpoint}?cursor=${encodeURIComponent(cursor)}` : endpoint;
}

export function listInstruments(token: string, cursor?: string): Promise<PaginatedResponse<Instrument>> {
  return authenticatedRequest<PaginatedResponse<Instrument>>(withCursor(apiEndpoints.marketV2.instruments, cursor), token);
}

export function getInstrument(token: string, instrumentId: string): Promise<Instrument> {
  return authenticatedRequest<Instrument>(apiEndpoints.marketV2.instrument(instrumentId), token);
}

export function getMarketsStatus(token: string): Promise<MarketStatus[]> {
  return authenticatedRequest<MarketStatus[]>(apiEndpoints.marketV2.marketsStatus, token);
}

export function getMarketSnapshot(token: string, instrument: string): Promise<MarketSnapshot> {
  return authenticatedRequest<MarketSnapshot>(
    `${apiEndpoints.marketV2.snapshot}?instrument=${encodeURIComponent(instrument)}`,
    token,
  );
}

export function getMarketCandles(
  token: string,
  instrument: string,
  interval: MarketDataInterval,
  cursor?: string,
): Promise<PaginatedResponse<Candle>> {
  const endpoint = `${apiEndpoints.marketV2.candles}?instrument=${encodeURIComponent(instrument)}&interval=${encodeURIComponent(interval)}`;
  return authenticatedRequest<PaginatedResponse<Candle>>(withCursor(endpoint, cursor), token);
}

export function getMarketOrderBook(token: string, instrument: string): Promise<MarketOrderBook> {
  return authenticatedRequest<MarketOrderBook>(
    `${apiEndpoints.marketV2.orderBook}?instrument=${encodeURIComponent(instrument)}`,
    token,
  );
}

export function getMarketTrades(token: string, instrument: string, cursor?: string): Promise<PaginatedResponse<MarketTrade>> {
  const endpoint = `${apiEndpoints.marketV2.trades}?instrument=${encodeURIComponent(instrument)}`;
  return authenticatedRequest<PaginatedResponse<MarketTrade>>(withCursor(endpoint, cursor), token);
}

export function getMarketCapabilities(token: string): Promise<MarketCapabilities> {
  return authenticatedRequest<MarketCapabilities>(apiEndpoints.marketV2.capabilities, token);
}
