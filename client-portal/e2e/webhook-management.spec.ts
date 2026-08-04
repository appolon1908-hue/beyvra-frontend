import { expect, test } from "@playwright/test";

test("authenticated users can create, test, inspect, disable, and delete a webhook", async ({ page, request, context, baseURL }) => {
  const origin = baseURL ?? "http://127.0.0.1:8080";
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const email = `webhook-ui-${unique}@example.test`;
  const password = "WebhookUi9!";
  const receiverSecret = process.env.STAGING_WEBHOOK_TEST_SECRET ?? "local-webhook-secret-2053";
  const registration = await request.post(`${origin}/api/v1/auth/register`, { data: { email, password, displayName: "Webhook UI", legalAccepted: true, locale: "en" } });
  expect(registration.status()).toBe(202);
  const registrationPayload = await registration.json();
  const otpSecret = process.env.STAGING_TEST_OTP_SECRET;
  expect(otpSecret, "STAGING_TEST_OTP_SECRET must be set for verified-account E2E").toBeTruthy();
  const otpResponse = await request.get(`${origin}/api/v1/auth/test/otp?registrationId=${encodeURIComponent(registrationPayload.registrationId)}`, { headers: { "X-Staging-Test-OTP": otpSecret ?? "" } });
  expect(otpResponse.ok()).toBeTruthy();
  const otp = await otpResponse.json();
  const verified = await request.post(`${origin}/api/v1/auth/email-verification/verify`, { data: { registrationId: registrationPayload.registrationId, code: otp.code } });
  expect(verified.ok()).toBeTruthy();
  const login = await request.post(`${origin}/api/user/token/`, { data: { email, password } });
  expect(login.ok()).toBeTruthy();
  const session = await login.json();
  await context.addCookies([
    { name: "access_token", value: session.access, url: origin },
    { name: "refresh_token", value: session.refresh, url: origin },
  ]);

  await page.goto("/platform", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".platformWrapper")).toBeVisible();
  const profile = page.locator(".payProfileTab:not(.payProfileTabMobile) button.profile");
  if (await profile.count()) await profile.click();
  await page.getByRole("button", { name: "Open notifications" }).click();
  await expect(page.getByRole("heading", { name: "Webhook integrations" })).toBeVisible();
  await page.getByLabel("Webhook HTTPS URL").fill(`${origin}/api/notification/staging-receiver/`);
  await page.getByLabel("Webhook signing secret").fill(receiverSecret);
  await page.getByRole("button", { name: "Add webhook" }).click();
  await expect(page.getByText(`${origin}/api/notification/staging-receiver/`)).toBeVisible({ timeout: 10_000 });
  const row = page.locator(".webhook-row").first();
  await row.getByRole("button", { name: "Send test webhook" }).click();
  await expect(page.getByText("Test webhook queued")).toBeVisible({ timeout: 10_000 });
  await row.getByRole("button", { name: "Delivery history" }).click();
  await expect(row.getByText(/Delivered|Pending|Failed/)).toBeVisible({ timeout: 15_000 });
  await row.getByRole("button", { name: "Disable" }).click();
  await expect(row.getByRole("button", { name: "Enable" })).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await row.getByRole("button", { name: "Delete" }).click();
  await expect(row).toBeHidden({ timeout: 10_000 });
});
