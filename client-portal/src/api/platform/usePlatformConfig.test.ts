import { beforeEach, describe, expect, it, vi } from "vitest";
import { beyvraRequest } from "api/generated/beyvra";
import { fetchPlatformConfig } from "./usePlatformConfig";

vi.mock("api/generated/beyvra", () => ({ beyvraRequest: vi.fn() }));

describe("account-driven platform capabilities", () => {
  beforeEach(() => vi.clearAllMocks());

  it("never enables financial effects for PAPER even if global flags are true", async () => {
    vi.mocked(beyvraRequest).mockResolvedValue({
      account: { execution_mode: "PAPER", trading_enabled: true, funding_enabled: true, withdrawals_enabled: true },
      features: { realTrading: true, payments: true },
    });
    const features = await fetchPlatformConfig("session-marker");
    expect(features.paperTrading).toBe(true);
    expect(features.liveTrading).toBe(false);
    expect(features.deposits).toBe(false);
    expect(features.withdrawals).toBe(false);
    expect(beyvraRequest).toHaveBeenCalledWith("v1/workspace/bootstrap", { token: "session-marker" });
  });

  it("requires both LIVE account permissions and platform activation", async () => {
    vi.mocked(beyvraRequest).mockResolvedValue({
      account: { execution_mode: "LIVE", trading_enabled: true, funding_enabled: true, withdrawals_enabled: false },
      features: { realTrading: false, payments: true },
    });
    const features = await fetchPlatformConfig("session-marker");
    expect(features.paperTrading).toBe(false);
    expect(features.liveTrading).toBe(false);
    expect(features.deposits).toBe(true);
    expect(features.withdrawals).toBe(false);
  });

  it("fails closed during migration if account mode is absent", async () => {
    vi.mocked(beyvraRequest).mockResolvedValue({ account: { id: "legacy" }, features: { payments: true, realTrading: true } });
    const features = await fetchPlatformConfig("session-marker");
    expect(features.paperTrading).toBe(false);
    expect(features.liveTrading).toBe(false);
    expect(features.deposits).toBe(false);
    expect(features.withdrawals).toBe(false);
  });

  it("rejects truthy strings as financial permissions", async () => {
    vi.mocked(beyvraRequest).mockResolvedValue({
      account: { execution_mode: "LIVE", trading_enabled: "true", funding_enabled: "true", withdrawals_enabled: "true" },
      features: { realTrading: true, payments: true },
    });
    const features = await fetchPlatformConfig("session-marker");
    expect(features.liveTrading).toBe(false);
    expect(features.deposits).toBe(false);
    expect(features.withdrawals).toBe(false);
  });
});
