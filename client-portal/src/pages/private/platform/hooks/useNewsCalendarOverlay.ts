import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";
import { getUnifiedRealtimeClient, UnifiedRealtimeMessage } from "realtime/UnifiedRealtimeClient";
import { NewsCalendarOverlayStore } from "../chart/events/NewsCalendarOverlayStore";
import { EconomicEvent, NewsArticle } from "../chart/events/types";

export function useNewsCalendarOverlay(store: NewsCalendarOverlayStore, token: string | undefined, instrumentId: string, enabled: boolean) {
  const [message, setMessage] = useState(""); const generation = useRef(0); const requestedDetails = useRef(new Set<string>());
  const loadNews = useCallback(async () => {
    if (!enabled || !token) return; const current = ++generation.current; store.setLoading();
    try { const payload = await authenticatedRequest<{ results: NewsArticle[] }>(`${apiEndpoints.news.list}?instrument_id=${encodeURIComponent(instrumentId)}&limit=25`, token); if (current === generation.current) { store.replaceNews(payload.results); setMessage(""); } }
    catch (error) { if (current === generation.current) { store.setUnavailable(); setMessage(error instanceof ApiError && error.code === "PROVIDER_NOT_AVAILABLE" ? "News feed unavailable — provider approval pending." : "News feed unavailable."); } }
  }, [enabled, token, instrumentId, store]);
  const loadCalendar = useCallback(async () => {
    if (!enabled || !token) return; const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); const to = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    try { const payload = await authenticatedRequest<{ results: EconomicEvent[] }>(`${apiEndpoints.news.calendar}?instrument_id=${encodeURIComponent(instrumentId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, token); store.replaceEconomic(payload.results); }
    catch (error) { store.setUnavailable(); setMessage(error instanceof ApiError && error.code === "PROVIDER_NOT_AVAILABLE" ? "Economic calendar unavailable — provider approval pending." : "Economic calendar unavailable."); }
  }, [enabled, token, instrumentId, store]);
  const loadNewsDetail = useCallback(async (articleId: string) => {
    if (!enabled || !token || requestedDetails.current.has(articleId)) return; requestedDetails.current.add(articleId);
    try { store.mergeNewsDetail(await authenticatedRequest<NewsArticle>(apiEndpoints.news.detail(articleId), token)); }
    catch (error) { setMessage(error instanceof ApiError && error.code === "PROVIDER_NOT_AVAILABLE" ? "News unavailable — provider approval pending." : "News details unavailable."); }
  }, [enabled, token, store]);
  useEffect(() => { if (enabled) void loadNews(); else { generation.current += 1; setMessage(""); } }, [enabled, loadNews]);
  useEffect(() => {
    if (!enabled || !token) return; const client = getUnifiedRealtimeClient(token, async () => (await webSocketTicketFetcher(token)).ws_ticket); const receive = (event: UnifiedRealtimeMessage) => store.applyRealtime(String(event.channel || ""), event);
    const stops = ["news.market", `news.instrument:${instrumentId}`, "economic-calendar"].map((channel) => client.subscribe(channel, receive)); return () => stops.forEach((stop) => stop());
  }, [enabled, token, instrumentId, store]);
  return { message, loadCalendar, loadNewsDetail };
}
