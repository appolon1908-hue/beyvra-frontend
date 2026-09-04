import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { BFF_SESSION_MARKER } from "security/bffSession";

export type EmailPreferences = {
  account: boolean;
  security: boolean;
  trading: boolean;
  funds: boolean;
  statements: boolean;
  support: boolean;
  marketing: boolean;
  updated_at: string;
};

export type EditableEmailPreferences = Pick<
  EmailPreferences,
  "trading" | "funds" | "statements" | "support"
>;

export const emailPreferencesQueryKey = ["email-notification-preferences"] as const;

export function useEmailPreferences() {
  return useQuery({
    queryKey: emailPreferencesQueryKey,
    queryFn: () =>
      authenticatedRequest<EmailPreferences>(
        apiEndpoints.notifications.emailPreferences,
        BFF_SESSION_MARKER,
        { cache: "no-store" },
      ),
    retry: false,
  });
}

export function useUpdateEmailPreferences() {
  const queryClient = useQueryClient();

  return useMutation<EmailPreferences, Error, Partial<EditableEmailPreferences>>({
    mutationFn: (payload) =>
      authenticatedRequest<EmailPreferences>(
        apiEndpoints.notifications.emailPreferences,
        BFF_SESSION_MARKER,
        {
          method: "PATCH",
          cache: "no-store",
          body: JSON.stringify(payload),
        },
      ),
    onSuccess: (preferences) => {
      queryClient.setQueryData(emailPreferencesQueryKey, preferences);
    },
  });
}
