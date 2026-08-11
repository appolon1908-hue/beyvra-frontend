import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

type Page<T> = { count: number; results: T[] };
export type ControlState = {
  safety_flags: Record<string, boolean>;
  trading: { simulation: boolean; emergency_halt: null | { halt_id: string; reason: string; activated_at: string } };
  providers: Record<string, "DISABLED">;
  support_impersonation: boolean;
};
export type IncidentState = Record<string, Record<string, number>>;
export type OperatorCase = { case_id: string; status: string; risk_level?: string; category?: string; safe_summary?: string };
export type AuditRow = { audit_id: string; action: string; target: string; timestamp: string; role: string };
export type AccountSummary = {
  account_ref: string;
  account_state: string;
  verification_summary: Record<string, string | boolean>;
  active_restriction: null | { level: string; reason_code: string; created_at: string };
  recent_security_events: Array<{ event_type: string; risk_level: string; occurred_at: string; resolved: boolean }>;
  simulation_history_counts: Array<{ type: string; count: number }>;
  open_support_cases: number;
};

const tenantHeaders = (tenant: string) => ({ "X-Beyvra-Tenant": tenant.trim().toLowerCase() });

export function useOperatorControlPlane(token: string | undefined, tenant: string) {
  const enabled = Boolean(token && tenant.trim());
  const request = <T,>(endpoint: string) => authenticatedRequest<T>(endpoint, token!, { headers: tenantHeaders(tenant) });
  const control = useQuery({ queryKey: ["operator-control", tenant], enabled, queryFn: () => request<ControlState>(apiEndpoints.operations.operatorControlState) });
  const incidents = useQuery({ queryKey: ["operator-incidents", tenant], enabled, queryFn: () => request<IncidentState>(apiEndpoints.operations.operatorIncidents) });
  const fraudCases = useQuery({ queryKey: ["operator-fraud", tenant], enabled, queryFn: () => request<Page<OperatorCase>>(apiEndpoints.operations.operatorFraudCases) });
  const supportCases = useQuery({ queryKey: ["operator-support", tenant], enabled, queryFn: () => request<Page<OperatorCase>>(apiEndpoints.operations.operatorSupportCases) });
  const audit = useQuery({ queryKey: ["operator-audit", tenant], enabled, queryFn: () => request<AuditRow[]>(apiEndpoints.operations.operatorAudit) });
  return { control, incidents, fraudCases, supportCases, audit };
}

function useOperatorMutation<TInput, TResult>(token: string | undefined, tenant: string, endpoint: (input: TInput) => string, body: (input: TInput) => object | undefined, onSuccess?: () => void) {
  return useMutation({
    mutationFn: (input: TInput) => authenticatedRequest<TResult>(endpoint(input), token!, {
      method: "POST",
      headers: tenantHeaders(tenant),
      body: JSON.stringify(body(input) ?? {}),
    }),
    onSuccess,
  });
}

export function useOperatorActions(token: string | undefined, tenant: string) {
  const queryClient = useQueryClient();
  const refresh = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ["operator-control", tenant] }),
    queryClient.invalidateQueries({ queryKey: ["operator-incidents", tenant] }),
    queryClient.invalidateQueries({ queryKey: ["operator-audit", tenant] }),
  ]);
  const accountSummary = useMutation({ mutationFn: (accountId: string) => authenticatedRequest<AccountSummary>(apiEndpoints.operations.operatorAccountSummary(accountId), token!, { headers: tenantHeaders(tenant) }) });
  const freeze = useOperatorMutation<{ accountId: string; level: "PARTIAL" | "FULL"; reason_code: string }, { level: string }>(token, tenant, (input) => apiEndpoints.operations.operatorFreeze(input.accountId), (input) => ({ level: input.level, reason_code: input.reason_code }), refresh);
  const halt = useOperatorMutation<{ reason: string }, { halt_id: string; active: boolean }>(token, tenant, () => apiEndpoints.operations.operatorTradingHalt, (input) => input, refresh);
  const createAction = useOperatorMutation<{ action_type: string; target_ref: string; reason: string }, { request_id: string; status: string }>(token, tenant, () => apiEndpoints.operations.operatorActions, (input) => input, refresh);
  const approve = useOperatorMutation<string, { request_id: string; status: string }>(token, tenant, apiEndpoints.operations.operatorActionApprove, () => ({}), refresh);
  const execute = useOperatorMutation<string, { request_id: string; status: string }>(token, tenant, apiEndpoints.operations.operatorActionExecute, () => ({}), refresh);
  return { accountSummary, freeze, halt, createAction, approve, execute };
}
