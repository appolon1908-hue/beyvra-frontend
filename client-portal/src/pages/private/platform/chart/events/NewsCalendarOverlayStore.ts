import { EconomicEvent, NewsArticle, OverlayFilter, OverlayMarker, OverlaySnapshot } from "./types";

const initial = (): OverlaySnapshot => ({ news: [], economicEvents: [], filter: "all", visible: false, providerState: "idle", revision: 0 });
export class NewsCalendarOverlayStore {
  private state = initial(); private listeners = new Set<() => void>(); private seenEventIds = new Set<string>(); private sequences = new Map<string, number>();
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  getSnapshot = () => this.state;
  private emit(patch: Partial<OverlaySnapshot>) { this.state = { ...this.state, ...patch, revision: this.state.revision + 1 }; this.listeners.forEach((listener) => listener()); }
  setVisible(visible: boolean) { this.emit({ visible }); }
  setLoading() { this.emit({ providerState: "loading" }); }
  setUnavailable() { this.emit({ providerState: "unavailable", news: [], economicEvents: [] }); }
  setFilter(filter: OverlayFilter) { this.emit({ filter }); }
  replaceNews(news: readonly NewsArticle[]) { this.emit({ news: this.dedupeNews(news), providerState: "available" }); }
  replaceEconomic(events: readonly EconomicEvent[]) { this.emit({ economicEvents: this.dedupeEconomic(events), providerState: "available" }); }
  applyRealtime(channel: string, event: Record<string, unknown>): boolean {
    const eventId = String(event.event_id || ""); const sequence = Number(event.sequence); if (!eventId || !Number.isFinite(sequence) || this.seenEventIds.has(eventId)) return false;
    if (sequence <= (this.sequences.get(channel) ?? -1)) return false;
    this.seenEventIds.add(eventId); this.sequences.set(channel, sequence); const data = (event.data || {}) as Record<string, unknown>; const type = String(event.event_type || "");
    if (type.startsWith("news.article.")) { const article = data as unknown as NewsArticle; const current = this.state.news.filter((item) => item.article_id !== article.article_id); this.replaceNews(type.endsWith("retracted") ? current : [article, ...current]); return true; }
    if (type.startsWith("economic.")) { const item = data as unknown as EconomicEvent; const current = this.state.economicEvents.filter((eventItem) => eventItem.event_id !== item.event_id); this.replaceEconomic(type.endsWith("cancelled") ? current : [item, ...current]); return true; }
    return false;
  }
  markersFor(instrumentId: string): OverlayMarker[] {
    if (!this.state.visible) return []; const high = this.state.filter === "high"; const allowNews = !["economic"].includes(this.state.filter); const allowEconomic = !["news"].includes(this.state.filter);
    const news = allowNews ? this.state.news.filter((item) => item.affected_instruments.includes(instrumentId) && (!high || item.importance === "HIGH")).map((item): OverlayMarker => ({ id: `news-${item.article_id}`, kind: "news", time: item.published_at, importance: item.importance, title: item.headline, source: item.publisher || item.provider_id, instrumentIds: item.affected_instruments, detail: item.summary || "" })) : [];
    const economic = allowEconomic ? this.state.economicEvents.filter((item) => item.affected_instruments.includes(instrumentId) && (!high || item.importance === "HIGH") && item.status !== "CANCELLED").map((item): OverlayMarker => ({ id: `economic-${item.event_id}`, kind: "economic", time: item.scheduled_at, importance: item.importance, title: item.title, source: item.provider_id, instrumentIds: item.affected_instruments, detail: `Actual ${item.actual_value || "—"} · Forecast ${item.forecast_value || "—"} · Previous ${item.previous_value || "—"}` })) : [];
    return [...news, ...economic];
  }
  private dedupeNews(items: readonly NewsArticle[]) { const provider = new Set<string>(); const urls = new Set<string>(); return items.filter((item) => { const key = `${item.provider_id}:${item.provider_article_id}`; if (provider.has(key) || (item.canonical_url && urls.has(item.canonical_url))) return false; provider.add(key); if (item.canonical_url) urls.add(item.canonical_url); return item.status !== "RETRACTED"; }).map((item) => ({ ...item, affected_instruments: [...item.affected_instruments] })); }
  private dedupeEconomic(items: readonly EconomicEvent[]) { const ids = new Set<string>(); return items.filter((item) => !ids.has(item.event_id) && (ids.add(item.event_id) || true)).map((item) => ({ ...item, affected_instruments: [...item.affected_instruments] })); }
}
