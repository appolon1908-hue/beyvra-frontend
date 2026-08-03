import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints, socketEndpoints } from "api/endpoints";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";
import { getSocketUrl } from "utils/env";

export type NotificationEvent = {
  id: string;
  title: string;
  message: string;
  category: string;
  payload: Record<string, unknown>;
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
  return useQuery({
    queryKey: notificationInboxKey,
    queryFn: async () => {
      const response = await authenticatedRequest<InboxResponse>(apiEndpoints.notifications.inbox, token!);
      return Array.isArray(response) ? response : response.results;
    },
    enabled: Boolean(token),
    refetchInterval: 30_000,
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
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<number | null>(null);
  const attempt = useRef(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;
    let stopped = false;

    const connect = async () => {
      if (stopped || socketRef.current) return;
      try {
        const { ws_ticket } = await webSocketTicketFetcher(token);
        if (stopped) return;
        const socket = new WebSocket(getSocketUrl(socketEndpoints.users, { ws_ticket }));
        socketRef.current = socket;
        socket.onopen = () => {
          attempt.current = 0;
          setConnected(true);
        };
        socket.onmessage = () => {
          client.invalidateQueries({ queryKey: notificationInboxKey });
        };
        socket.onclose = () => {
          socketRef.current = null;
          setConnected(false);
          if (!stopped) {
            const delay = Math.min(1_000 * 2 ** attempt.current++, 30_000);
            reconnectTimer.current = window.setTimeout(connect, delay);
          }
        };
        socket.onerror = () => socket.close();
      } catch {
        if (!stopped) {
          const delay = Math.min(1_000 * 2 ** attempt.current++, 30_000);
          reconnectTimer.current = window.setTimeout(connect, delay);
        }
      }
    };

    connect();
    return () => {
      stopped = true;
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [client, token]);

  return connected;
}
