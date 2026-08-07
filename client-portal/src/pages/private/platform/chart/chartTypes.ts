export type ChartInterval = "5s" | "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

export type CanonicalCandle = {
  openTime: string;
  closeTime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  complete: boolean;
  sequence: number;
};

export type MarketQuote = { bid: string; ask: string; mid: string; occurredAt: string };
export type TimeframeCapability = { interval: ChartInterval; available: boolean; source?: string; mode?: string; reason?: string };
export type MarketCapabilities = { instrument_id: string; timeframes: TimeframeCapability[] };
export type MarketSnapshot = {
  instrument_id: string;
  interval: ChartInterval;
  sequence: number;
  server_time: string;
  market_status: "OPEN" | "CLOSED" | "UNKNOWN";
  quote: { bid: string; ask: string; mid: string; occurred_at: string };
  candles: Array<{ open_time: string; close_time: string; open: string; high: string; low: string; close: string; volume: string; complete: boolean; sequence: number }>;
};

export type ChartConnectionState = "loading" | "connected" | "recovering" | "stale" | "disconnected" | "error";
export type ChartDataState = {
  instrumentId: string;
  interval: ChartInterval;
  candles: CanonicalCandle[];
  quote?: MarketQuote;
  quoteAgeMs?: number;
  marketStatus: "OPEN" | "CLOSED" | "UNKNOWN";
  connectionState: ChartConnectionState;
  capabilities: TimeframeCapability[];
  historyCursor?: string;
  historyLoading: boolean;
  error?: string;
};
