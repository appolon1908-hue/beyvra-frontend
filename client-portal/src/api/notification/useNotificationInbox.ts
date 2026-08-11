import { useEffect, useState } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";
import { getUnifiedRealtimeClient } from "realtime/UnifiedRealtimeClient";

export type NotificationEvent = {
  id: string;
  title: string;
  message: string;
  category: string;
  payload: Record<string, unknown>;
  read: boolean;
  is_read: boolean;
  created_at: string;
};

type InboxResponse = NotificationEvent[] | {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: NotificationEvent[];
};

export const notificationInboxKey = ["notification-inbox"] as const;

export function useNotificationInbox(token?: string) {
  return useInfiniteQuery({
    queryKey: notificationInboxKey,
    initialPageParam: "",
    queryFn: async ({ pageParam }) => {
      const response = await authenticatedRequest<InboxResponse>(
        `${apiEndpoints.notifications.inbox}?limit=50${pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ""}`,
        token!,
      );
      if (Array.isArray(response)) {
        return { results: response, nextPage: undefined };
      }
      return { results: response.results, nextPage: response.next || undefined };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: Boolean(token),
    refetchInterval: false,
  });
}

export function useMarkNotificationRead(token?: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => authenticatedRequest(
      apiEndpoints.notifications.read(eventId), token!, { method: "POST" }
    ),
    onSuccess: () => client.invalidateQueries({ queryKey: notificationInboxKey }),
  });
}

export function useMarkAllNotificationsRead(token?: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => authenticatedRequest(
      apiEndpoints.notifications.readAll, token!, { method: "POST" }
    ),
    onSuccess: () => client.invalidateQueries({ queryKey: notificationInboxKey }),
  });
}

export function useNotificationSocket(token?: string) {
  const client = useQueryClient();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;
    const realtime = getUnifiedRealtimeClient(token, async () => (await webSocketTicketFetcher(token)).ws_ticket);
    const unsubscribe = realtime.subscribe("notification", (message) => {
      if (message.type === "system.status") setConnected((message.data as Record<string, unknown>)?.status === "connected");
      else {
        setConnected(true);
        void client.invalidateQueries({ queryKey: notificationInboxKey });
      }
    });
    return () => { unsubscribe(); setConnected(false); };
  }, [client, token]);

  return connected;
}
