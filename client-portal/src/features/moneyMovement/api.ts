import { codestraRequest as beyvraRequest } from "api/generated/codestraDemo";
import {
  ComplianceProfile, ComplianceRequirement, Deposit, DepositDestination,
  FinancialFeatureSet, MoneyMovementPreview, Paginated, Transfer, WalletSnapshot,
  Withdrawal, normalizeFinancialFeatures,
} from "./types";

type Token = string | undefined;
type PreviewInput = { account_ref?: string; asset: string; amount: string; destination_ref?: string; beneficiary_ref?: string };

const resource = (name: string, id?: string) => `v1/${name}${id ? `/${encodeURIComponent(id)}` : ""}/`;

export const FINANCIAL_ENDPOINTS = Object.freeze({
  features: "v1/features/",
  wallets: "v1/wallets/",
  deposits: "v1/deposits/",
  withdrawals: "v1/withdrawals/",
  withdrawalPreview: "v1/withdrawals/preview/",
  transfers: "v1/transfers/",
  transferPreview: "v1/transfers/preview/",
  complianceProfile: "v1/compliance/profile/",
  complianceRequirements: "v1/compliance/requirements/",
});

export const financialApi = {
  features: async (token?: Token): Promise<FinancialFeatureSet> =>
    normalizeFinancialFeatures(await beyvraRequest(FINANCIAL_ENDPOINTS.features, { token })),
  wallets: (token?: Token) => beyvraRequest<Paginated<WalletSnapshot> | WalletSnapshot[]>(resource("wallets"), { token }),
  wallet: (asset: string, token?: Token) => beyvraRequest<WalletSnapshot>(resource("wallets", asset), { token }),
  deposits: (token?: Token) => beyvraRequest<Paginated<Deposit> | Deposit[]>(resource("deposits"), { token }),
  deposit: (id: string, token?: Token) => beyvraRequest<Deposit>(resource("deposits", id), { token }),
  createDeposit: (body: { account_ref: string; asset: string; network?: string }, idempotencyKey: string, token?: Token) =>
    beyvraRequest<Deposit & { destination?: DepositDestination }>(resource("deposits"), {
      method: "POST", token, idempotencyKey, body: JSON.stringify(body),
    }),
  withdrawals: (token?: Token) => beyvraRequest<Paginated<Withdrawal> | Withdrawal[]>(resource("withdrawals"), { token }),
  withdrawal: (id: string, token?: Token) => beyvraRequest<Withdrawal>(resource("withdrawals", id), { token }),
  previewWithdrawal: (body: PreviewInput, token?: Token) =>
    beyvraRequest<MoneyMovementPreview>(FINANCIAL_ENDPOINTS.withdrawalPreview, { method: "POST", token, body: JSON.stringify(body) }),
  createWithdrawal: (body: PreviewInput, idempotencyKey: string, token?: Token) =>
    beyvraRequest<Withdrawal>(resource("withdrawals"), { method: "POST", token, idempotencyKey, body: JSON.stringify(body) }),
  cancelWithdrawal: (id: string, idempotencyKey: string, token?: Token) =>
    beyvraRequest<Withdrawal>(`${resource("withdrawals", id)}cancel/`, { method: "POST", token, idempotencyKey }),
  transfers: (token?: Token) => beyvraRequest<Paginated<Transfer> | Transfer[]>(resource("transfers"), { token }),
  transfer: (id: string, token?: Token) => beyvraRequest<Transfer>(resource("transfers", id), { token }),
  previewTransfer: (body: PreviewInput, token?: Token) =>
    beyvraRequest<MoneyMovementPreview>(FINANCIAL_ENDPOINTS.transferPreview, { method: "POST", token, body: JSON.stringify(body) }),
  createTransfer: (body: PreviewInput, idempotencyKey: string, token?: Token) =>
    beyvraRequest<Transfer>(resource("transfers"), { method: "POST", token, idempotencyKey, body: JSON.stringify(body) }),
  complianceProfile: (token?: Token) => beyvraRequest<ComplianceProfile>(FINANCIAL_ENDPOINTS.complianceProfile, { token }),
  complianceRequirements: (token?: Token) => beyvraRequest<ComplianceRequirement[]>(FINANCIAL_ENDPOINTS.complianceRequirements, { token }),
};

export function listResults<T>(value: Paginated<T> | T[]): T[] {
  return Array.isArray(value) ? value : value.results;
}
