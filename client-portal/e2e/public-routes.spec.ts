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
  await page.getByRole("link", { name: "Try Demo", exact: true }).first().click();
  await expect(page).toHaveURL(/\/signIn\?tab=registration&mode=demo$/);
  await expect(page.getByRole("tab", { name: "Registration" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
  await page.screenshot({ path: "test-results/audit/02-registration.png", fullPage: false });
});

test("sign-in is a dedicated route with a safe demo alternative", async ({ page }) => {
  await page.goto("/signIn?tab=login");
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Log In" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Keep me signed in" })).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Show password" })).toBeVisible();
});

test("session-expired route provides a safe recovery path", async ({ page }) => {
  await page.goto("/session-expired");
  await expect(page.getByRole("heading", { name: "Your session has expired" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Sign in again" })).toHaveAttribute("href", "/signIn?tab=login");
});
