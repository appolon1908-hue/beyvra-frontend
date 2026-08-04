import { expect, test, type BrowserContext, type Page, type APIRequestContext } from "@playwright/test";

async function startGuest(page: Page, context: BrowserContext, request: APIRequestContext, baseURL?: string) {
  const origin = baseURL ?? "http://127.0.0.1:8080";
  const response = await request.post(`${origin}/api/v1/demo/sessions`, { headers: { "Idempotency-Key": `responsive-${Date.now()}` }, data: {} });
  expect(response.ok()).toBeTruthy();
  const { access } = await response.json();
  await context.addCookies([
    { name: "access_token", value: access, url: origin },
    { name: "codestra_guest_session", value: access, url: origin },
  ]);
  await page.goto("/platform", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".platformWrapper")).toBeVisible({ timeout: 20_000 });
}

async function noOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
}

test.describe("authenticated dashboard responsive audit", () => {
  test.setTimeout(60_000);
  for (const viewport of [{ width: 1440, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 360, height: 800 }]) {
    test(`platform remains usable at ${viewport.width}x${viewport.height}`, async ({ page, context, request, baseURL }) => {
      await page.setViewportSize(viewport);
      await startGuest(page, context, request, baseURL);
      await noOverflow(page);
      await expect(page.locator(".chart-container")).toBeVisible();
      await expect(page.getByText("Virtual funds only")).toBeVisible();
      await page.screenshot({ path: `test-results/dashboard-responsive-audit/platform-${viewport.width}x${viewport.height}.png` });
    });
  }
});
