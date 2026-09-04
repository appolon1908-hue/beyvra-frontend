export type AutomationOperationStatus =
  | 'accepted'
  | 'queued'
  | 'running'
  | 'waiting_approval'
  | 'submitted'
  | 'unknown'
  | 'reconciling'
  | 'reconciled_success'
  | 'reconciled_failure'
  | 'rejected'
  | 'cancelled';

export type AutomationIntent =
  | 'onboarding_assistance'
  | 'compliance_reminder'
  | 'support_escalation'
  | 'report_request'
  | 'alert_acknowledgement'
  | 'notification_preferences'
  | 'cancel_before_submission';

export interface AutomationOperationProjection {
  operation_id: string;
  operation_type: string;
  status: AutomationOperationStatus;
  created_at: string;
  updated_at: string;
  summary: string;
  retryable: boolean;
  correlation_id: string;
  next_action?: string | null;
}

export interface AutomationIntentRequest {
  intent: AutomationIntent;
  resource_id?: string;
  reason?: string;
  idempotency_key: string;
}

export const isReconciledAutomationSuccess = (
  operation: AutomationOperationProjection,
): boolean => operation.status === 'reconciled_success';
