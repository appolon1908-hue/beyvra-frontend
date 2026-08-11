import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { openGuestPlatform } from "./support/session";

const forbidden = /requestId|correlationId|traceback|stack trace|integrityerror|operationalerror|\/api\/v\d|localhost|financial-service|postgres|redis|nats|docker/i;

test.describe("public authentication recovery", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("invalid login is safe and password recovery is reachable", async ({ page }) => {
    await page.route("**/api/v1/auth/token/", (route) => route.fulfill({ status: 401, json: { code: "INVALID_CREDENTIALS", requestId: "must-not-render", detail: "OperationalError at /api/v1/auth/token/" } }));
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.getByLabel("Email").fill("invalid@example.test");
    await page.getByLabel("Password", { exact: true }).fill("NotARealPassword9!");
    await page.getByRole("button", { name: "Log In" }).click();
    await expect(page.getByText(/Unable to sign in/i)).toBeVisible();
    await expect(page.locator("body")).not.toContainText(forbidden);
    await page.getByRole("button", { name: /Forgot your password/i }).click();
    await expect(page.locator("body")).toContainText(/reset|email/i);
  });

  test("expired sessions provide a deterministic reauthentication path", async ({ page }) => {
    await page.goto("/session-expired", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Your session has expired" })).toBeVisible();
    await page.getByRole("link", { name: "Sign in again" }).click();
    await expect(page).toHaveURL(/\/signIn\?tab=login/);
  });
});

test.describe("authenticated critical UX", () => {
  for (const viewport of [{ width: 375, height: 812 }, { width: 768, height: 1024 }, { width: 1024, height: 768 }, { width: 1440, height: 900 }]) {
    test(`dashboard is safe and responsive at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openGuestPlatform(page);
      await expect(page.getByText("Virtual funds only")).toBeVisible();
      await expect(page.locator("body")).not.toContainText(forbidden);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      expect(results.violations, results.violations.map((item) => `${item.id}: ${item.help}`).join("\n")).toEqual([]);
      await page.screenshot({ path: `test-results/ux-audit/${viewport.width}-dashboard.png`, fullPage: false });
    });
  }

  test("profile, settings, trades, help, market and chart states are reachable", async ({ page }) => {
    await openGuestPlatform(page);
    await expect(page.locator(".chart-surface canvas").first()).toBeVisible();
    await page.getByRole("button", { name: "Market", exact: true }).click();
    await expect(page.locator("body")).not.toContainText(forbidden);
    await page.keyboard.press("Escape");
    await expect(page.locator(".leftMainDrawer")).not.toHaveClass(/ant-drawer-open/);
    await page.getByRole("button", { name: "Help" }).click();
    await expect(page.locator("body")).not.toContainText(forbidden);
    for (const [path, heading] of [["/platform/trades", "Demo Trades"], ["/platform/profile", "Demo profile"], ["/platform/settings", "Demo settings"]] as const) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
      await expect(page.locator("body")).not.toContainText(forbidden);
    }
  });
});
