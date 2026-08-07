import { DemoTrade, DemoTradeState } from "api/demo/types";
import { UnifiedRealtimeMessage } from "realtime/UnifiedRealtimeClient";
import { TradeChartMarker, TradeMarkerState, TradeMarkerStatus } from "./types";

const mapStatus = (state: DemoTradeState | string, result?: string | null): TradeMarkerStatus => {
  const value = String(result || state).toUpperCase();
  if (value === "WON" || value === "LOST" || value === "DRAW" || value === "CANCELLED" || value === "REJECTED" || value === "EXPIRED") return value;
  return ["OPEN", "SETTLING", "ACTIVE"].includes(value) ? "ACTIVE" : "PENDING";
};
const instrumentFor = (symbol: string) => `${symbol.replace(/USDT$|\/USD$|-USD$/i, "").toUpperCase()}-USD`;
const seconds = (value: unknown) => { const parsed = typeof value === "number" ? value : Date.parse(String(value)); return Number.isFinite(parsed) ? (typeof value === "number" ? Math.floor(parsed > 10_000_000_000 ? parsed / 1000 : parsed) : Math.floor(parsed / 1000)) : undefined; };
const stringValue = (value: unknown) => value === undefined || value === null || value === "" ? undefined : String(value);

export function demoTradeFromRealtime(event: UnifiedRealtimeMessage): DemoTrade | undefined {
  const raw = ((event.data as Record<string, unknown> | undefined)?.trade || event.data || event.payload || {}) as Record<string, unknown>;
  const id = raw.id ?? raw.trade_id ?? raw.tradeId; const symbol = raw.symbol ?? raw.instrument_id ?? event.instrument_id;
  if (!id || !symbol) return undefined;
  return { id: String(id), symbol: String(symbol), direction: String(raw.direction ?? raw.trade_type ?? "up").toLowerCase() === "down" ? "down" : "up", amount: String(raw.amount ?? ""), state: String(raw.state ?? raw.status ?? "PENDING") as DemoTradeState, result: (raw.result as DemoTrade["result"]) ?? null, openingPrice: stringValue(raw.openingPrice ?? raw.open_price) ?? null, closingPrice: stringValue(raw.closingPrice ?? raw.settlement_price) ?? null, openedAt: String(raw.openedAt ?? raw.open_time ?? ""), expiresAt: String(raw.expiresAt ?? raw.expiry_time ?? ""), settledAt: stringValue(raw.settledAt ?? raw.settlement_time), payoutPercent: stringValue(raw.payoutPercent ?? raw.payout_percent) };
}
export function tradeEventVersion(event: UnifiedRealtimeMessage): number {
  const raw = ((event.data as Record<string, unknown> | undefined)?.trade || event.data || event.payload || {}) as Record<string, unknown>;
  return Number(raw.status_version ?? raw.version ?? event.sequence ?? event.event_version ?? event.version);
}

export class TradeMarkerStore {
  private state: TradeMarkerState = { markers: [], estimatedServerNow: Date.now(), duplicateEvents: 0, staleEvents: 0 };
  private listeners = new Set<() => void>();
  private serverOffsetMs = 0;
  readonly subscribe = (listener: () => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  readonly getSnapshot = () => this.state;
  markersFor(instrumentId: string) { return this.state.markers.filter((marker) => marker.instrumentId === instrumentId); }
  remainingSeconds(marker: TradeChartMarker) { return Math.max(0, Math.ceil(marker.expiryTime - this.state.estimatedServerNow / 1000)); }
  clearAccountScope() {
    this.serverOffsetMs = 0;
    this.state = { markers: [], estimatedServerNow: Date.now(), duplicateEvents: 0, staleEvents: 0 };
    this.emit();
  }

  replaceInitial(trades: readonly DemoTrade[], accountId: string, receivedAt = Date.now()) {
    const active = trades.filter((trade) => ["DRAFT", "SUBMITTING", "OPEN", "SETTLING"].includes(trade.state));
    const settled = trades.filter((trade) => !active.includes(trade)).slice(0, 20);
    const markers = [...active, ...settled].map((trade) => this.normalize(trade, accountId, this.state.markers.find((marker) => marker.tradeId === String(trade.id))?.version ?? 0)).filter(Boolean) as TradeChartMarker[];
    this.state = { ...this.state, markers, estimatedServerNow: receivedAt + this.serverOffsetMs }; this.emit();
  }

  applyRealtime(event: UnifiedRealtimeMessage, accountId: string, receivedAt = Date.now()): boolean {
    const serverTime = event.server_time ?? event.occurred_at; if (serverTime) this.updateServerClock(String(serverTime), receivedAt);
    const trade = demoTradeFromRealtime(event); const version = tradeEventVersion(event);
    if (!trade || !Number.isFinite(version)) return false;
    const candidate = this.normalize(trade, accountId, version, serverTime ? seconds(serverTime) : undefined); if (!candidate) return false;
    const existing = this.state.markers.find((marker) => marker.tradeId === candidate.tradeId);
    if (existing && version < existing.version) { this.state = { ...this.state, staleEvents: this.state.staleEvents + 1 }; this.emit(); return false; }
    if (existing && version === existing.version) { this.state = { ...this.state, duplicateEvents: this.state.duplicateEvents + 1 }; this.emit(); return false; }
    const markers = existing ? this.state.markers.map((marker) => marker.tradeId === candidate.tradeId ? candidate : marker) : [...this.state.markers, candidate];
    this.state = { ...this.state, markers, estimatedServerNow: receivedAt + this.serverOffsetMs }; this.emit(); return true;
  }
  tick(clientNow = Date.now()) { this.state = { ...this.state, estimatedServerNow: clientNow + this.serverOffsetMs }; this.emit(); }
  synchronizeServerTime(serverTime: string, receivedAt = Date.now()) { this.updateServerClock(serverTime, receivedAt); this.tick(receivedAt); }

  private normalize(trade: DemoTrade, accountId: string, version: number, fallbackSettlementTime?: number): TradeChartMarker | undefined {
    const openTime = seconds(trade.openedAt); const expiryTime = seconds(trade.expiresAt); const openPrice = stringValue(trade.openingPrice);
    if (!trade.id || !trade.symbol || !openTime || !expiryTime || !openPrice || !Number.isFinite(Number(openPrice))) return undefined;
    const status = mapStatus(trade.state, trade.result); const settlementTime = seconds(trade.settledAt) ?? (["WON", "LOST", "DRAW", "CANCELLED", "REJECTED", "EXPIRED"].includes(status) ? fallbackSettlementTime : undefined);
    const settlementPrice = stringValue(trade.closingPrice); if (settlementPrice && !Number.isFinite(Number(settlementPrice))) return undefined;
    return { id: `trade-marker-${trade.id}`, tradeId: String(trade.id), accountId, instrumentId: instrumentFor(trade.symbol), direction: String(trade.direction).toUpperCase() === "DOWN" ? "DOWN" : "UP", status, version, openTime, openPrice, expiryTime, settlementTime, settlementPrice, amount: stringValue(trade.amount), payoutPercent: stringValue(trade.payoutPercent) };
  }
  private updateServerClock(serverTime: string, receivedAt: number) { const parsed = Date.parse(serverTime); if (Number.isFinite(parsed)) this.serverOffsetMs = parsed - receivedAt; }
  private emit() { this.listeners.forEach((listener) => listener()); }
}
