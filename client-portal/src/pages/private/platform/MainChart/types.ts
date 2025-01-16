import { UTCTimestamp } from "lightweight-charts";

export type MarketData = {
  symbol: string;
  timestamp: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  trade_count?: number;
  vwap?: number;
  time: UTCTimestamp;
  value: number;
};

export type TransformedMarket = {
  [key: string]: MarketData[];
};

export interface DataPoint {
  time: UTCTimestamp;
  value: number;
}

export interface MainChartProps {
  data?: DataPoint[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
    gridLines?: string;
  };
}


