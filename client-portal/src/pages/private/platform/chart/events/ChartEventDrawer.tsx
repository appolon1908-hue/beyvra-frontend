import { useEffect, useRef } from "react";
import { EconomicEvent, NewsArticle, OverlayEventType, OverlayFilter, OverlaySnapshot } from "./types";

type Props = { state: OverlaySnapshot; selectedEvents: Array<NewsArticle | EconomicEvent>; message: string; modal: boolean; close: () => void; setFilter: (filter: OverlayFilter) => void; select: (id: string, type: OverlayEventType) => void; loadCalendar: () => void };
const filters: Array<[OverlayFilter, string]> = [["all", "All"], ["trades", "Trades"], ["news", "News"], ["economic", "Economic"], ["high", "High impact"]];
const formatTime = (value?: string | null) => value ? new Date(value).toLocaleString(undefined, { timeZone: "UTC", timeZoneName: "short" }) : "—";

function NewsDetail({ article }: { article: NewsArticle }) {
  return <article className="chart-event-detail"><b>{article.importance} • NEWS</b><h3>{article.headline}</h3><small>{article.publisher || article.provider_id} · {formatTime(article.published_at)}</small>
    {article.updated_at && <small>Updated {formatTime(article.updated_at)}</small>}<p>{article.summary || "No licensed summary is available."}</p>
    <dl><dt>Status</dt><dd>{article.status}</dd><dt>Affected</dt><dd>{article.affected_instruments.join(", ") || "—"}</dd></dl>
    {article.canonical_url && <a href={article.canonical_url} target="_blank" rel="noopener noreferrer">View source →</a>}
  </article>;
}

function EconomicDetail({ event }: { event: EconomicEvent }) {
  return <article className="chart-event-detail"><b>{event.importance} • ECONOMIC EVENT</b><h3>{event.title}</h3><small>{[event.country, event.currency].filter(Boolean).join(" · ") || event.provider_id}</small>
    <dl><dt>Scheduled</dt><dd>{formatTime(event.scheduled_at)}</dd><dt>Actual time</dt><dd>{formatTime(event.actual_at)}</dd><dt>Previous</dt><dd>{event.previous_value || "—"} {event.unit || ""}</dd><dt>Forecast</dt><dd>{event.forecast_value || "—"} {event.unit || ""}</dd><dt>Actual</dt><dd>{event.actual_value || "—"} {event.unit || ""}</dd><dt>Affected</dt><dd>{event.affected_instruments.join(", ") || "—"}</dd><dt>Status</dt><dd>{event.status}</dd></dl>
  </article>;
}

export function ChartEventDrawer({ state, selectedEvents, message, modal, close, setFilter, select, loadCalendar }: Props) {
  const drawerRef = useRef<HTMLElement>(null); const headingRef = useRef<HTMLElement>(null);
  useEffect(() => { headingRef.current?.focus(); const keys = (event: KeyboardEvent) => { if (event.key === "Escape") close(); if (event.key !== "Tab" || !modal || !drawerRef.current) return; const focusable = [...drawerRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')]; if (!focusable.length) return; const first = focusable[0]; const last = focusable.at(-1)!; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }; document.addEventListener("keydown", keys); return () => document.removeEventListener("keydown", keys); }, [close, modal]);
  const news = state.news.filter((item) => state.importanceFilter !== "HIGH" || item.importance === "HIGH");
  const events = state.economicEvents.filter((item) => state.importanceFilter !== "HIGH" || item.importance === "HIGH");
  return <aside ref={drawerRef} className="chart-event-drawer" role="dialog" aria-modal={modal} aria-labelledby="chart-event-drawer-title"><header><strong ref={headingRef} tabIndex={-1} id="chart-event-drawer-title">Market events</strong><button type="button" onClick={close} aria-label="Close market events">×</button></header>
    <div className="event-filters" aria-label="Event filters">{filters.map(([filter, label]) => <button type="button" key={filter} aria-pressed={state.filter === filter} onClick={() => setFilter(filter)}>{label}</button>)}</div>
    {message && <p role="status">{message}</p>}
    {selectedEvents.length > 1 && <section aria-label="Events at this time"><h3>{selectedEvents.length} events</h3>{selectedEvents.map((item) => { const isNews = "article_id" in item; return <button className="chart-event-list-item" type="button" key={isNews ? item.article_id : item.event_id} onClick={() => select(isNews ? item.article_id : item.event_id, isNews ? "NEWS" : "ECONOMIC_EVENT")}><b>{isNews ? "N" : "E"} · {item.importance}</b><span>{isNews ? item.headline : item.title}</span></button>; })}</section>}
    {selectedEvents.length === 1 && ("article_id" in selectedEvents[0] ? <NewsDetail article={selectedEvents[0]} /> : <EconomicDetail event={selectedEvents[0]} />)}
    {!state.selectedEventId && <section className="chart-event-list" aria-label="Loaded market events">
      {(state.filter === "all" || state.filter === "high" || state.filter === "news") && news.map((item) => <button className="chart-event-list-item" type="button" key={item.article_id} onClick={() => select(item.article_id, "NEWS")}><b>N · {item.importance}</b><span>{item.headline}</span><small>{item.publisher || item.provider_id} · {formatTime(item.published_at)}</small></button>)}
      {(state.filter === "all" || state.filter === "high" || state.filter === "economic") && events.map((item) => <button className="chart-event-list-item" type="button" key={item.event_id} onClick={() => select(item.event_id, "ECONOMIC_EVENT")}><b>E · {item.importance}</b><span>{item.title}</span><small>{formatTime(item.scheduled_at)}</small></button>)}
      {state.filter === "trades" && <p>Trade markers remain visible on the chart. Use the Trades panel for execution details.</p>}
      <button type="button" onClick={loadCalendar}>Load economic calendar</button>
      {!message && !news.length && !events.length && state.providerState !== "loading" && <p>No provider events available.</p>}
    </section>}
  </aside>;
}
