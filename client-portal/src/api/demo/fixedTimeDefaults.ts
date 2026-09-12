import type { DemoConfiguration } from "./types";

// Presentation defaults for the retained Fixed-Time controls.
// Spot PAPER orders use the canonical order contract.
export const fixedTimeDefaults: DemoConfiguration = {
  durations: [5, 15, 30, 60],
  minAmount: 1,
  maxAmount: 10000,
  amountStep: 1,
  payoutRate: "0.80",
  assets: ["BTCUSDT"],
};
