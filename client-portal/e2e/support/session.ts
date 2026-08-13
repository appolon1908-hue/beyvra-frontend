import { expect, type BrowserContext, type Page } from "@playwright/test";

export async function guestAccess(context: BrowserContext, baseURL?: string): Promise<string> {
  const origin = new URL(baseURL ?? "http://127.0.0.1:8080").origin;
  const cookie = (await context.cookies(origin)).find((item) => item.name === "access_token");
  expect(cookie?.value, "global guest storage state must contain an access credential").toBeTruthy();
  return cookie!.value;
}

export async function openGuestPlatform(page: Page): Promise<void> {
  await page.goto("/platform", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".platformWrapper")).toBeVisible({ timeout: 20_000 });
}
