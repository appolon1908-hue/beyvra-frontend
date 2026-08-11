import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

type Page<T> = { count: number; next: string | null; previous: string | null; results: T[] };
export type SupportCase = { case_id: string; category: string; priority: string; status: string; safe_summary: string; created_at: string };
export type Session = { session_id: string; created_at: string; last_seen_at: string; expires_at: string; auth_strength: string; mfa_verified_at: string | null };
export type Transaction = { entry_id: string; type: string; asset: string; amount: string; fee: string; status: string; occurred_at: string; simulation: boolean };
export type SafetyFlags = Record<"REAL_WALLET_READ_ENABLED" | "REAL_DEPOSITS_ENABLED" | "REAL_WITHDRAWALS_ENABLED" | "REAL_INTERNAL_TRANSFERS_ENABLED" | "REAL_TRADING_ENABLED" | "EXTERNAL_EXECUTION_ENABLED" | "REAL_MONEY_ENABLED", boolean>;

export function useOperationalControlPlane() {
  const [cookies] = useCookies(["access_token"]);
  const token = cookies.access_token as string | undefined;
  const enabled = Boolean(token);
  const cases = useQuery({ queryKey: ["support-cases"], enabled, queryFn: () => authenticatedRequest<Page<SupportCase>>(apiEndpoints.operations.supportCases, token!) });
  const sessions = useQuery({ queryKey: ["security-sessions"], enabled, queryFn: () => authenticatedRequest<Session[]>(apiEndpoints.operations.sessions, token!) });
  const transactions = useQuery({ queryKey: ["operational-transactions"], enabled, queryFn: () => authenticatedRequest<Page<Transaction>>(apiEndpoints.operations.transactions, token!) });
  return { cases, sessions, transactions, token };
}

export function useRevokeSession(token?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => authenticatedRequest(apiEndpoints.operations.revokeSession(sessionId), token!, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["security-sessions"] }),
  });
}
