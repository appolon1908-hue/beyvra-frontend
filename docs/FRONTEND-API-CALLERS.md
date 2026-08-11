# Frontend API Caller Inventory

Generated from production TypeScript/JavaScript sources. Test fixtures are inventoried separately in the route-test matrix.

Call sites: **74**. Unmapped: **0**.

| File | Line | Classification | Caller |
|---|---:|---|---|
| `src/api/client.ts` | 11 | CANONICAL_CLIENT_ABSTRACTION | `export async function authenticatedRequest<T>(` |
| `src/api/client.ts` | 22 | MAPPED_CANONICAL_CLIENT | `const response = await fetch(getApiUrl(endpoint), {` |
| `src/api/compliance/useCompliance.ts` | 3 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/api/compliance/useCompliance.ts` | 42 | MAPPED_CANONICAL_CLIENT | `export function useComplianceProfile(token?: string) { return useQuery({ queryKey:["compliance-profile"], queryFn:()=>authenticatedRequest<ComplianceProfile>(apiEndpoints.compliance.profile,token!), enabled:Boolean(token), staleTime:15_000 }); }` |
| `src/api/compliance/useCompliance.ts` | 43 | MAPPED_CANONICAL_CLIENT | `export function useComplianceRequirements(token?: string) { return useQuery({ queryKey:["compliance-requirements"], queryFn:()=>authenticatedRequest<{results:ComplianceRequirement[]}>(apiEndpoints.compliance.requirements,token!), enabled:Boolean(token), staleTime:15_000 }); }` |
| `src/api/demo/useDemoConfig.ts` | 3 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/api/demo/useDemoConfig.ts` | 21 | MAPPED_CANONICAL_CLIENT | `queryFn: () => authenticatedRequest<DemoConfiguration>(apiEndpoints.demo.config, cookies.access_token, { timeoutMs: 10_000 }),` |
| `src/api/generated/codestraDemo.ts` | 34 | MAPPED_CANONICAL_CLIENT | `const response = await fetch(getApiUrl(path), {` |
| `src/api/notification/useNotificationInbox.ts` | 3 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/api/notification/useNotificationInbox.ts` | 33 | MAPPED_CANONICAL_CLIENT | `const response = await authenticatedRequest<InboxResponse>(` |
| `src/api/notification/useNotificationInbox.ts` | 34 | MAPPED_CANONICAL_CLIENT | ``${apiEndpoints.notifications.inbox}?limit=50${pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ""}`,` |
| `src/api/notification/useNotificationInbox.ts` | 51 | MAPPED_CANONICAL_CLIENT | `mutationFn: (eventId: string) => authenticatedRequest(` |
| `src/api/notification/useNotificationInbox.ts` | 52 | MAPPED_CANONICAL_CLIENT | `apiEndpoints.notifications.read(eventId), token!, { method: "POST" }` |
| `src/api/notification/useNotificationInbox.ts` | 61 | MAPPED_CANONICAL_CLIENT | `mutationFn: () => authenticatedRequest(` |
| `src/api/notification/useNotificationInbox.ts` | 62 | MAPPED_CANONICAL_CLIENT | `apiEndpoints.notifications.readAll, token!, { method: "POST" }` |
| `src/api/notification/useWebhooks.ts` | 2 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/api/notification/useWebhooks.ts` | 34 | MAPPED_CANONICAL_CLIENT | `queryFn: async () => unwrap(await authenticatedRequest<WebhookSubscription[] \| { results?: WebhookSubscription[] }>(apiEndpoints.notifications.webhooks, token!)),` |
| `src/api/notification/useWebhooks.ts` | 43 | MAPPED_CANONICAL_CLIENT | `authenticatedRequest<WebhookSubscription>(apiEndpoints.notifications.webhooks, token!, { method: "POST", body: JSON.stringify(payload) }),` |
| `src/api/notification/useWebhooks.ts` | 55 | MAPPED_CANONICAL_CLIENT | `authenticatedRequest<WebhookSubscription>(apiEndpoints.notifications.webhook(id), token!, { method: "PATCH", body: JSON.stringify(payload) }),` |
| `src/api/notification/useWebhooks.ts` | 63 | MAPPED_CANONICAL_CLIENT | `mutationFn: (id: string) => authenticatedRequest<void>(apiEndpoints.notifications.webhook(id), token!, { method: "DELETE" }),` |
| `src/api/notification/useWebhooks.ts` | 71 | MAPPED_CANONICAL_CLIENT | `mutationFn: (id: string) => authenticatedRequest(apiEndpoints.notifications.webhookTest(id), token!, { method: "POST", body: JSON.stringify({}) }),` |
| `src/api/notification/useWebhooks.ts` | 79 | MAPPED_CANONICAL_CLIENT | `queryFn: async () => unwrap(await authenticatedRequest<WebhookDelivery[] \| { results?: WebhookDelivery[] }>(apiEndpoints.notifications.webhookDeliveries(id!), token!)),` |
| `src/api/portfolio/usePortfolioSummary.ts` | 2 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/api/portfolio/usePortfolioSummary.ts` | 29 | MAPPED_CANONICAL_CLIENT | `queryFn: () => authenticatedRequest<PortfolioSummary>(apiEndpoints.portfolio.summary, token),` |
| `src/api/tenant/useTenantContext.ts` | 3 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/api/tenant/useTenantContext.ts` | 13 | MAPPED_CANONICAL_CLIENT | `queryFn: () => authenticatedRequest<TenantContext>(apiEndpoints.integrations.tenantContext, cookies.access_token),` |
| `src/api/trades/useTrades.ts` | 2 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/api/trades/useTrades.ts` | 25 | MAPPED_CANONICAL_CLIENT | `const payload = await authenticatedRequest<TradeRecord[] \| { results: TradeRecord[] }>(` |
| `src/api/trades/useTrades.ts` | 26 | MAPPED_CANONICAL_CLIENT | ``${apiEndpoints.trades.list}?status=${status}`,` |
| `src/api/trades/useTrades.ts` | 39 | MAPPED_CANONICAL_CLIENT | `mutationFn: (tradeId: number) => authenticatedRequest<TradeRecord>(apiEndpoints.trades.cancel(tradeId), token, { method: "POST" }),` |
| `src/api/trading/simulation.ts` | 1 | CLIENT_IMPORT | `import { authenticatedRequest, ApiError } from "api/client";` |
| `src/api/trading/simulation.ts` | 43 | MAPPED_CANONICAL_CLIENT | `return authenticatedRequest<{ results: T[] }>(endpoint, token, { headers: simulationHeaders });` |
| `src/api/trading/simulation.ts` | 46 | MAPPED_CANONICAL_CLIENT | `export const listSimulationOrders = (token: string) => list<SimulationOrder>(apiEndpoints.simulationTrading.orders, token);` |
| `src/api/trading/simulation.ts` | 47 | MAPPED_CANONICAL_CLIENT | `export const listSimulationPositions = (token: string) => list<SimulationPosition>(apiEndpoints.simulationTrading.positions, token);` |
| `src/api/trading/simulation.ts` | 48 | MAPPED_CANONICAL_CLIENT | `export const listSimulationAccounts = (token: string) => list<SimulationAccount>(apiEndpoints.simulationTrading.accounts, token);` |
| `src/api/trading/simulation.ts` | 51 | MAPPED_CANONICAL_CLIENT | `const result = await authenticatedRequest<SimulationPreview>(apiEndpoints.simulationTrading.preview, token, {` |
| `src/api/trading/simulation.ts` | 61 | MAPPED_CANONICAL_CLIENT | `return authenticatedRequest<SimulationOrder>(apiEndpoints.simulationTrading.orders, token, {` |
| `src/api/trading/simulation.ts` | 69 | MAPPED_CANONICAL_CLIENT | `return authenticatedRequest<SimulationOrder>(apiEndpoints.simulationTrading.cancel(orderId), token, {` |
| `src/api/wallet/useDemoFunds.ts` | 2 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/api/wallet/useDemoFunds.ts` | 10 | MAPPED_CANONICAL_CLIENT | `mutationFn: ({ amount }: DemoFundsInput) => authenticatedRequest(` |
| `src/api/wallet/useDemoFunds.ts` | 11 | MAPPED_CANONICAL_CLIENT | `apiEndpoints.wallets.refill, token!, {` |
| `src/api/wallet/useDemoFunds.ts` | 27 | MAPPED_CANONICAL_CLIENT | `mutationFn: ({ walletId, amount }: DemoFundsInput) => authenticatedRequest(` |
| `src/api/wallet/useDemoFunds.ts` | 28 | MAPPED_CANONICAL_CLIENT | `apiEndpoints.wallets.withdraw(walletId), token!, {` |
| `src/api/wallet/useTrade.ts` | 5 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/api/wallet/useTrade.ts` | 20 | MAPPED_CANONICAL_CLIENT | `return await authenticatedRequest<boolean>(apiEndpoints.trades.list, token, {` |
| `src/api/wallet/useTransactions.ts` | 3 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/api/wallet/useTransactions.ts` | 55 | MAPPED_CANONICAL_CLIENT | `return authenticatedRequest<TransactionResultType>(`${apiEndpoints.wallets.transactions}?${searchParams}`, token);` |
| `src/api/workspace/useWorkspaceBootstrap.ts` | 3 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/api/workspace/useWorkspaceBootstrap.ts` | 30 | MAPPED_CANONICAL_CLIENT | `const payload = await authenticatedRequest<WorkspaceBootstrap>(apiEndpoints.workspace.bootstrap, cookies.access_token, { timeoutMs: 10_000 });` |
| `src/components/assetSelectionContainer/AssetSelectionContainer.tsx` | 6 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/components/assetSelectionContainer/AssetSelectionContainer.tsx` | 35 | MAPPED_CANONICAL_CLIENT | `const response = await authenticatedRequest<AssetResponse>(` |
| `src/components/assetSelectionContainer/AssetSelectionContainer.tsx` | 36 | MAPPED_CANONICAL_CLIENT | `apiEndpoints.trades.assets,` |
| `src/i18n/geoLocale.ts` | 16 | APPROVED_EXTERNAL_LOCALE_DISCOVERY | `const response = await fetch(endpoint, { credentials: "same-origin" });` |
| `src/pages/private/integrations/IntegrationsAdmin.tsx` | 2 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/pages/private/integrations/IntegrationsAdmin.tsx` | 21 | MAPPED_CANONICAL_CLIENT | `setConnections(await authenticatedRequest<CRMConnection[]>(apiEndpoints.integrations.crmConnections, token));` |
| `src/pages/private/integrations/IntegrationsAdmin.tsx` | 31 | MAPPED_CANONICAL_CLIENT | `const endpoint = action === "commit" ? apiEndpoints.integrations.importCommit(id) : apiEndpoints.integrations.importCancel(id);` |
| `src/pages/private/integrations/IntegrationsAdmin.tsx` | 32 | MAPPED_CANONICAL_CLIENT | `await authenticatedRequest(endpoint, token, { method: "POST", body: "{}" });` |
| `src/pages/private/integrations/IntegrationsAdmin.tsx` | 35 | MAPPED_CANONICAL_CLIENT | `const createUser = async (event: FormEvent) => { event.preventDefault(); const payload = { ...user, consent: { terms_accepted: user.terms_accepted } }; await authenticatedRequest(apiEndpoints.integrations.users, token, { method: "POST", body: JSON.stringify(payload), headers: { "Idempotency-Key": cr` |
| `src/pages/private/integrations/IntegrationsAdmin.tsx` | 36 | MAPPED_CANONICAL_CLIENT | `const createCRM = async (event: FormEvent) => { event.preventDefault(); await authenticatedRequest(apiEndpoints.integrations.crmConnections, token, { method: "POST", body: JSON.stringify({ ...crm, provider: "generic_webhook", event_categories: ["user.created", "demo_account.created"] }) }); setCrm({` |
| `src/pages/private/integrations/IntegrationsAdmin.tsx` | 42 | MAPPED_CANONICAL_CLIENT | `<section><h2>Bulk user import</h2><a href={getApiUrl(apiEndpoints.integrations.importTemplate)} download>Download CSV template</a><input aria-label="Upload users CSV" type="file" accept=".csv,text/csv" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file).catch((er` |
| `src/pages/private/platform/chart/ChartDataController.ts` | 1 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/pages/private/platform/chart/ChartDataController.ts` | 34 | MAPPED_PARAMETERIZED_CLIENT | `const capabilities = await authenticatedRequest<MarketCapabilities>(`v1/instruments/${encodeURIComponent(instrumentId)}/market-data-capabilities`, this.token, { signal: abort.signal });` |
| `src/pages/private/platform/chart/ChartDataController.ts` | 82 | MAPPED_PARAMETERIZED_CLIENT | `return authenticatedRequest<MarketSnapshot>(`v1/market-data/snapshot?${new URLSearchParams({ instrument_id: instrumentId, interval, limit: "500" })}`, this.token, { signal });` |
| `src/pages/private/platform/chart/ChartDataController.ts` | 86 | MAPPED_PARAMETERIZED_CLIENT | `return authenticatedRequest<CandlePage>(`v1/market-data/candles?${params}`, this.token, { signal });` |
| `src/pages/private/platform/hooks/useDemoTrades.ts` | 2 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/pages/private/platform/hooks/useDemoTrades.ts` | 29 | MAPPED_CANONICAL_CLIENT | `const payload = await authenticatedRequest<DemoTrade[] \| { results: DemoTrade[] }>(apiEndpoints.demo.trades, token, { timeoutMs: 10_000 });` |
| `src/pages/private/platform/hooks/useNewsCalendarOverlay.ts` | 2 | CLIENT_IMPORT | `import { ApiError, authenticatedRequest } from "api/client";` |
| `src/pages/private/platform/hooks/useNewsCalendarOverlay.ts` | 13 | MAPPED_CANONICAL_CLIENT | `try { const payload = await authenticatedRequest<{ results: NewsArticle[] }>(`${apiEndpoints.news.list}?instrument_id=${encodeURIComponent(instrumentId)}&limit=25`, token); if (current === generation.current) { store.replaceNews(payload.results); setMessage(""); } }` |
| `src/pages/private/platform/hooks/useNewsCalendarOverlay.ts` | 18 | MAPPED_CANONICAL_CLIENT | `try { const payload = await authenticatedRequest<{ results: EconomicEvent[] }>(`${apiEndpoints.news.calendar}?instrument_id=${encodeURIComponent(instrumentId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, token); store.replaceEconomic(payload.results); }` |
| `src/pages/private/platform/hooks/useNewsCalendarOverlay.ts` | 23 | MAPPED_CANONICAL_CLIENT | `try { store.mergeNewsDetail(await authenticatedRequest<NewsArticle>(apiEndpoints.news.detail(articleId), token)); }` |
| `src/pages/private/platform/platformMenus/market/MarketMenu.tsx` | 7 | CLIENT_IMPORT | `import { authenticatedRequest } from "api/client";` |
| `src/pages/private/platform/platformMenus/market/MarketMenu.tsx` | 22 | MAPPED_CANONICAL_CLIENT | `const response = await authenticatedRequest<AssetResponse>(apiEndpoints.trades.assets, cookies.access_token);` |
| `src/realtime/UnifiedRealtimeClient.ts` | 97 | MAPPED_CANONICAL_CLIENT | `? new WebSocket(getSocketUrl("ws/v2/connection/websocket"))` |
| `src/realtime/UnifiedRealtimeClient.ts` | 98 | MAPPED_CANONICAL_CLIENT | `: new WebSocket(getSocketUrl("ws/v1/", { ws_ticket: wsTicket }));` |
