import { expect, test } from "@playwright/test";
import { expectGuestSession } from "./support/session";

test("canonical simulation preview, idempotent order, settlement, and real-mode denial", async ({ request, context, baseURL }) => {
  const origin = baseURL ?? "http://127.0.0.1:8080";
  await expectGuestSession(context, baseURL);
  const simulation = { "X-Beyvra-Simulation-Mode": "true" };
  const order = { instrument: "BTC-USD", side: "BUY", order_type: "MARKET", quantity: "0.001" };

  const preview = await request.post(`${origin}/api/v1/trading/orders/preview`, { headers: simulation, data: order });
  expect(preview.status()).toBe(200);
  expect(await preview.json()).toMatchObject({ decision: "ALLOW", simulation: true });

  const key = `simulation-${Date.now()}`;
  const headers = { ...simulation, "Idempotency-Key": key };
  const created = await request.post(`${origin}/api/v1/trading/orders`, { headers, data: order });
  expect(created.status()).toBe(201);
  const candidate = await created.json();
  expect(candidate).toMatchObject({ instrument: "BTC-USD", side: "BUY", simulation: true });
  const duplicate = await request.post(`${origin}/api/v1/trading/orders`, { headers, data: order });
  expect((await duplicate.json()).id).toBe(candidate.id);

  await expect.poll(async () => {
    const orders = await request.get(`${origin}/api/v1/trading/orders`, { headers: simulation });
    return (await orders.json()).results.find((item: { id: string }) => item.id === candidate.id)?.state;
  }, { timeout: 15_000 }).toBe("FILLED");

  const [trades, positions, accounts] = await Promise.all([
    request.get(`${origin}/api/v1/trading/trades`, { headers: simulation }),
    request.get(`${origin}/api/v1/trading/positions`, { headers: simulation }),
    request.get(`${origin}/api/v1/trading/accounts`, { headers: simulation }),
  ]);
  expect((await trades.json()).results.some((item: { order_id: string; simulation: boolean }) => item.order_id === candidate.id && item.simulation)).toBe(true);
  expect((await positions.json()).results.some((item: { instrument: string; simulation: boolean }) => item.instrument === "BTC-USD" && item.simulation)).toBe(true);
  expect((await accounts.json()).results[0]).toMatchObject({ simulation: true, currency: "USD" });

  const realModeAttempt = await request.post(`${origin}/api/v1/trading/orders`, {
    headers: { "Idempotency-Key": `real-${Date.now()}` },
    data: order,
  });
  expect(realModeAttempt.status()).toBe(503);
  expect(await realModeAttempt.json()).toMatchObject({ error: { code: "FEATURE_DISABLED" } });
});
