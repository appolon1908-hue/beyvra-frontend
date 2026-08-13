import { authenticatedRequest } from "api/client";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";
import { getUnifiedRealtimeClient, UnifiedRealtimeMessage } from "realtime/UnifiedRealtimeClient";
import { applyLiveCandle, normalizeCandle, normalizeCandles, prependHistory } from "./candles";
import { CanonicalCandle, ChartDataState, ChartInterval, MarketCapabilities, MarketSnapshot } from "./chartTypes";
import { logInternalError } from "errors/userSafeError";
import { BeyvraErrorMapper } from "errors/BeyvraErrorMapper";
import { readWithLegacyMigration, writeCompatibilityValue } from "compat/storageKeys";

type Listener = () => void;
type CandlePage = Pick<MarketSnapshot, "instrument_id" | "interval" | "sequence" | "server_time" | "candles"> & { history_cursor?: string };
type PreferenceStorage = Pick<Storage, "getItem" | "setItem">; const INTERVAL_KEY = "beyvra.chart.interval.v1"; const LEGACY_INTERVAL_KEY = "codestra.chart.interval.v1"; const intervals = new Set<ChartInterval>(["5s", "1m", "5m", "15m", "1h", "4h", "1d"]);

export class ChartDataController {
  private state: ChartDataState;
  private listeners = new Set<Listener>();
  private generation = 0;
  private snapshotAbort?: AbortController;
  private historyAbort?: AbortController;
  private unsubscribers: Array<() => void> = [];
  private sequences = new Map<string, number>();
  private recovery?: Promise<void>;

