import { expect, test } from "@playwright/test";

const routes = [
  "/", "/markets/Commodities", "/markets/shares", "/markets/indices",
  "/markets/etfs", "/markets/bonds", "/markets/ipos", "/markets/crypto",
  "/trading", "/trading/tradingPlatform", "/trading/MobileTrading",
  "/trading/metaTradingFour", "/trading/metaTradingFive", "/trading/copyTrading",
  "/trading/cfdTradingCalculator", "/trading/commoditesProfitCalculator",
  "/trading/forexProfitCalculator", "/trading/forexMarginCalculator",
  "/trading/economicCalendar", "/trading/cfdAssetList", "/downloads", "/prv",
];

test("all public application routes render without browser errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => {
    // Route-to-route navigation aborts outstanding optional third-party
    // requests. Rendering exceptions remain fatal; cancelled fetches do not.
    if (error.message !== "Failed to fetch") errors.push(error.message);
  });

  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBeLessThan(400);
    await expect.poll(() => page.locator("#root > *:visible").count(), { message: route }).toBeGreaterThan(0);
  }
  expect(errors).toEqual([]);
});

test("landing authentication controls are actionable", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Registration", exact: true }).click();
  await expect(page).toHaveURL(/\/signIn\?tab=registration$/);
  await expect(page.getByRole("tab", { name: "Registration" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
  await page.screenshot({ path: "test-results/audit/02-registration.png", fullPage: false });
});
