export function assertDemoInvariants({ orders, trades, wallet }) {
  if (!Array.isArray(orders) || !Array.isArray(trades) || typeof wallet !== "object" || wallet === null) {
    throw new Error("MALFORMED_RECONCILIATION_EVIDENCE");
  }
  const orderIds = orders.map((item) => String(item.id));
  if (new Set(orderIds).size !== orderIds.length) throw new Error("DUPLICATE_DEMO_ORDER_IDS");
  const tradeIds = trades.map((item) => String(item.id));
  if (new Set(tradeIds).size !== tradeIds.length) throw new Error("DUPLICATE_DEMO_TRADE_IDS");
  for (const item of [...orders, ...trades]) {
    if (item.simulation === false || item.real === true) throw new Error("NON_SIMULATION_RESOURCE_OBSERVED");
  }
  return { orderCount: orders.length, tradeCount: trades.length, walletObserved: true };
}

