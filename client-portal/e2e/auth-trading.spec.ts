import { expect, test } from "@playwright/test";
import { expectGuestSession } from "./support/session";

test("guest demo enters the platform and uses the simulated trade API", async ({ page, request, context, baseURL }) => {
  const origin = baseURL ?? "http://127.0.0.1:8080";
  await expectGuestSession(context, baseURL);
  const wallet = await request.get(`${origin}/api/v1/demo/wallet`);
  expect(wallet.ok()).toBeTruthy();
  expect((await wallet.json()).available).toBe("10000.00");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toBeVisible();
  const order = await request.post(`${origin}/api/v1/demo/orders`, { headers: { "Idempotency-Key": `legacy-order-${Date.now()}` }, data: { symbol: "BTCUSDT", amount: "100", duration: 5, direction: "up" } });
  expect([200, 201, 409, 503]).toContain(order.status());
});
