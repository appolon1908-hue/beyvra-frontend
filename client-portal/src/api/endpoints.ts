export const apiEndpoints = {
  portfolio: {
    summary: "portfolio/summary/",
  },
  wallets: {
    list: "wallet/wallets/",
    transactions: "wallet/transactions/",
    deposit: (walletId: number) => `wallet/wallets/${walletId}/deposit/`,
    withdraw: (walletId: number) => `wallet/wallets/${walletId}/withdraw/`,
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
    list: "notification/notifications/",
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
    history: "trades/market/history/",
    snapshot: "v1/market/snapshot",
    candles: "v1/market/candles",
  },
  demo: {
    config: "v1/demo/config",
    orders: "v1/demo/orders",
    trades: "v1/demo/trades",
    wallet: "v1/demo/wallet",
  },
  realtime: {
    news: "v1/news",
    economicCalendar: "v1/economic-calendar",
    health: "v1/realtime/health",
    platformConfig: "platform/config",
  },
  integrations: {
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
  realtimeMarket: "ws/v1/market-data",
  realtimeNews: "ws/v1/news",
  realtimeAccount: "ws/v1/account",
  realtimePlatform: "ws/v1/platform",
  market: "ws/market-data/",
  trades: "ws/trades/",
  users: "ws/users/",
  external: "ws/external-api/",
  balance: (userId: number | string) => `ws/current-balance/${userId}/`,
  profitLoss: (userId: number | string) => `ws/profit-loss/${userId}/`,
} as const;
