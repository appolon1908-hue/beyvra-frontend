import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";
import { getUnifiedRealtimeClient } from "realtime/UnifiedRealtimeClient";

export type AccountState = "PENDING" | "ACTIVE" | "RESTRICTED" | "SUSPENDED" | "CLOSED";
export type KycState = "NOT_STARTED" | "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "EXPIRED" | "REQUIRES_UPDATE";
export type AmlState = "NOT_SCREENED" | "PENDING" | "CLEARED" | "REVIEW_REQUIRED" | "BLOCKED";
export type SanctionsState = "NOT_CHECKED" | "CLEAR" | "POSSIBLE_MATCH" | "CONFIRMED_MATCH" | "MANUAL_REVIEW";
export type JurisdictionState = "SUPPORTED" | "LIMITED" | "RESTRICTED" | "UNKNOWN";
export interface ComplianceProfile { account_state: AccountState; kyc_state: KycState; aml_state: AmlState; sanctions_state: SanctionsState; jurisdiction_state: JurisdictionState; restrictions: Array<{ restriction_id: string; type: string; reason_code: string; expires_at: string | null }>; requirements: string[]; last_updated: string; }
export interface ComplianceRequirement { requirement_id: string; type: string; status: string; required: boolean; deadline: string | null; user_action: string; }

export const complianceChannels = (userId: string) => [
  `compliance.profile.updated.v1.${userId}`,
  `compliance.requirement.updated.v1.${userId}`,
  `compliance.restriction.updated.v1.${userId}`,
];

const tokenUserId = (token: string): string | undefined => {
  try {
    const segment = token.split(".")[1];
    if (!segment) return undefined;
    const payload = JSON.parse(window.atob(segment.replace(/-/g, "+").replace(/_/g, "/"))) as Record<string, unknown>;
    const value = payload.user_id ?? payload.sub;
    return typeof value === "string" || typeof value === "number" ? String(value) : undefined;
  } catch { return undefined; }
};

export const complianceDisplayState = (profile: ComplianceProfile): "Verification required" | "Verification pending" | "Manual review" | "Restricted" | "Approved" | "Expired" => {
  if (profile.kyc_state === "EXPIRED" || profile.kyc_state === "REQUIRES_UPDATE") return "Expired";
  if (profile.account_state === "RESTRICTED" || profile.account_state === "SUSPENDED" || profile.account_state === "CLOSED" || profile.aml_state === "BLOCKED" || profile.sanctions_state === "CONFIRMED_MATCH") return "Restricted";
  if (profile.kyc_state === "IN_REVIEW" || profile.aml_state === "REVIEW_REQUIRED" || profile.sanctions_state === "POSSIBLE_MATCH" || profile.sanctions_state === "MANUAL_REVIEW") return "Manual review";
  if (profile.kyc_state === "PENDING") return "Verification pending";
  if (profile.kyc_state === "APPROVED" && profile.aml_state === "CLEARED" && profile.sanctions_state === "CLEAR" && profile.jurisdiction_state === "SUPPORTED" && profile.account_state === "ACTIVE") return "Approved";
  return "Verification required";
};

export function useComplianceProfile(token?: string) { return useQuery({ queryKey:["compliance-profile"], queryFn:()=>authenticatedRequest<ComplianceProfile>(apiEndpoints.compliance.profile,token!), enabled:Boolean(token), staleTime:15_000 }); }
export function useComplianceRequirements(token?: string) { return useQuery({ queryKey:["compliance-requirements"], queryFn:()=>authenticatedRequest<{results:ComplianceRequirement[]}>(apiEndpoints.compliance.requirements,token!), enabled:Boolean(token), staleTime:15_000 }); }
export function useComplianceRealtime(token?: string) {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!token) return;
    const userId = tokenUserId(token);
    if (!userId) return;
    const realtime = getUnifiedRealtimeClient(token, async () => (await webSocketTicketFetcher(token)).ws_ticket);
    const refresh = async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["compliance-profile"] }),
        queryClient.invalidateQueries({ queryKey: ["compliance-requirements"] }),
      ]);
    };
    const unsubscribes = complianceChannels(userId).map((channel) => realtime.subscribe(channel, () => { void refresh(); }, async () => { await refresh(); }));
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [queryClient, token]);
}
