import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

export type WebhookSubscription = {
  id: string;
  url: string;
  categories: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type WebhookDelivery = {
  id: string;
  event: { id: string; title: string; message: string; category: string; created_at: string };
  status: "P" | "S" | "F";
  attempts: number;
  response_code: number | null;
  last_error: string;
  delivered_at: string | null;
  created_at: string;
};

const key = ["notification-webhooks"] as const;

function unwrap<T>(value: T[] | { results?: T[] }): T[] {
  return Array.isArray(value) ? value : value.results ?? [];
}

export function useWebhooks(token?: string) {
  return useQuery({
    queryKey: key,
    queryFn: async () => unwrap(await authenticatedRequest<WebhookSubscription[] | { results?: WebhookSubscription[] }>(apiEndpoints.notifications.webhooks, token!)),
    enabled: Boolean(token),
  });
}

export function useCreateWebhook(token?: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (payload: { url: string; secret: string; categories: string[] }) =>
      authenticatedRequest<WebhookSubscription>(apiEndpoints.notifications.webhooks, token!, { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  });
}

export function useUpdateWebhook(token?: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string; url?: string; categories?: string[]; is_active?: boolean }) =>
      authenticatedRequest<WebhookSubscription>(apiEndpoints.notifications.webhook(id), token!, { method: "PATCH", body: JSON.stringify(payload) }),
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  });
}

export function useDeleteWebhook(token?: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => authenticatedRequest<void>(apiEndpoints.notifications.webhook(id), token!, { method: "DELETE" }),
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  });
}

export function useTestWebhook(token?: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => authenticatedRequest(apiEndpoints.notifications.webhookTest(id), token!, { method: "POST", body: JSON.stringify({}) }),
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  });
}

export function useWebhookDeliveries(token: string | undefined, id: string | undefined) {
  return useQuery({
    queryKey: [...key, id, "deliveries"],
    queryFn: async () => unwrap(await authenticatedRequest<WebhookDelivery[] | { results?: WebhookDelivery[] }>(apiEndpoints.notifications.webhookDeliveries(id!), token!)),
    enabled: Boolean(token && id),
  });
}
