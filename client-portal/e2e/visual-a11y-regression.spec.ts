import { expect, test } from "@playwright/test";
import type { APIRequestContext, BrowserContext, Page } from "@playwright/test";

const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

async function guest(page: Page, request: APIRequestContext, context: BrowserContext, baseURL?: string) {
  const origin = baseURL ?? "http://127.0.0.1:8080";
  const response = await request.post(`${origin}/api/v1/demo/sessions`, { headers: { "Idempotency-Key": `visual-${Date.now()}` }, data: {} });
  const { access } = await response.json();
  await context.addCookies([{ name: "access_token", value: access, url: origin }, { name: "codestra_guest_session", value: access, url: origin }]);
  await page.goto("/platform", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".platformWrapper")).toBeVisible();
}

test.describe("deterministic staging visual and accessibility coverage", () => {
  test.setTimeout(90_000);
  for (const viewport of viewports) {
    test(`platform shell ${viewport.width}x${viewport.height}`, async ({ page, request, context, baseURL }) => {
      await page.setViewportSize(viewport);
      await guest(page, request, context, baseURL);
      await expect(page.locator("body")).not.toContainText(/TradX|Tradex|Markets\.com|fund your account|live trading/i);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(overflow).toBe(false);
      await page.screenshot({ path: `test-results/visual/${viewport.width}x${viewport.height}-platform.png`, fullPage: false });
      const account = page.getByRole("button", { name: "Choose account" });
      if (await account.count()) {
        await account.click();
        await expect(page.getByRole("dialog", { name: "Demo account menu" })).toBeVisible();
        await page.screenshot({ path: `test-results/visual/${viewport.width}x${viewport.height}-account.png`, fullPage: false });
        await page.keyboard.press("Escape");
      }
      const trigger = page.getByRole("button", { name: "Open Demo Trade", exact: true });
      if (await trigger.count()) {
        await trigger.click();
        await expect(page.locator("#platform-order-ticket")).toBeVisible();
        await page.keyboard.press("Escape");
      }
      await page.keyboard.press("Tab");
      await expect(page.locator(":focus")).not.toHaveCount(0);
    });
  }
});
