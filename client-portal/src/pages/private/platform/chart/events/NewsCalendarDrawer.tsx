import { EconomicEvent, NewsArticle, OverlayFilter, OverlaySnapshot } from "./types";

export function NewsCalendarDrawer({ state, message, close, setFilter, loadCalendar }: { state: OverlaySnapshot; message: string; close: () => void; setFilter: (filter: OverlayFilter) => void; loadCalendar: () => void }) {
  const news = state.news.filter((item: NewsArticle) => state.filter !== "high" || item.importance === "HIGH"); const events = state.economicEvents.filter((item: EconomicEvent) => state.filter !== "high" || item.importance === "HIGH");
  return <aside className="news-calendar-drawer" aria-label="News and economic calendar"><header><strong>Market events</strong><button type="button" onClick={close} aria-label="Close market events">×</button></header>
    <div className="event-filters">{(["all", "high", "news", "economic"] as OverlayFilter[]).map((filter) => <button type="button" key={filter} aria-pressed={state.filter === filter} onClick={() => setFilter(filter)}>{filter === "high" ? "High impact" : filter}</button>)}</div>
    <button type="button" onClick={loadCalendar}>Load economic calendar</button>{message && <p role="status">{message}</p>}
    {(state.filter === "all" || state.filter === "high" || state.filter === "news") && news.map((item) => <article key={item.article_id}><b>N · {item.importance}</b><strong>{item.headline}</strong><small>{item.publisher || item.provider_id} · {new Date(item.published_at).toLocaleString()}</small></article>)}
    {(state.filter === "all" || state.filter === "high" || state.filter === "economic") && events.map((item) => <article key={item.event_id}><b>E · {item.importance}</b><strong>{item.title}</strong><small>{new Date(item.scheduled_at).toLocaleString()} · Actual {item.actual_value || "—"} / Forecast {item.forecast_value || "—"}</small></article>)}
    {!message && !news.length && !events.length && state.providerState !== "loading" && <p>No provider events available.</p>}
  </aside>;
}
