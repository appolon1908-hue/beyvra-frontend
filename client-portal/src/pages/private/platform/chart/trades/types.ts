export type TradeMarkerStatus = "PENDING" | "ACTIVE" | "WON" | "LOST" | "DRAW" | "CANCELLED" | "REJECTED" | "EXPIRED";
export type TradeDirection = "UP" | "DOWN";
export type TradeChartMarker = {
  id: string;
  tradeId: string;
  accountId: string;
  instrumentId: string;
  direction: TradeDirection;
  status: TradeMarkerStatus;
  version: number;
  openTime: number;
  openPrice: string;
  expiryTime: number;
  settlementTime?: number;
  settlementPrice?: string;
  amount?: string;
  payoutPercent?: string;
};

export type TradeMarkerState = { markers: TradeChartMarker[]; estimatedServerNow: number; duplicateEvents: number; staleEvents: number };
