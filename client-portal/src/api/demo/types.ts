export type DemoDirection = "up" | "down";
export type DemoTradeState = "DRAFT" | "SUBMITTING" | "OPEN" | "SETTLING" | "WON" | "LOST" | "DRAW" | "REJECTED" | "CANCELLED";

export interface DemoOrderRequest {
  symbol: string;
  amount: number;
  duration: number;
  direction: DemoDirection;
}

export interface DemoTrade {
  id: string | number;
  symbol: string;
  direction: DemoDirection;
  amount: string | number;
  state: DemoTradeState;
  result?: "WON" | "LOST" | "DRAW" | null;
  openingPrice?: string | number | null;
  closingPrice?: string | number | null;
  openedAt: string;
  expiresAt: string;
  settledAt?: string | null;
}

export interface DemoWallet {
  currency: "Virtual USD" | string;
  available: string;
  reserved: string;
  balance?: string;
}

export interface MarketQuote {
  symbol: string;
  price: number;
  timestamp: string;
  stale: boolean;
}

export interface DemoConfiguration {
  durations: number[];
  minAmount: number;
  maxAmount: number;
  amountStep: number;
  payoutRate?: string;
  assets: string[];
}
