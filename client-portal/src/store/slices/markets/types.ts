import { UTCTimestamp } from "lightweight-charts";

export type CryptoItem = {
  value: number;
  time: UTCTimestamp;
  symbol: string;
  timestamp: number;
  ope?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  trade_count?: number;
  vwap?: number;
};

export type AssestType = {
    "id": string;
    "asset_class": string;
    "exchange": string;
    "symbol": string;
    "name": string;
    "status": string;
    "tradable": boolean;
    "marginable": boolean;
    "shortable": boolean;
    "easy_to_borrow": boolean;
    "fractionable": boolean;
    "min_order_size": number;
    "min_trade_increment": number;
    "price_increment": null;
    "maintenance_margin_requirement": number;
    "attributes": Array<any>
  }

// Define a type for the slice state
export interface CryptoSliceState {
  crypto: Record<string, CryptoItem[]>;
  assets: AssestType[] | string;
  status: "idle" | "loading" | "succeeded" | "failed";
  start: string;
  end?: string;
  symbol: string;
  wsRoom: string;
  currentSymbol:string;
  timeFrame: "day" | "hour" | "minute" | "month" | "week";
  error: string | Record<string, unknown> | null;
}
