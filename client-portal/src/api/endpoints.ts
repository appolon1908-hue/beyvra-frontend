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
  market: "ws/market-data/",
  trades: "ws/trades/",
  users: "ws/users/",
  external: "ws/external-api/",
  balance: (userId: number | string) => `ws/current-balance/${userId}/`,
  profitLoss: (userId: number | string) => `ws/profit-loss/${userId}/`,
} as const;
