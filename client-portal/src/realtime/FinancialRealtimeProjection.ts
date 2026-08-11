import { authenticatedRequest } from "api/client";
import { UnifiedRealtimeClient, UnifiedRealtimeMessage } from "./UnifiedRealtimeClient";

export const FINANCIAL_REALTIME_TOPICS = {
  "wallet.updated.v1": "v1/wallets/",
  "deposit.updated.v1": "v1/deposits/",
  "withdrawal.updated.v1": "v1/withdrawals/",
  "transfer.updated.v1": "v1/transfers/",
} as const;

export type FinancialRealtimeTopic = keyof typeof FINANCIAL_REALTIME_TOPICS;

type FinancialSnapshot = {
  sequence: number;
  version: number;
  [key: string]: unknown;
};

export function financialPrivateChannel(topic: FinancialRealtimeTopic, authenticatedUserId: number): string {
  if (!Number.isSafeInteger(authenticatedUserId) || authenticatedUserId < 1) throw new Error("INVALID_AUTHENTICATED_SUBJECT");
  return `${topic}:${authenticatedUserId}`;
}

export function subscribeFinancialProjection(
  client: UnifiedRealtimeClient,
  topic: FinancialRealtimeTopic,
  authenticatedUserId: number,
  identityToken: string,
  listener: (message: UnifiedRealtimeMessage) => void,
): () => void {
  const channel = financialPrivateChannel(topic, authenticatedUserId);
  const endpoint = FINANCIAL_REALTIME_TOPICS[topic];
  const recover = async (): Promise<UnifiedRealtimeMessage> => {
    const snapshot = await authenticatedRequest<FinancialSnapshot>(endpoint, identityToken);
    if (!Number.isSafeInteger(snapshot.sequence) || snapshot.sequence < 0) throw new Error("INVALID_FINANCIAL_SNAPSHOT");
    return { type: "snapshot.recovered", sequence: snapshot.sequence, data: snapshot };
  };
  return client.subscribe(channel, listener, recover);
}
