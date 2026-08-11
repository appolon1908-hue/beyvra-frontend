export type DecimalString = string;

export type FinancialFeatureSet = {
  realWalletReadEnabled: boolean;
  depositsEnabled: boolean;
  withdrawalsEnabled: boolean;
  internalTransfersEnabled: boolean;
  withdrawalPreviewEnabled: boolean;
  transferPreviewEnabled: boolean;
};

export const DISABLED_FINANCIAL_FEATURES: FinancialFeatureSet = Object.freeze({
  realWalletReadEnabled: false,
  depositsEnabled: false,
  withdrawalsEnabled: false,
  internalTransfersEnabled: false,
  withdrawalPreviewEnabled: false,
  transferPreviewEnabled: false,
});

export type WalletSnapshot = {
  wallet_id: string;
  account_ref: string;
  asset: string;
  total: DecimalString;
  available: DecimalString;
  reserved: DecimalString;
  pending: DecimalString;
  as_of: string;
  version: number;
  sequence?: number;
};

export const DEPOSIT_STATES = [
  "CREATED", "AWAITING_FUNDING", "DETECTED", "PENDING_CONFIRMATION",
  "COMPLIANCE_REVIEW", "CREDIT_PENDING", "CREDITED", "FAILED",
  "CANCELLED", "REVERSED",
] as const;
export type DepositState = typeof DEPOSIT_STATES[number];

export const WITHDRAWAL_STATES = [
  "CREATED", "PENDING_VALIDATION", "PENDING_COMPLIANCE", "PENDING_APPROVAL",
  "APPROVED", "QUEUED", "SUBMITTED", "PENDING_CONFIRMATION", "COMPLETED",
  "REJECTED", "CANCELLED", "FAILED", "REVERSED",
] as const;
export type WithdrawalState = typeof WITHDRAWAL_STATES[number];

export const TRANSFER_STATES = ["CREATED", "VALIDATING", "PENDING", "COMPLETED", "FAILED", "CANCELLED"] as const;
export type TransferState = typeof TRANSFER_STATES[number];

export type DestinationStatus = "PENDING" | "VERIFIED" | "LOCKED" | "REVOKED";
export type MoneyActivityType = "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "FEE" | "SETTLEMENT";

export type Deposit = {
  id: string;
  type?: "DEPOSIT";
  state: DepositState;
  amount: DecimalString;
  asset: string;
  network?: string;
  created_at: string;
  updated_at: string;
  reference?: string;
  sequence?: number;
};

export type Withdrawal = {
  id: string;
  type?: "WITHDRAWAL";
  state: WithdrawalState;
  amount: DecimalString;
  asset: string;
  network?: string;
  fee?: DecimalString;
  destination_masked?: string;
  destination_status?: DestinationStatus;
  created_at: string;
  updated_at: string;
  reference?: string;
  sequence?: number;
};

export type Transfer = {
  id: string;
  type?: "TRANSFER";
  state: TransferState;
  amount: DecimalString;
  asset: string;
  fee?: DecimalString;
  destination_masked?: string;
  created_at: string;
  updated_at: string;
  reference?: string;
  sequence?: number;
};

export type Paginated<T> = { results: T[]; count?: number; sequence?: number };

export type ComplianceRequirementCode =
  | "KYC_REQUIRED"
  | "COMPLIANCE_REVIEW_REQUIRED"
  | "JURISDICTION_RESTRICTED"
  | "STEP_UP_REQUIRED"
  | "DESTINATION_COOLDOWN";

export type ComplianceProfile = {
  status: "NOT_STARTED" | "PENDING" | "APPROVED" | "RESTRICTED";
  deposit_eligible: boolean;
  withdrawal_eligible: boolean;
  transfer_eligible: boolean;
};

export type ComplianceRequirement = {
  code: ComplianceRequirementCode;
  title?: string;
  detail?: string;
  action?: "VERIFY_IDENTITY" | "CONTACT_SUPPORT" | "REAUTHENTICATE" | "WAIT";
};

export type PreviewRequirements = {
  step_up_required?: boolean;
  compliance_review_required?: boolean;
  cooldown_until?: string;
};

export type FinancialLimits = {
  per_transaction?: DecimalString;
  daily_remaining?: DecimalString;
  weekly_remaining?: DecimalString;
};

export type MoneyMovementPreview = {
  eligible: boolean;
  estimated_fee: DecimalString;
  estimated_receive: DecimalString;
  asset: string;
  requirements: PreviewRequirements;
  limits?: FinancialLimits;
};

export type DepositDestination =
  | { kind: "VIRTUAL_ACCOUNT"; account_name: string; bank_name?: string; masked_account: string; reference?: string }
  | { kind: "CRYPTO_ADDRESS"; address: string; network: string; asset: string };

export type MoneyActivity = {
  id: string;
  type: MoneyActivityType;
  state: DepositState | WithdrawalState | TransferState;
  amount: DecimalString;
  asset: string;
  network?: string;
  fee?: DecimalString;
  destination_masked?: string;
  occurred_at: string;
  reference?: string;
  mode: "REAL" | "SIMULATION";
};

export function financialStateLabel(state: DepositState | WithdrawalState | TransferState): string {
  return state.toLowerCase().split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function normalizeFinancialFeatures(input: unknown): FinancialFeatureSet {
  const source = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const enabled = (camel: string, constant: string) => source[camel] === true || source[constant] === true;
  return Object.freeze({
    realWalletReadEnabled: enabled("real_wallet_read_enabled", "REAL_WALLET_READ_ENABLED"),
    depositsEnabled: enabled("real_deposits_enabled", "REAL_DEPOSITS_ENABLED"),
    withdrawalsEnabled: enabled("real_withdrawals_enabled", "REAL_WITHDRAWALS_ENABLED"),
    internalTransfersEnabled: enabled("real_internal_transfers_enabled", "REAL_INTERNAL_TRANSFERS_ENABLED"),
    withdrawalPreviewEnabled: enabled("withdrawal_preview_enabled", "WITHDRAWAL_PREVIEW_ENABLED"),
    transferPreviewEnabled: enabled("transfer_preview_enabled", "TRANSFER_PREVIEW_ENABLED"),
  });
}

export function toMoneyActivity(value: Deposit | Withdrawal | Transfer, type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER"): MoneyActivity {
  return {
    id: value.id,
    type,
    state: value.state,
    amount: value.amount,
    asset: value.asset,
    network: "network" in value ? value.network : undefined,
    fee: "fee" in value ? value.fee : undefined,
    destination_masked: "destination_masked" in value ? value.destination_masked : undefined,
    occurred_at: value.updated_at,
    reference: value.reference,
    mode: "REAL",
  };
}