  constructor(private readonly token: string, private readonly storage: PreferenceStorage | undefined = typeof localStorage === "undefined" ? undefined : localStorage) { let interval: ChartInterval = "1m"; try { const saved = readWithLegacyMigration(storage, INTERVAL_KEY, LEGACY_INTERVAL_KEY); if (intervals.has(saved as ChartInterval) && saved !== "5s") interval = saved as ChartInterval; } catch { /* invalid preference is isolated */ } this.state = { instrumentId: "BTC-USD", interval, candles: [], marketStatus: "UNKNOWN", connectionState: "loading", capabilities: [], historyLoading: false }; }
  getSnapshot = () => this.state;
  subscribe = (listener: Listener) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };

  async selectInstrument(instrumentId: string, interval: ChartInterval = this.state.interval) {
    const generation = ++this.generation;
    this.snapshotAbort?.abort(); this.historyAbort?.abort(); this.unsubscribeAll(); this.sequences.clear();
    this.update({ ...this.state, instrumentId, interval, candles: [], quote: undefined, connectionState: "loading", error: undefined, historyCursor: undefined });
    const abort = new AbortController(); this.snapshotAbort = abort;
    try {
      const capabilities = await authenticatedRequest<MarketCapabilities>(`v1/instruments/${encodeURIComponent(instrumentId)}/market-data-capabilities`, this.token, { signal: abort.signal });
      if (!this.current(generation, instrumentId, abort)) return;
      const selected = capabilities.timeframes.find((item) => item.interval === interval);
      if (!selected?.available) { this.update({ ...this.state, capabilities: capabilities.timeframes, connectionState: "provider-unavailable", error: BeyvraErrorMapper.text({ code: "MARKET_DATA_STALE" }) }); return; }
      const snapshot = await this.fetchSnapshot(instrumentId, interval, abort.signal);
      if (!this.current(generation, instrumentId, abort)) return;
      this.applySnapshot(snapshot, capabilities.timeframes);
      this.subscribeRealtime(instrumentId, interval);
    } catch (error) { if (!abort.signal.aborted && generation === this.generation) this.fail(error); }
  }

  async selectInterval(interval: ChartInterval) {
    if (interval === this.state.interval) return;
    const capability = this.state.capabilities.find((item) => item.interval === interval);
    if (!capability?.available) { this.update({ ...this.state, error: BeyvraErrorMapper.text({ code: "MARKET_DATA_STALE" }) }); return; }
    const generation = this.generation; const instrumentId = this.state.instrumentId;
    this.snapshotAbort?.abort(); this.historyAbort?.abort(); this.unsubscribeCandle();
    const abort = new AbortController(); this.snapshotAbort = abort;
    this.update({ ...this.state, interval, connectionState: "loading", error: undefined, historyCursor: undefined });
    try {
      const page = await this.fetchCandles(instrumentId, interval, undefined, abort.signal);
      if (!this.current(generation, instrumentId, abort)) return;
      this.sequences.set(this.candleChannel(instrumentId, interval), page.sequence);
      this.update({ ...this.state, candles: normalizeCandles(page.candles), historyCursor: page.history_cursor, connectionState: "connected" });
      this.persistInterval(interval);
      this.subscribeCandle(instrumentId, interval);
    } catch (error) { if (!abort.signal.aborted && generation === this.generation) this.fail(error); }
  }

  async loadOlder() {
    if (this.state.historyLoading || !this.state.historyCursor) return;
    const generation = this.generation; const { instrumentId, interval, historyCursor } = this.state;
    const abort = new AbortController(); this.historyAbort = abort; this.update({ ...this.state, historyLoading: true });
    try {
      const page = await this.fetchCandles(instrumentId, interval, historyCursor, abort.signal);
      if (!this.current(generation, instrumentId, abort)) return;
      this.update({ ...this.state, candles: prependHistory(this.state.candles, normalizeCandles(page.candles)), historyCursor: page.history_cursor, historyLoading: false });
    } catch (error) { if (!abort.signal.aborted) { logInternalError(error, { endpoint: "market.history" }); this.update({ ...this.state, historyLoading: false, error: BeyvraErrorMapper.text(error) }); } }
  }

  stop() { ++this.generation; this.snapshotAbort?.abort(); this.historyAbort?.abort(); this.unsubscribeAll(); this.update({ ...this.state, connectionState: "disconnected" }); }
  refreshQuoteAge(now = Date.now(), staleAfterMs = 15_000) {
    if (!this.state.quote || ["loading", "recovering", "disconnected", "error"].includes(this.state.connectionState)) return;
    const quoteAgeMs = Math.max(0, now - Date.parse(this.state.quote.occurredAt));
    this.update({ ...this.state, quoteAgeMs, connectionState: quoteAgeMs > staleAfterMs ? "stale" : "connected" });
  }

  private async fetchSnapshot(instrumentId: string, interval: ChartInterval, signal: AbortSignal) {
    return authenticatedRequest<MarketSnapshot>(`v1/market-data/snapshot?${new URLSearchParams({ instrument_id: instrumentId, interval, limit: "500" })}`, this.token, { signal });
  }
  private async fetchCandles(instrumentId: string, interval: ChartInterval, before: string | undefined, signal: AbortSignal) {
    const params = new URLSearchParams({ instrument_id: instrumentId, interval, limit: "500" }); if (before) params.set("before", before);
    return authenticatedRequest<CandlePage>(`v1/market-data/candles?${params}`, this.token, { signal });
  }
  private applySnapshot(snapshot: MarketSnapshot, capabilities = this.state.capabilities) {
    const quoteChannel = this.quoteChannel(snapshot.instrument_id); const candleChannel = this.candleChannel(snapshot.instrument_id, snapshot.interval);
    this.sequences.set(quoteChannel, snapshot.sequence); this.sequences.set(candleChannel, snapshot.sequence);
    this.update({ instrumentId: snapshot.instrument_id, interval: snapshot.interval, candles: normalizeCandles(snapshot.candles), quote: { bid: snapshot.quote.bid, ask: snapshot.quote.ask, mid: snapshot.quote.mid, occurredAt: snapshot.quote.occurred_at }, quoteAgeMs: Date.now() - Date.parse(snapshot.quote.occurred_at), marketStatus: snapshot.market_status, connectionState: "connected", capabilities, historyCursor: snapshot.candles[0]?.open_time, historyLoading: false });
    this.persistInterval(snapshot.interval);
  }
  private subscribeRealtime(instrumentId: string, interval: ChartInterval) {
    const client = getUnifiedRealtimeClient(this.token, async () => (await webSocketTicketFetcher(this.token)).ws_ticket);
    this.unsubscribers.push(client.subscribe("system.status", (event) => this.onConnectionEvent(event)));
    this.unsubscribers.push(client.subscribe(this.quoteChannel(instrumentId), (event) => this.onEvent(event)));
    this.subscribeCandle(instrumentId, interval);
  }
  private subscribeCandle(instrumentId: string, interval: ChartInterval) {
    const client = getUnifiedRealtimeClient(this.token, async () => (await webSocketTicketFetcher(this.token)).ws_ticket);
    this.unsubscribers.push(client.subscribe(this.candleChannel(instrumentId, interval), (event) => this.onEvent(event)));
  }
  private onEvent(event: UnifiedRealtimeMessage) {
    const channel = String(event.channel || "");
    if (!channel || !this.channelMatchesCurrent(channel) || typeof event.sequence !== "number") return;
    const previous = this.sequences.get(channel);
    if (previous !== undefined && event.sequence <= previous) return;
    if (previous !== undefined && event.sequence > previous + 1) { void this.recover(); return; }
    this.sequences.set(channel, event.sequence);
    const data = (event.data || {}) as Record<string, unknown>;
    if (channel.endsWith(".quote")) {
      const occurredAt = String(event.occurred_at || event.server_time || new Date().toISOString());
      const mid = String(data.mid ?? data.close ?? ""); if (!mid) return;
      this.update({ ...this.state, quote: { bid: String(data.bid ?? mid), ask: String(data.ask ?? mid), mid, occurredAt }, quoteAgeMs: 0, connectionState: "connected" });
    } else if (channel.includes(".candle.")) {
      const candle = this.eventCandle(data, event.sequence); if (!candle) return;
      this.update({ ...this.state, candles: applyLiveCandle(this.state.candles, candle), connectionState: "connected" });
    }
  }
  private onConnectionEvent(event: UnifiedRealtimeMessage) {
    if (event.type === "sequence.gap" && this.channelMatchesCurrent(String(event.channel || ""))) { void this.recover(); return; }
    if (event.type !== "connection") return;
    const status = String(event.status || "");
    if (status === "connected") {
      const reconnected = ["disconnected", "reconnecting", "recovering"].includes(this.state.connectionState);
      this.update({ ...this.state, connectionState: reconnected ? "reconnected" : "connected", error: undefined });
    } else if (status === "reconnecting") this.update({ ...this.state, connectionState: "reconnecting" });
    else if (status === "disconnected") this.update({ ...this.state, connectionState: "disconnected" });
    else if (status === "error") this.update({ ...this.state, connectionState: "reconnecting", error: BeyvraErrorMapper.text({ code: "NETWORK_ERROR" }, "realtime") });
  }
  private eventCandle(data: Record<string, unknown>, sequence: number): CanonicalCandle | undefined {
    const seconds = Number(data.time); if (!Number.isFinite(seconds)) return undefined;
    const durations: Record<ChartInterval, number> = { "5s": 5, "1m": 60, "5m": 300, "15m": 900, "1h": 3_600, "4h": 14_400, "1d": 86_400 };
    const openTime = new Date(seconds * 1000).toISOString(); const duration = durations[this.state.interval];
    return normalizeCandle({ open_time: openTime, close_time: new Date((seconds + duration) * 1000).toISOString(), open: String(data.open), high: String(data.high), low: String(data.low), close: String(data.close), volume: String(data.volume ?? "0"), complete: Boolean(data.closed), sequence });
  }
  private recover() {
    if (this.recovery) return this.recovery;
    const generation = this.generation; const { instrumentId, interval } = this.state;
    this.update({ ...this.state, connectionState: "recovering" });
    const abort = new AbortController();
    this.recovery = this.fetchSnapshot(instrumentId, interval, abort.signal).then((snapshot) => { if (generation === this.generation && snapshot.instrument_id === instrumentId) this.applySnapshot(snapshot); }).catch((error) => this.fail(error)).finally(() => { this.recovery = undefined; });
    return this.recovery;
  }
  private current(generation: number, instrumentId: string, abort: AbortController) { return generation === this.generation && instrumentId === this.state.instrumentId && !abort.signal.aborted; }
  private channelMatchesCurrent(channel: string) { return channel === this.quoteChannel(this.state.instrumentId) || channel === this.candleChannel(this.state.instrumentId, this.state.interval); }
  private quoteChannel(instrumentId: string) { return `market.${instrumentId}.quote`; }
  private candleChannel(instrumentId: string, interval: ChartInterval) { return `market.${instrumentId}.candle.${interval}`; }
  private unsubscribeCandle() { this.unsubscribers.pop()?.(); }
  private unsubscribeAll() { for (const unsubscribe of this.unsubscribers.splice(0)) unsubscribe(); }
  private fail(error: unknown) { logInternalError(error, { endpoint: "market.realtime" }); this.update({ ...this.state, connectionState: BeyvraErrorMapper.marketState(error), error: BeyvraErrorMapper.text(error) }); }
  private persistInterval(interval: ChartInterval) { if (interval === "5s") return; try { writeCompatibilityValue(this.storage, INTERVAL_KEY, interval); } catch { /* preference failure is non-fatal */ } }
  private update(state: ChartDataState) { this.state = state; this.listeners.forEach((listener) => listener()); }
}
