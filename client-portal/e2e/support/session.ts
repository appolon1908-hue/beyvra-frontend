import { expect, type BrowserContext, type Page } from "@playwright/test";

export async function expectGuestSession(context: BrowserContext, baseURL?: string): Promise<void> {
  const origin = new URL(baseURL ?? "http://127.0.0.1:8080").origin;
  const cookie = (await context.cookies(origin)).find((item) => item.name === "codestra_guest_session");
  expect(cookie?.value, "global guest storage state must contain the backend guest session cookie").toBeTruthy();
}

export async function openGuestPlatform(page: Page): Promise<void> {
  await page.goto("/platform", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".platformWrapper")).toBeVisible({ timeout: 20_000 });
}
