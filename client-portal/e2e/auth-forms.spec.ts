import { expect, test } from "@playwright/test";

test("registration enters the server-authoritative OTP state", async ({ page, request, baseURL }) => {
  const origin = baseURL ?? "http://127.0.0.1:8080";
  const email = `form-${Date.now()}@example.test`;
  const registration = await request.post(`${origin}/api/v1/auth/register`, {
    data: { email, password: "FormTrade9!", displayName: "Form Trader", legalAccepted: true, locale: "en" },
  });
  expect(registration.status()).toBe(202);
  const payload = await registration.json();
  expect(payload.status).toBe("pending_email_verification");
  expect(payload.registrationId).toBeTruthy();
  await page.goto("/signIn?tab=registration");
  await expect(page.getByRole("tab", { name: "Registration" })).toBeVisible();
  await expect(page.getByText("Create your demo account")).toBeVisible();
});
