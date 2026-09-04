import { describe, expect, it } from 'vitest';

import {
  decodeAutomationOperationProjection,
  type AutomationOperationProjection,
} from './automationFabric';

const validProjection: AutomationOperationProjection = {
  operation_id: 'op-123',
  operation_type: 'onboarding.case.create',
  status: 'reconciled_success',
  created_at: '2026-09-04T20:00:00Z',
  updated_at: '2026-09-04T20:01:00Z',
  summary: 'Onboarding assistance reconciled.',
  retryable: false,
  correlation_id: 'corr-123',
  next_action: null,
};

describe('decodeAutomationOperationProjection', () => {
  it('accepts and returns an exact allowlisted non-financial projection', () => {
    expect(decodeAutomationOperationProjection(validProjection)).toEqual(
      validProjection,
    );
  });

  it.each(['trade', 'order.create', 'wallet.transfer', 'provider.execute'])(
    'rejects prohibited or unknown operation type %s',
    (operationType) => {
      expect(() =>
        decodeAutomationOperationProjection({
          ...validProjection,
          operation_type: operationType,
        }),
      ).toThrowError('UNSUPPORTED_AUTOMATION_OPERATION_TYPE');
    },
  );

  it('rejects a projection that carries forbidden credentials', () => {
    expect(() =>
      decodeAutomationOperationProjection({
        ...validProjection,
        access_token: 'must-never-reach-the-browser',
      }),
    ).toThrowError('FORBIDDEN_AUTOMATION_PROJECTION_FIELD');
  });

  it('rejects an unknown lifecycle state', () => {
    expect(() =>
      decodeAutomationOperationProjection({
        ...validProjection,
        status: 'completed',
      }),
    ).toThrowError('UNSUPPORTED_AUTOMATION_OPERATION_STATUS');
  });
});
