import { expect, test } from "@playwright/test";
import { expectGuestSession } from "./support/session";

test("Guest Demo BTCUSDT order is idempotent and settles server-side", async ({ request, context, baseURL }) => {
  const origin = baseURL ?? "http://127.0.0.1:8080";
  await expectGuestSession(context, baseURL);
  const headers = { "Idempotency-Key": `order-${Date.now()}` };
  const payload = { symbol: "BTCUSDT", amount: "100", duration: 5, direction: "up" };
  const first = await request.post(`${origin}/api/v1/demo/orders`, { headers, data: payload });
  test.skip([409, 503].includes(first.status()), "Certified staging quote is unavailable; demo ordering correctly fails closed");
  expect(first.status()).toBe(201);
  const firstBody = await first.json();
  const duplicate = await request.post(`${origin}/api/v1/demo/orders`, { headers, data: payload });
  expect(duplicate.ok()).toBeTruthy();
  expect((await duplicate.json()).id).toBe(firstBody.id);
  const open = await request.get(`${origin}/api/v1/demo/trades`);
  expect((await open.json()).some((trade: { id: number; state: string }) => trade.id === firstBody.id)).toBeTruthy();
  let result: { id: number; state: string; closingPrice?: string } | undefined;
  await expect.poll(async () => {
    const settled = await request.get(`${origin}/api/v1/demo/trades`);
    result = (await settled.json()).find((trade: { id: number }) => trade.id === firstBody.id);
    return result?.state;
  }, { timeout: 15_000 }).toMatch(/WON|LOST|DRAW/);
  expect(["WON", "LOST", "DRAW"]).toContain(result!.state);
  expect(result!.closingPrice).toBeTruthy();
});
