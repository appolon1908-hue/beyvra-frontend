import { expect, test, type Page } from "@playwright/test";

const forbidden = /Codestra|ApiError|Exception|Traceback|requestId|request_id|correlationId|\/api\/|psycopg|Redis|NATS|Centrifugo/i;

async function submit(page: Page) {
  await page.goto("/signIn");
  await page.getByLabel("Email").fill("safe-ui@example.test");
  await page.locator("#password").fill("InvalidPassword9!");
  await page.getByRole("button", { name: "Log In" }).click();
}

test("invalid credentials show only the safe 401 contract", async ({ page, context }) => {
  await context.clearCookies();
  await page.route("**/api/v1/auth/login", (route) => route.fulfill({
    status: 401,
    contentType: "application/json",
    headers: { "X-Request-ID": "operator-only-401" },
    body: JSON.stringify({ error: { code: "INVALID_CREDENTIALS", message: "raw", request_id: "operator-only-401", details: { endpoint: "/api/private" } } }),
  }));
  await submit(page);
  const toast = page.locator(".Toastify__toast");
  await expect(toast).toContainText("Unable to sign in");
  await expect(toast).toContainText("Check your email and password and try again.");
  expect(await toast.innerText()).not.toMatch(forbidden);
});

for (const [status, code, title, message] of [
  [408, "REQUEST_TIMEOUT", "Sign-in is taking longer than expected", "Please try again in a moment."],
  [503, "PROVIDER_UNAVAILABLE", "Sign-in temporarily unavailable", "Please try again shortly."],
] as const) test(`status ${status} uses safe auth copy`, async ({ page, context }) => {
  await context.clearCookies();
  await page.route("**/api/v1/auth/login", (route) => route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify({ code, detail: "OperationalError at https://api.internal/api/token", request_id: "hidden-reference" }),
  }));
  await submit(page);
  const toast = page.locator(".Toastify__toast");
  await expect(toast).toContainText(title);
  await expect(toast).toContainText(message);
  expect(await toast.innerText()).not.toMatch(forbidden);
});
