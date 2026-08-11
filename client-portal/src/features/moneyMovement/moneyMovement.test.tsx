import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import FinancialDisabledNotice from "components/financial/FinancialDisabledNotice";
import { FINANCIAL_ENDPOINTS } from "./api";
import { socketEndpoints } from "api/endpoints";
import { BackendDepositDestination, DestinationBadge, RequirementList, WalletGrid } from "./components";
import {
  DEPOSIT_STATES, DISABLED_FINANCIAL_FEATURES, TRANSFER_STATES, WITHDRAWAL_STATES,
  financialStateLabel, normalizeFinancialFeatures,
} from "./types";
import { notificationForFinancialEvent } from "./realtime";

const render = (value: React.ReactNode) => renderToStaticMarkup(<MemoryRouter>{value}</MemoryRouter>);

describe("provider-neutral money movement contract", () => {
  it("uses only canonical Beyvra API paths", () => {
    expect(Object.values(FINANCIAL_ENDPOINTS)).toEqual([
      "v1/features/", "v1/wallets/", "v1/deposits/", "v1/withdrawals/",
      "v1/withdrawals/preview/", "v1/transfers/", "v1/transfers/preview/",
      "v1/compliance/profile/", "v1/compliance/requirements/",
    ]);
    expect(JSON.stringify(FINANCIAL_ENDPOINTS)).not.toMatch(/polygon|oms|provider|financial-service|https?:/i);
    expect(socketEndpoints.canonical).toBe("ws/v2/");
  });

  it("fails feature discovery closed and accepts only literal server true", () => {
    expect(normalizeFinancialFeatures(undefined)).toEqual(DISABLED_FINANCIAL_FEATURES);
    expect(normalizeFinancialFeatures({ REAL_DEPOSITS_ENABLED: "true", real_withdrawals_enabled: 1 })).toEqual(DISABLED_FINANCIAL_FEATURES);
    expect(normalizeFinancialFeatures({ REAL_WALLET_READ_ENABLED: true, real_deposits_enabled: true })).toMatchObject({
      realWalletReadEnabled: true, depositsEnabled: true, withdrawalsEnabled: false,
    });
  });

  it("maps every canonical state without importing an external enum", () => {
    expect(DEPOSIT_STATES).toHaveLength(10);
    expect(WITHDRAWAL_STATES).toHaveLength(13);
    expect(TRANSFER_STATES).toHaveLength(6);
    for (const state of [...DEPOSIT_STATES, ...WITHDRAWAL_STATES, ...TRANSFER_STATES]) {
      expect(financialStateLabel(state)).not.toContain("_");
    }
  });

  it("never fabricates wallet balances or deposit instructions", () => {
    expect(render(<WalletGrid wallets={[]} />)).not.toMatch(/0\.00|USD|available balance/i);
    const unavailable = render(<BackendDepositDestination />);
    expect(unavailable).toContain("only after Beyvra returns an approved destination");
    expect(unavailable).not.toMatch(/account number|wallet address|provider/i);
  });

  it("renders only backend-authoritative address, network, and asset", () => {
    const html = render(<BackendDepositDestination destination={{
      kind: "CRYPTO_ADDRESS", address: "fixture-address", network: "TEST_NETWORK", asset: "TST",
    }} />);
    expect(html).toContain("fixture-address");
    expect(html).toContain("TEST_NETWORK");
    expect(html).toContain("TST");
  });

  it("renders destination security and compliance/step-up states safely", () => {
    for (const status of ["PENDING", "VERIFIED", "LOCKED", "REVOKED"] as const) {
      expect(render(<DestinationBadge status={status} />)).toContain(status.charAt(0) + status.slice(1).toLowerCase());
    }
    const requirements = render(<RequirementList requirements={[
      { code: "KYC_REQUIRED" }, { code: "COMPLIANCE_REVIEW_REQUIRED" },
      { code: "STEP_UP_REQUIRED" }, { code: "DESTINATION_COOLDOWN" },
    ]} />);
    expect(requirements).toMatch(/identity verification/i);
    expect(requirements).toMatch(/multi-factor verification/i);
    expect(requirements).toMatch(/cooldown/i);
  });

  it("uses stable fail-closed messages for each real mutation", () => {
    const html = render(<FinancialDisabledNotice />);
    expect(html).toContain("Deposits, withdrawals, and transfers are disabled");
    expect(html).toContain("No financial request has been created");
    expect(html).not.toMatch(/successful|provider|request id|webhook|mTLS/i);
  });

  it("maps canonical realtime events to safe Beyvra notifications", () => {
    const fixtures = [
      ["deposit.updated.v1", "DETECTED", "Deposit detected"],
      ["deposit.updated.v1", "CREDITED", "Deposit credited"],
      ["withdrawal.updated.v1", "PENDING_APPROVAL", "Withdrawal under review"],
      ["withdrawal.updated.v1", "COMPLETED", "Withdrawal completed"],
      ["withdrawal.updated.v1", "FAILED", "Withdrawal update"],
      ["transfer.updated.v1", "PENDING", "Transfer update"],
      ["compliance.requirement.updated.v1", "", "Security requirement updated"],
    ] as const;
    for (const [type, state, title] of fixtures) {
      const notice = notificationForFinancialEvent({ type, data: { state } });
      expect(notice?.title).toBe(title);
      expect(JSON.stringify(notice)).not.toMatch(/provider|request id|webhook|mTLS|financial-service/i);
    }
  });
});
