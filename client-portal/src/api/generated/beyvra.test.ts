import { describe, expect, it, vi } from "vitest";
import { beyvraAuthApi, beyvraDemoApi, beyvraRealtimeV2Api, beyvraWalletApi } from "./beyvra";
import { codestraAuthApi, codestraDemoApi, codestraRealtimeV2Api } from "./codestraDemo";

describe("generated client compatibility", () => {
  it("keeps legacy exports as aliases of the canonical Beyvra client", () => {
    expect(beyvraAuthApi).toBe(codestraAuthApi);
    expect(beyvraDemoApi).toBe(codestraDemoApi);
    expect(beyvraRealtimeV2Api).toBe(codestraRealtimeV2Api);
  });

  it.each([
    ["currencies", () => beyvraWalletApi.currencies("token")],
    ["payment methods", () => beyvraWalletApi.paymentMethods("token")],
    ["wallet archive", () => beyvraWalletApi.archive("token", "USD")],
    ["wallet refill", () => beyvraWalletApi.refillLegacy("token", "USD")],
    ["transaction detail", () => beyvraWalletApi.transaction("token", "transaction-id")],
  ])("fails closed for unsupported %s without making a request", async (_name, operation) => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await expect(operation()).rejects.toMatchObject({ status: 503, code: "FEATURE_DISABLED" });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
