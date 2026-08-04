import { test, expect } from "@playwright/test";

const publicRoutes = [
  "/",
  "/trading",
  "/trading/tradingPlatform",
  "/trading/MobileTrading",
  "/trading/cfdTrading",
  "/trading/forexProfitCalculator",
  "/trading/commoditesProfitCalculator",
  "/trading/forexMarginCalculator",
  "/trading/economicCalendar",
  "/trading/cfdAssetList",
  "/trading/tradingConditions",
  "/trading/expirationDate",
  "/trading/copyTrading",
  "/markets/Commodities",
  "/markets/shares",
  "/markets/indices",
  "/markets/etfs",
  "/markets/bonds",
  "/markets/ipos",
  "/markets/crypto",
  "/downloads",
  "/prv",
  "/reg",
];

test.describe("public route and CTA audit", () => {
  test("every public route renders without a client error or missing document", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of publicRoutes) {
      const response = await page.goto(route, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${route} returned an invalid document`).toBeLessThan(400);
      await expect(page.locator("body")).not.toContainText("404");
    }
    expect(errors, `client errors: ${errors.join(" | ")}`).toEqual([]);
  });

  test("primary marketing CTAs lead to a real route", async ({ page }) => {
    await page.goto("/platform-overview", { waitUntil: "networkidle" });
    await expect(page.getByText(/simulated controls/i)).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/Markets\.com|TradX|Tradex|fund your account|live trading/i);
    const cta = page.getByRole("link", { name: /Try the demo/i }).first();
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/platform|\/login/);
  });
});
