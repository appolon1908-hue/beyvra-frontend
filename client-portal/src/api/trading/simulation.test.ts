import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSimulationOrder, previewSimulationOrder } from "./simulation";

const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json" },
});

describe("canonical simulation trading client", () => {
  beforeEach(() => vi.stubGlobal("window", globalThis));
  afterEach(() => vi.unstubAllGlobals());

  it("previews without an idempotency key or mutation semantics", async () => {
    const fetch = vi.fn().mockResolvedValue(response({
      decision: "ALLOW", reason_codes: [], instrument: "BTC-USD", side: "BUY",
      order_type: "MARKET", quantity: "1", price: "100", notional: "100",
      estimated_fee: "0.1", available_simulated_balance: "10000", simulation: true,
    }));
    vi.stubGlobal("fetch", fetch);
    await previewSimulationOrder("token", { instrument: "BTC-USD", side: "BUY", order_type: "MARKET", quantity: "1" });
    const init = fetch.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe("POST");
    expect(new Headers(init.headers).get("X-Beyvra-Simulation-Mode")).toBe("true");
    expect(new Headers(init.headers).has("Idempotency-Key")).toBe(false);
  });

  it("creates through the canonical endpoint with explicit simulation intent", async () => {
    const fetch = vi.fn().mockResolvedValue(response({
      id: "order-1", instrument: "BTC-USD", side: "BUY", order_type: "MARKET",
      quantity: "1", filled_quantity: "0", state: "PENDING", simulation: true,
    }, 201));
    vi.stubGlobal("fetch", fetch);
    const result = await createSimulationOrder("token", { instrument: "BTC-USD", side: "BUY", order_type: "MARKET", quantity: "1" }, "same-key");
    expect(result.simulation).toBe(true);
    const init = fetch.mock.calls[0][1] as RequestInit;
    expect(new Headers(init.headers).get("Idempotency-Key")).toBe("same-key");
    expect(String(fetch.mock.calls[0][0])).toContain("v1/trading/orders");
  });
});
