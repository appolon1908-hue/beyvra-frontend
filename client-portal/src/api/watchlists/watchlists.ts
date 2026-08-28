import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import type { PaginatedResponse } from "api/types";

export interface WatchlistItem {
  item_id: string;
  instrument: string;
  position: number;
}

export interface Watchlist {
  id: string;
  name: string;
  /** Used as If-Match for updates so concurrent tabs cannot silently overwrite each other. */
  version: number;
  items: WatchlistItem[];
  created_at: string;
  updated_at: string;
}

export interface WatchlistUpdateRequest {
  name?: string;
  expected_version: number;
}

export type AlertCondition = "PRICE_ABOVE" | "PRICE_BELOW" | "PERCENT_CHANGE";

export interface Alert {
  id: string;
  instrument: string;
  condition: AlertCondition;
  threshold: string;
  active: boolean;
  created_at: string;
}

export interface AlertRequest {
  instrument: string;
  condition: AlertCondition;
  threshold: string;
}

export interface AlertHistoryEntry {
  alert_id: string;
  instrument: string;
  condition: AlertCondition;
  threshold: string;
  triggered_value: string;
  triggered_at: string;
}

function ifMatch(expectedVersion: number): HeadersInit {
  return { "If-Match": String(expectedVersion) };
}

export function listWatchlists(token: string): Promise<PaginatedResponse<Watchlist>> {
  return authenticatedRequest<PaginatedResponse<Watchlist>>(apiEndpoints.watchlists.list, token);
}

export function createWatchlist(token: string, name: string): Promise<Watchlist> {
  return authenticatedRequest<Watchlist>(apiEndpoints.watchlists.create, token, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function updateWatchlist(token: string, watchlistId: string, request: WatchlistUpdateRequest): Promise<Watchlist> {
  return authenticatedRequest<Watchlist>(apiEndpoints.watchlists.update(watchlistId), token, {
    method: "PATCH",
    headers: ifMatch(request.expected_version),
    body: JSON.stringify(request),
  });
}

export function deleteWatchlist(token: string, watchlistId: string, expectedVersion: number): Promise<void> {
  return authenticatedRequest<void>(apiEndpoints.watchlists.remove(watchlistId), token, {
    method: "DELETE",
    headers: ifMatch(expectedVersion),
  });
}

export function addWatchlistItem(token: string, watchlistId: string, instrument: string): Promise<Watchlist> {
  return authenticatedRequest<Watchlist>(apiEndpoints.watchlists.items(watchlistId), token, {
    method: "POST",
    body: JSON.stringify({ instrument }),
  });
}

export function removeWatchlistItem(
  token: string,
  watchlistId: string,
  itemId: string,
  expectedVersion: number,
): Promise<void> {
  return authenticatedRequest<void>(apiEndpoints.watchlists.removeItem(watchlistId, itemId), token, {
    method: "DELETE",
    headers: ifMatch(expectedVersion),
  });
}

export function reorderWatchlistItems(
  token: string,
  watchlistId: string,
  orderedItemIds: string[],
  expectedVersion: number,
): Promise<Watchlist> {
  return authenticatedRequest<Watchlist>(apiEndpoints.watchlists.reorderItems(watchlistId), token, {
    method: "PATCH",
    headers: ifMatch(expectedVersion),
    body: JSON.stringify({ item_ids: orderedItemIds }),
  });
}

export function listAlerts(token: string): Promise<PaginatedResponse<Alert>> {
  return authenticatedRequest<PaginatedResponse<Alert>>(apiEndpoints.alerts.list, token);
}

export function createAlert(token: string, request: AlertRequest): Promise<Alert> {
  return authenticatedRequest<Alert>(apiEndpoints.alerts.create, token, {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function updateAlert(token: string, alertId: string, request: Partial<AlertRequest & { active: boolean }>): Promise<Alert> {
  return authenticatedRequest<Alert>(apiEndpoints.alerts.update(alertId), token, {
    method: "PATCH",
    body: JSON.stringify(request),
  });
}

export function deleteAlert(token: string, alertId: string): Promise<void> {
  return authenticatedRequest<void>(apiEndpoints.alerts.remove(alertId), token, { method: "DELETE" });
}

export function getAlertHistory(token: string, cursor?: string): Promise<PaginatedResponse<AlertHistoryEntry>> {
  const endpoint = cursor ? `${apiEndpoints.alerts.history}?cursor=${encodeURIComponent(cursor)}` : apiEndpoints.alerts.history;
  return authenticatedRequest<PaginatedResponse<AlertHistoryEntry>>(endpoint, token);
}
