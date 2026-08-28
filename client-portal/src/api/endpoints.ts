export const apiEndpoints = {
  workspace: {
    bootstrap: "v1/workspace/bootstrap",
  },
  portfolio: {
    summary: "portfolio/summary/",
  },
  trades: {
    list: "v1/trading/trades",
    assets: "trades/assets/",
    detail: (tradeId: string) => `v1/trading/trades/${encodeURIComponent(tradeId)}`,
  },
  notifications: {
    list: "v1/notifications/notifications/",
    toggle: "notification/toggle_notification/",
    inbox: "notification/inbox/",
    read: (eventId: string) => `notification/inbox/${eventId}/read/`,
    readAll: "notification/inbox/read-all/",
    webhooks: "notification/webhooks/",
    webhook: (webhookId: string) => `notification/webhooks/${webhookId}/`,
    webhookTest: (webhookId: string) => `notification/webhooks/${webhookId}/test/`,
    webhookDeliveries: (webhookId: string) => `notification/webhooks/${webhookId}/deliveries/`,
  },
  market: {
    history: "v1/market/trades",
    snapshot: "v1/market/quotes",
    candles: "v1/market/candles",
  },
  demo: {
    config: "v1/demo/config",
  },
  simulationTrading: {
    preview: "v1/trading/orders/preview",
    orders: "v1/trading/orders",
    order: (orderId: string) => `v1/trading/orders/${encodeURIComponent(orderId)}`,
    cancel: (orderId: string) => `v1/trading/orders/${encodeURIComponent(orderId)}/cancel`,
    trades: "v1/trading/trades",
    positions: "v1/trading/positions",
    accounts: "v1/trading/accounts",
  },
  // Canonical (non-simulation) order lifecycle. Contracts pending backend delivery;
  // gate all usage behind platform.capabilities so the UI never assumes availability.
  orders: {
    preview: "v1/orders/preview",
    list: "v1/orders",
    create: "v1/orders",
    detail: (orderId: string) => `v1/orders/${encodeURIComponent(orderId)}`,
    cancel: (orderId: string) => `v1/orders/${encodeURIComponent(orderId)}/cancel`,
    replace: (orderId: string) => `v1/orders/${encodeURIComponent(orderId)}/replace`,
    events: (orderId: string) => `v1/orders/${encodeURIComponent(orderId)}/events`,
    executions: "v1/executions",
  },
  accounts: {
    list: "v1/accounts",
    detail: (accountId: string) => `v1/accounts/${encodeURIComponent(accountId)}`,
    balances: (accountId: string) => `v1/accounts/${encodeURIComponent(accountId)}/balances`,
    buyingPower: (accountId: string) => `v1/accounts/${encodeURIComponent(accountId)}/buying-power`,
    transactions: (accountId: string) => `v1/accounts/${encodeURIComponent(accountId)}/transactions`,
    statements: (accountId: string) => `v1/accounts/${encodeURIComponent(accountId)}/statements`,
    taxLots: (accountId: string) => `v1/accounts/${encodeURIComponent(accountId)}/tax-lots`,
  },
  marketV2: {
    instruments: "v1/instruments",
    instrument: (instrumentId: string) => `v1/instruments/${encodeURIComponent(instrumentId)}`,
    marketsStatus: "v1/markets/status",
    snapshot: "v1/market/snapshot",
    candles: "v1/market/candles",
    orderBook: "v1/market/order-book",
    trades: "v1/market/trades",
    capabilities: "v1/market/capabilities",
  },
  watchlists: {
    list: "v1/watchlists",
    create: "v1/watchlists",
    detail: (watchlistId: string) => `v1/watchlists/${encodeURIComponent(watchlistId)}`,
    update: (watchlistId: string) => `v1/watchlists/${encodeURIComponent(watchlistId)}`,
    remove: (watchlistId: string) => `v1/watchlists/${encodeURIComponent(watchlistId)}`,
    items: (watchlistId: string) => `v1/watchlists/${encodeURIComponent(watchlistId)}/items`,
    removeItem: (watchlistId: string, itemId: string) =>
      `v1/watchlists/${encodeURIComponent(watchlistId)}/items/${encodeURIComponent(itemId)}`,
    reorderItems: (watchlistId: string) => `v1/watchlists/${encodeURIComponent(watchlistId)}/items/reorder`,
  },
  alerts: {
    list: "v1/alerts",
    create: "v1/alerts",
    detail: (alertId: string) => `v1/alerts/${encodeURIComponent(alertId)}`,
    update: (alertId: string) => `v1/alerts/${encodeURIComponent(alertId)}`,
    remove: (alertId: string) => `v1/alerts/${encodeURIComponent(alertId)}`,
    history: "v1/alerts/history",
  },
  compliance: {
    profile: "v1/compliance/profile",
    requirements: "v1/compliance/requirements",
    kycSessions: "v1/compliance/kyc/sessions",
    status: "v1/compliance/status",
    documents: "v1/compliance/documents",
    restrictions: "v1/compliance/restrictions",
    acknowledgements: "v1/compliance/acknowledgements",
  },
  platform: {
    config: "v1/platform/config",
    capabilities: "v1/platform/capabilities",
  },
  news: {
    list: "v1/news",
    detail: (articleId: string) => `v1/news/${encodeURIComponent(articleId)}`,
    calendar: "v1/economic-calendar",
  },
  // These capabilities are intentionally not advertised until a matching
  // backend contract exists. Demo configuration is served by demo.config.
  realtime: {
    snapshot: "v1/realtime/snapshot",
    resume: "v1/realtime/resume",
  },
  integrations: {
    tenantContext: "v1/tenant/context",
    users: "v1/users",
    imports: "v1/users/imports",
    importTemplate: "v1/users/imports/template",
    importDetail: (id: string) => `v1/users/imports/${id}`,
    importRows: (id: string) => `v1/users/imports/${id}/rows`,
    importCommit: (id: string) => `v1/users/imports/${id}/commit`,
    importCancel: (id: string) => `v1/users/imports/${id}/cancel`,
    crmConnections: "v1/integrations/crm/connections",
    crmConnection: (id: string) => `v1/integrations/crm/connections/${id}`,
  },
} as const;

export const socketEndpoints = {
  canonical: "ws/v2/",
} as const;
