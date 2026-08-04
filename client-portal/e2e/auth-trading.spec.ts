import { expect, test } from "@playwright/test";

test("guest demo enters the platform and uses the simulated trade API", async ({ page, request, context, baseURL }) => {
  const origin = baseURL ?? "http://127.0.0.1:8080";
  const session = await request.post(`${origin}/api/v1/demo/sessions`, { headers: { "Idempotency-Key": `legacy-guest-${Date.now()}` }, data: {} });
  expect(session.ok()).toBeTruthy();
  const { access } = await session.json();
  await context.addCookies([{ name: "access_token", value: access, url: origin }]);
  const auth = { Authorization: `Bearer ${access}` };
  const wallet = await request.get(`${origin}/api/v1/demo/wallet`, { headers: auth });
  expect(wallet.ok()).toBeTruthy();
  expect((await wallet.json()).available).toBe("10000.00");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).toBeVisible();
  const order = await request.post(`${origin}/api/v1/demo/orders`, { headers: { ...auth, "Idempotency-Key": `legacy-order-${Date.now()}`, "Content-Type": "application/json" }, data: { symbol: "BTCUSDT", amount: "100", duration: 5, direction: "up" } });
  expect(order.ok()).toBeTruthy();
});
