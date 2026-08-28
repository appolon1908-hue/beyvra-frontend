import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";
import type { PaginatedResponse } from "api/types";

export type AccountStatus = "ACTIVE" | "RESTRICTED" | "SUSPENDED" | "CLOSED";

export interface Account {
  id: string;
  tenant_id: string;
  account_ref: string;
  currency: string;
  status: AccountStatus;
  created_at: string;
}

/**
 * Canonical balance projection. Cash, reserved cash, settled cash and buying power
 * are distinct fields sourced from the server; never recompute them client-side.
 */
export interface AccountBalances {
  account_id: string;
  cash: string;
  reserved_cash: string;
  settled_cash: string;
  currency: string;
  as_of: string;
}

export interface BuyingPower {
  account_id: string;
  buying_power: string;
  maintenance_requirement: string;
  as_of: string;
}

export interface AccountTransaction {
  id: string;
  account_id: string;
  type: string;
  amount: string;
  currency: string;
  reference: string | null;
  occurred_at: string;
}

export interface AccountStatement {
  id: string;
  account_id: string;
  period_start: string;
  period_end: string;
  document_url: string;
  generated_at: string;
}

export interface TaxLot {
  id: string;
  account_id: string;
  instrument: string;
  quantity: string;
  cost_basis: string;
  acquired_at: string;
}

export function listAccounts(token: string): Promise<PaginatedResponse<Account>> {
  return authenticatedRequest<PaginatedResponse<Account>>(apiEndpoints.accounts.list, token);
}

export function getAccount(token: string, accountId: string): Promise<Account> {
  return authenticatedRequest<Account>(apiEndpoints.accounts.detail(accountId), token);
}

export function getAccountBalances(token: string, accountId: string): Promise<AccountBalances> {
  return authenticatedRequest<AccountBalances>(apiEndpoints.accounts.balances(accountId), token);
}

export function getAccountBuyingPower(token: string, accountId: string): Promise<BuyingPower> {
  return authenticatedRequest<BuyingPower>(apiEndpoints.accounts.buyingPower(accountId), token);
}

export function listAccountTransactions(
  token: string,
  accountId: string,
  cursor?: string,
): Promise<PaginatedResponse<AccountTransaction>> {
  const base = apiEndpoints.accounts.transactions(accountId);
  const endpoint = cursor ? `${base}?cursor=${encodeURIComponent(cursor)}` : base;
  return authenticatedRequest<PaginatedResponse<AccountTransaction>>(endpoint, token);
}

export function listAccountStatements(
  token: string,
  accountId: string,
): Promise<PaginatedResponse<AccountStatement>> {
  return authenticatedRequest<PaginatedResponse<AccountStatement>>(apiEndpoints.accounts.statements(accountId), token);
}

export function listAccountTaxLots(
  token: string,
  accountId: string,
  cursor?: string,
): Promise<PaginatedResponse<TaxLot>> {
  const base = apiEndpoints.accounts.taxLots(accountId);
  const endpoint = cursor ? `${base}?cursor=${encodeURIComponent(cursor)}` : base;
  return authenticatedRequest<PaginatedResponse<TaxLot>>(endpoint, token);
}
