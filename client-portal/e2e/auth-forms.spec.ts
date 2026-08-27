import { expect, test } from "@playwright/test";

test("human auth forms delegate credentials and recovery to Keycloak", async ({ page, request, baseURL }) => {
  const origin = baseURL ?? "http://127.0.0.1:8080";

  await page.goto("/signIn?tab=login");
  await expect(page.getByRole("button", { name: "Continue to secure login" })).toBeVisible();
  await expect(page.locator('input[type="password"]')).toHaveCount(0);

  await page.goto("/signIn?tab=registration");
  await expect(page.getByRole("button", { name: "Continue to secure registration" })).toBeVisible();
  await expect(page.locator('input[name="password"]')).toHaveCount(0);

  const login = await request.get(`${origin}/api/v1/auth/oidc/login/?next=%2Fplatform`, { maxRedirects: 0 });
  expect(login.status()).toBe(302);
  const loginLocation = login.headers().location || "";
  expect(loginLocation).toContain("https://auth.codestra.co/realms/codestra/protocol/openid-connect/auth");
  expect(loginLocation).toContain("code_challenge_method=S256");
  expect(loginLocation).not.toContain("code_verifier=");

  const registration = await request.get(`${origin}/api/v1/auth/oidc/register/?next=%2Fplatform`, { maxRedirects: 0 });
  expect(registration.status()).toBe(302);
  expect(registration.headers().location || "").toContain("/protocol/openid-connect/registrations");

  const recovery = await request.get(`${origin}/api/v1/auth/oidc/password-reset/`, { maxRedirects: 0 });
  expect(recovery.status()).toBe(302);
  expect(recovery.headers().location || "").toContain("kc_action=UPDATE_PASSWORD");
});
