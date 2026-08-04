import { expect, test } from "@playwright/test";

test("Guest Demo BTCUSDT order is idempotent and settles server-side", async ({ request, baseURL }) => {
  const origin = baseURL ?? "http://127.0.0.1:8080";
  const session = await request.post(`${origin}/api/v1/demo/sessions`, { headers: { "Idempotency-Key": `guest-${Date.now()}` }, data: {} });
  expect(session.ok()).toBeTruthy();
  const { access } = await session.json();
  const headers = { Authorization: `Bearer ${access}`, "Content-Type": "application/json", "Idempotency-Key": `order-${Date.now()}` };
  const payload = { symbol: "BTCUSDT", amount: "100", duration: 5, direction: "up" };
  const first = await request.post(`${origin}/api/v1/demo/orders`, { headers, data: payload });
  expect(first.status()).toBe(201);
  const firstBody = await first.json();
  const duplicate = await request.post(`${origin}/api/v1/demo/orders`, { headers, data: payload });
  expect(duplicate.ok()).toBeTruthy();
  expect((await duplicate.json()).id).toBe(firstBody.id);
  const open = await request.get(`${origin}/api/v1/demo/trades`, { headers });
  expect((await open.json()).some((trade: { id: number; state: string }) => trade.id === firstBody.id)).toBeTruthy();
  await new Promise((resolve) => setTimeout(resolve, 7_000));
  const settled = await request.get(`${origin}/api/v1/demo/trades`, { headers });
  const result = (await settled.json()).find((trade: { id: number }) => trade.id === firstBody.id);
  expect(["WON", "LOST", "DRAW"]).toContain(result.state);
  expect(result.closingPrice).toBeTruthy();
});
