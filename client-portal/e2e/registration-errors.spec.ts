import { expect, test, type Page } from "@playwright/test";

const forbidden = /requestId|correlationId|traceback|stack trace|integrityerror|operationalerror|\/api\/v\d|localhost|postgres|redis|docker/i;

async function completeRegistrationForm(page: Page, email: string) {
  await page.goto("/signIn?tab=registration", { waitUntil: "domcontentloaded" });
  await page.locator('input[placeholder="First Name"]:visible').fill("Demo");
  await page.locator('input[placeholder="Last Name"]:visible').fill("Trader");
  await page.locator('input[placeholder="Email"]:visible').fill(email);
  await page.locator('input[placeholder="Phone number"]:visible').fill("2025550199");
  await page.locator('input[placeholder="Password"]:visible').fill("DemoTrade9!");
  await page.locator('input[placeholder="Confirm password"]:visible').fill("DemoTrade9!");
  await page.locator('input[type="checkbox"]:visible').check();
}

test.describe("registration error contract", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  for (const scenario of [
    { status: 400, code: "REGISTRATION_INVALID", title: "Check your information" },
    { status: 409, code: "REGISTRATION_CONFLICT", title: "Registration already in progress" },
    { status: 429, code: "RATE_LIMITED", title: "Too many requests" },
    { status: 503, code: "EMAIL_REGISTRATION_DISABLED", title: "Registration temporarily unavailable" },
  ]) {
    test(`maps registration HTTP ${scenario.status} safely`, async ({ page }) => {
      await page.route("**/api/v1/auth/register", (route) => route.fulfill({
        status: scenario.status,
        json: { code: scenario.code, requestId: "must-not-render", detail: "OperationalError at /api/v1/auth/register" },
      }));
      await completeRegistrationForm(page, `status-${scenario.status}@example.test`);
      await page.getByRole("button", { name: "Register" }).click();
      await expect(page.getByText(new RegExp(scenario.title, "i"))).toBeVisible();
      await expect(page.locator("body")).not.toContainText(forbidden);
    });
  }

  test("maps registration network failure safely", async ({ page }) => {
    await page.route("**/api/v1/auth/register", (route) => route.abort("connectionfailed"));
    await completeRegistrationForm(page, "network@example.test");
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByText(/Registration temporarily unavailable/i)).toBeVisible();
    await expect(page.locator("body")).not.toContainText(forbidden);
  });

  test("successful registration enters OTP verification and completes", async ({ page }) => {
    await page.route("**/api/v1/auth/register", (route) => route.fulfill({
      status: 202,
      json: { registrationId: "reg_test", status: "pending_email_verification", maskedEmail: "d***@example.test", expiresIn: 600, resendAvailableIn: 60 },
    }));
    await page.route("**/api/v1/auth/email-verification/verify", (route) => route.fulfill({
      status: 200,
      json: { status: "verified", accountStatus: "active", nextPath: "/platform" },
    }));
    await completeRegistrationForm(page, "success@example.test");
    await page.getByRole("button", { name: "Register" }).click();
    await expect(page.getByRole("heading", { name: "Verify your email" })).toBeVisible();
    await page.getByLabel("Verification code").fill("482913");
    await page.getByRole("button", { name: "Verify email" }).click();
    await expect(page).toHaveURL(/\/signIn\?tab=login/);
    await expect(page.locator("body")).not.toContainText(forbidden);
  });
});
