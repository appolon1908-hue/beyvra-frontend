import { expect, type BrowserContext, type Page } from "@playwright/test";

export async function paperSession(context: BrowserContext, baseURL?: string) {
  const origin = new URL(baseURL ?? "http://127.0.0.1:8080").origin;
  const bootstrap = await context.request.get(`${origin}/api/v1/workspace/bootstrap`);
  expect(bootstrap.status(), "normal sign-in must provide an authenticated workspace").toBe(200);
  const payload = await bootstrap.json();
  expect(payload.state).toBe("user.ready");
  expect(payload.account).toMatchObject({ execution_mode: "PAPER", funding_enabled: false, withdrawals_enabled: false });
  const response = await context.request.get(`${origin}/api/v1/auth/oidc/csrf/`);
  expect(response.status()).toBe(200);
  const { csrfToken } = await response.json();
  expect(typeof csrfToken).toBe("string");
  expect(csrfToken.length).toBeGreaterThan(0);
  return {
    api: context.request,
    account: payload.account,
    headers: { "X-CSRFToken": csrfToken as string, Origin: origin, Referer: `${origin}/platform` },
  };
}

export async function openPaperPlatform(page: Page): Promise<void> {
  await page.goto("/platform", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".platformWrapper")).toBeVisible({ timeout: 20_000 });
}
