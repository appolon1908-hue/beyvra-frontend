import { expect, test, type Page } from "@playwright/test";
import { openGuestPlatform } from "./support/session";

async function noOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
}

test.describe("authenticated dashboard responsive audit", () => {
  test.setTimeout(60_000);
  for (const viewport of [{ width: 1440, height: 900 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 360, height: 800 }]) {
    test(`platform remains usable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openGuestPlatform(page);
      await noOverflow(page);
      await expect(page.locator(".chart-container")).toBeVisible();
      await expect(page.getByText("Virtual funds only")).toBeVisible();
      await page.screenshot({ path: `test-results/dashboard-responsive-audit/platform-${viewport.width}x${viewport.height}.png` });
    });
  }
});
