export const apiEndpoints = {
  workspace: {
    bootstrap: "v1/workspace/bootstrap",
  },
  portfolio: {
    summary: "portfolio/summary/",
  },
  wallets: {
    list: "v1/demo/wallets",
    transactions: "v1/reports/transactions",
    refill: "v1/demo/wallets/refill",
    // Compatibility-only demo actions. New code must use refill and canonical
    // trading endpoints; real-value funding remains server-disabled.
    deposit: (_walletId: number) => "v1/demo/wallets/refill",
    withdraw: (_walletId: number) => "v1/withdrawals",
  },
  trades: {
    list: "trades/",
    assets: "trades/assets/",
    detail: (tradeId: number) => `trades/${tradeId}/`,
    cancel: (tradeId: number) => `trades/${tradeId}/cancel/`,
  },
  payments: {
    list: "payment/",
    methods: "payment/methods/",
    deposits: "payment/deposits/history/",
  },
  notifications: {
    list: "v1/notifications",
    toggle: "v1/notifications/preferences",
    inbox: "v1/notifications",
    read: (eventId: string) => `v1/notifications/${eventId}/read`,
    readAll: "v1/notifications/read-all",
    preferences: "v1/notifications/preferences",
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
    orders: "v1/demo/orders",
    trades: "v1/demo/trades",
    wallet: "v1/demo/account",
    wallets: "v1/demo/wallets",
    positions: "v1/demo/positions",
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
  compliance: {
    profile: "v1/compliance/profile",
    requirements: "v1/compliance/requirements",
    kycSessions: "v1/compliance/kyc/sessions",
  },
  news: {
    list: "v1/news",
    detail: (articleId: string) => `v1/news/${encodeURIComponent(articleId)}`,
    calendar: "v1/economic-calendar",
  },
  // These capabilities are intentionally not advertised until a matching
  // backend contract exists. Demo configuration is served by demo.config.
  realtime: {},
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
