import { expect, test } from "@playwright/test";
import type { APIRequestContext, BrowserContext, Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

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
  return { origin, access };
}

test.describe("deterministic staging visual and accessibility coverage", () => {
  test.setTimeout(90_000);
  for (const viewport of viewports) {
    test(`platform shell ${viewport.width}x${viewport.height}`, async ({ page, request, context, baseURL }) => {
      await page.setViewportSize(viewport);
      const session = await guest(page, request, context, baseURL);
      await expect(page.getByText("Loading market history…")).toHaveCount(0, { timeout: 15_000 });
      await expect(page.locator("body")).not.toContainText(/TradX|Tradex|Markets\.com|fund your account|live trading/i);
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(axe.violations, axe.violations.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
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
      if (viewport.width >= 1440) {
        const order = await request.post(`${session.origin}/api/v1/demo/orders`, { headers: { Authorization: `Bearer ${session.access}`, "Content-Type": "application/json", "Idempotency-Key": `visual-order-${Date.now()}` }, data: { symbol: "BTCUSDT", amount: "100", duration: 5, direction: "up" } });
        expect(order.ok()).toBeTruthy();
        await page.waitForTimeout(500);
        await page.screenshot({ path: `test-results/visual/${viewport.width}x${viewport.height}-OPEN-marker.png`, fullPage: false });
        await page.waitForTimeout(6500);
        await page.reload({ waitUntil: "domcontentloaded" });
        await expect(page.getByText("Loading market history…")).toHaveCount(0, { timeout: 15_000 });
        await page.screenshot({ path: `test-results/visual/${viewport.width}x${viewport.height}-SETTLED-marker.png`, fullPage: false });
      }
      const firstControl = page.getByRole("button").first();
      await firstControl.focus();
      await expect(firstControl).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(page.evaluate(() => document.activeElement?.tagName)).resolves.not.toBe("BODY");
    });
  }
});
