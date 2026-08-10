import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { guestAccess, openGuestPlatform } from "./support/session";

const viewports = [
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

test.describe("deterministic staging visual and accessibility coverage", () => {
  test.setTimeout(90_000);
  for (const viewport of viewports) {
    test(`platform shell ${viewport.width}x${viewport.height}`, async ({ page, request, context, baseURL }) => {
      await page.setViewportSize(viewport);
      await openGuestPlatform(page);
      const origin = baseURL ?? "http://127.0.0.1:8080";
      const access = await guestAccess(context, baseURL);
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
        const order = await request.post(`${origin}/api/v1/demo/orders`, { headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json", "Idempotency-Key": `visual-order-${Date.now()}` }, data: { symbol: "BTCUSDT", amount: "100", duration: 5, direction: "up" } });
        if (order.ok()) {
          await expect.poll(async () => (await request.get(`${origin}/api/v1/demo/trades`, { headers: { Authorization: `Bearer ${access}` } })).ok()).toBe(true);
          await page.screenshot({ path: `test-results/visual/${viewport.width}x${viewport.height}-OPEN-marker.png`, fullPage: false });
        } else {
          expect([409, 503]).toContain(order.status());
          await expect(page.getByText(/Virtual funds only/i)).toBeVisible();
        }
      }
      await page.locator("body").click({ position: { x: 8, y: 8 } });
      await page.keyboard.press("Tab");
      await expect(page.evaluate(() => document.activeElement?.tagName)).resolves.not.toBe("BODY");
    });
  }
});
