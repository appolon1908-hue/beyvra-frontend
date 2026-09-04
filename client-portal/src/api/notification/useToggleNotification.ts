import {
  type UseMutationOptions,
  useMutation,
} from "@tanstack/react-query";

import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { BFF_SESSION_MARKER } from "security/bffSession";

export type NotificationTogglePayload = {
  notification_id: string;
  is_enabled: boolean;
};

export type NotificationToggleResponse = NotificationTogglePayload;

export type NotificationToggleVariables = {
  data: NotificationTogglePayload;
  /** Compatibility-only input. Authentication is always the BFF session. */
  token?: string;
};

export async function toggleSingleNotification(
  data: NotificationTogglePayload,
): Promise<NotificationToggleResponse> {
  return authenticatedRequest<NotificationToggleResponse>(
    apiEndpoints.notifications.toggle,
    BFF_SESSION_MARKER,
    {
      method: "PUT",
      cache: "no-store",
      body: JSON.stringify(data),
    },
  );
}

type UseNotificationProps = Omit<
  UseMutationOptions<
    NotificationToggleResponse,
    Error,
    NotificationToggleVariables
  >,
  "mutationFn"
>;

export const useNotificationToggle = (props: UseNotificationProps = {}) =>
  useMutation<NotificationToggleResponse, Error, NotificationToggleVariables>({
    ...props,
    mutationFn: ({ data }) => toggleSingleNotification(data),
  });

export default useNotificationToggle;
