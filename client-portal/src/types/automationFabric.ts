export const AUTOMATION_OPERATION_STATUSES = [
  'accepted',
  'queued',
  'running',
  'waiting_approval',
  'submitted',
  'unknown',
  'reconciling',
  'reconciled_success',
  'reconciled_failure',
  'rejected',
  'cancelled',
] as const;

export type AutomationOperationStatus =
  (typeof AUTOMATION_OPERATION_STATUSES)[number];

export const AUTOMATION_OPERATION_TYPES = [
  'onboarding.case.create',
  'compliance.reminder.request',
  'support.escalation.create',
  'security.alert.create',
  'report.request.create',
  'notification.request',
  'crm.projection.request',
  'webhook.reconciliation.request',
  'operation.status.read',
] as const;

export type AutomationOperationType =
  (typeof AUTOMATION_OPERATION_TYPES)[number];

export const AUTOMATION_INTENTS = [
  'onboarding_assistance',
  'compliance_reminder',
  'support_escalation',
  'report_request',
  'alert_acknowledgement',
  'notification_preferences',
  'cancel_before_submission',
] as const;

export type AutomationIntent = (typeof AUTOMATION_INTENTS)[number];

export interface AutomationOperationProjection {
  operation_id: string;
  operation_type: AutomationOperationType;
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

const AUTOMATION_OPERATION_TYPE_SET = new Set<string>(
  AUTOMATION_OPERATION_TYPES,
);
const AUTOMATION_OPERATION_STATUS_SET = new Set<string>(
  AUTOMATION_OPERATION_STATUSES,
);
const FORBIDDEN_AUTOMATION_PROJECTION_FIELDS = [
  'access_token',
  'refresh_token',
  'id_token',
  'client_secret',
  'provider_secret',
  'machine_token',
  'raw_execution',
  'raw_webhook',
  'stack_trace',
  'lease_token',
  'internal_route',
] as const;

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const isAutomationOperationType = (
  value: unknown,
): value is AutomationOperationType =>
  typeof value === 'string' && AUTOMATION_OPERATION_TYPE_SET.has(value);

export const isAutomationOperationStatus = (
  value: unknown,
): value is AutomationOperationStatus =>
  typeof value === 'string' && AUTOMATION_OPERATION_STATUS_SET.has(value);

export const decodeAutomationOperationProjection = (
  value: unknown,
): AutomationOperationProjection => {
  if (!isRecord(value)) {
    throw new TypeError('INVALID_AUTOMATION_OPERATION_PROJECTION');
  }

  if (
    FORBIDDEN_AUTOMATION_PROJECTION_FIELDS.some((field) => field in value)
  ) {
    throw new TypeError('FORBIDDEN_AUTOMATION_PROJECTION_FIELD');
  }

  const {
    operation_id: operationId,
    operation_type: operationType,
    status,
    created_at: createdAt,
    updated_at: updatedAt,
    summary,
    retryable,
    correlation_id: correlationId,
    next_action: nextAction,
  } = value;

  if (!isAutomationOperationType(operationType)) {
    throw new TypeError('UNSUPPORTED_AUTOMATION_OPERATION_TYPE');
  }

  if (!isAutomationOperationStatus(status)) {
    throw new TypeError('UNSUPPORTED_AUTOMATION_OPERATION_STATUS');
  }

  if (
    !isNonEmptyString(operationId) ||
    !isNonEmptyString(createdAt) ||
    !isNonEmptyString(updatedAt) ||
    typeof summary !== 'string' ||
    typeof retryable !== 'boolean' ||
    !isNonEmptyString(correlationId) ||
    (nextAction !== undefined &&
      nextAction !== null &&
      typeof nextAction !== 'string')
  ) {
    throw new TypeError('INVALID_AUTOMATION_OPERATION_PROJECTION');
  }

  return {
    operation_id: operationId,
    operation_type: operationType,
    status,
    created_at: createdAt,
    updated_at: updatedAt,
    summary,
    retryable,
    correlation_id: correlationId,
    ...(nextAction !== undefined ? { next_action: nextAction } : {}),
  };
};

export const isReconciledAutomationSuccess = (
  operation: AutomationOperationProjection,
): boolean => operation.status === 'reconciled_success';
