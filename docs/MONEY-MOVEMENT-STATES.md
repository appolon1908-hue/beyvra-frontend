# Money movement states

Frontend state unions are defined in `src/features/moneyMovement/types.ts` and validated by component tests.

- Deposit: `CREATED`, `AWAITING_FUNDING`, `DETECTED`, `PENDING_CONFIRMATION`, `COMPLIANCE_REVIEW`, `CREDIT_PENDING`, `CREDITED`, `FAILED`, `CANCELLED`, `REVERSED`.
- Withdrawal: `CREATED`, `PENDING_VALIDATION`, `PENDING_COMPLIANCE`, `PENDING_APPROVAL`, `APPROVED`, `QUEUED`, `SUBMITTED`, `PENDING_CONFIRMATION`, `COMPLETED`, `REJECTED`, `CANCELLED`, `FAILED`, `REVERSED`.
- Transfer: `CREATED`, `VALIDATING`, `PENDING`, `COMPLETED`, `FAILED`, `CANCELLED`.
- Destination: `PENDING`, `VERIFIED`, `LOCKED`, `REVOKED`.

Money Activity combines canonical deposit, withdrawal, and transfer REST history and supports `FEE` and `SETTLEMENT` types when Beyvra later supplies them. It displays safe status, amount, asset, network, fee, timestamps, masked destination, and harmless reference. No provider identifier is part of the model.

Private `/ws/v2/` projection topics are `wallet.updated.v1`, `deposit.updated.v1`, `withdrawal.updated.v1`, `transfer.updated.v1`, and `compliance.requirement.updated.v1`. Sequence gaps trigger a canonical REST snapshot replacement before streaming resumes. Duplicate/stale messages are ignored.
