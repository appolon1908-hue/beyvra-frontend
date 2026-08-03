import { expect, test } from "@playwright/test";

test("authenticated users can create, test, inspect, disable, and delete a webhook", async ({ page, request, context, baseURL }) => {
  const origin = baseURL ?? "http://127.0.0.1:8080";
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const email = `webhook-ui-${unique}@example.test`;
  const password = "WebhookUi9!";
  const receiverSecret = process.env.STAGING_WEBHOOK_TEST_SECRET ?? "local-webhook-secret-2053";
  const registration = await request.post(`${origin}/api/user/create/`, { data: { email, password, first_name: "Webhook", last_name: "UI", phone_number: `+1${unique.slice(-10)}` } });
  expect(registration.ok()).toBeTruthy();
  const login = await request.post(`${origin}/api/user/token/`, { data: { email, password } });
  expect(login.ok()).toBeTruthy();
  const session = await login.json();
  await context.addCookies([
    { name: "access_token", value: session.access, url: origin },
    { name: "refresh_token", value: session.refresh, url: origin },
  ]);

  await page.goto("/platform", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".platformWrapper")).toBeVisible();
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
