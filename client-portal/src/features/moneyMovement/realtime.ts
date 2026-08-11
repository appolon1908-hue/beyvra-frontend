import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getUnifiedRealtimeClient, UnifiedRealtimeMessage } from "realtime/UnifiedRealtimeClient";
import { FinancialRealtimeTopic, FINANCIAL_REALTIME_TOPICS, subscribeFinancialProjection } from "realtime/FinancialRealtimeProjection";

export type FinancialNotification = { title: string; message: string; severity: "info" | "warning" | "success" };

export function notificationForFinancialEvent(message: UnifiedRealtimeMessage): FinancialNotification | undefined {
  const event = (message.data ?? message.payload ?? message) as Record<string, unknown>;
  const type = String(message.type || event.event_type || "");
  const state = String(event.state || "");
  if (type === "deposit.updated.v1" && state === "DETECTED") return { title: "Deposit detected", message: "A deposit was detected and is awaiting required processing.", severity: "info" };
  if (type === "deposit.updated.v1" && state === "CREDITED") return { title: "Deposit credited", message: "Your Beyvra deposit is credited.", severity: "success" };
  if (type === "withdrawal.updated.v1" && ["PENDING_COMPLIANCE", "PENDING_APPROVAL"].includes(state)) return { title: "Withdrawal under review", message: "Your withdrawal requires review before it can continue.", severity: "warning" };
  if (type === "withdrawal.updated.v1" && state === "COMPLETED") return { title: "Withdrawal completed", message: "Your withdrawal is complete.", severity: "success" };
  if (type === "withdrawal.updated.v1" && ["FAILED", "REJECTED", "REVERSED"].includes(state)) return { title: "Withdrawal update", message: "Your withdrawal could not be completed. Contact support if you need help.", severity: "warning" };
  if (type === "transfer.updated.v1" && state) return { title: "Transfer update", message: `Your transfer status is ${state.toLowerCase().split("_").join(" ")}.`, severity: state === "COMPLETED" ? "success" : "info" };
  if (type === "compliance.requirement.updated.v1") return { title: "Security requirement updated", message: "Review your Beyvra account requirements before continuing.", severity: "warning" };
  return undefined;
}

export function useFinancialRealtime({ enabled, token, sessionUserId, wsTicket }: {
  enabled: boolean; token?: string; sessionUserId?: number; wsTicket?: string | null;
}) {
  const queryClient = useQueryClient();
  const [notice, setNotice] = useState<FinancialNotification>();
  useEffect(() => {
    if (!enabled || !token || !wsTicket || !Number.isSafeInteger(sessionUserId) || Number(sessionUserId) < 1) return;
    const client = getUnifiedRealtimeClient(token, async () => wsTicket);
    const unsubscribers = (Object.keys(FINANCIAL_REALTIME_TOPICS) as FinancialRealtimeTopic[]).map((topic) =>
      subscribeFinancialProjection(client, topic, Number(sessionUserId), token, (message) => {
        const notification = notificationForFinancialEvent({ ...message, type: message.type || topic });
        if (notification) setNotice(notification);
        void queryClient.invalidateQueries({ queryKey: ["financial"] });
      }),
    );
    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [enabled, queryClient, sessionUserId, token, wsTicket]);
  return { notice, dismiss: () => setNotice(undefined) };
}
