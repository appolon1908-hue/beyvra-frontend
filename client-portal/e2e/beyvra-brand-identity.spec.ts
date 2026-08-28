import { expect, test } from "@playwright/test";

const legacyVisible = /\b(?:Codestra|Tradi|Tradix|Tradx|Tradex|Trading[- ]X|Trade[- ]X)\b|trad(?:e)?x\.(?:com|io)|codestra(?:-ai)?\.(?:com|cloud)/i;

for (const route of ["/", "/signIn", "/signIn?tab=registration", "/markets", "/trading", "/downloads", "/prv"]) {
  test(`public identity is Beyvra on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).not.toContainText(legacyVisible);
    await expect(page.locator("body")).toContainText(/Beyvra/i);
    await expect(page).toHaveTitle(/Beyvra/i);
  });
}

test("authenticated practice platform has no visible legacy identity", async ({ page, request, context, baseURL }) => {
  const origin = baseURL ?? "http://127.0.0.1:8080";
  const response = await request.post(`${origin}/api/v1/demo/sessions`, {
    headers: { "Idempotency-Key": `brand-e2e-${Date.now()}` },
    data: {},
  });
  expect(response.ok()).toBeTruthy();
  await context.addCookies((await request.storageState()).cookies);
  await page.goto("/platform", { waitUntil: "domcontentloaded" });
  await expect(page.locator("body")).not.toContainText(legacyVisible);
});
