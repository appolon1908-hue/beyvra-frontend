import { expect, test } from "@playwright/test";

const legacyVisible = /\b(?:Codestra|Tradi|Tradix|Tradx|Tradex|Trading[- ]X|Trade[- ]X)\b|trad(?:e)?x\.(?:com|io)|codestra(?:-ai)?\.(?:com|cloud)/i;

for (const route of ["/", "/signIn", "/signIn?tab=registration", "/markets", "/trading", "/downloads", "/prv"]) {
  test(`public identity is Beyvra on ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("body")).not.toContainText(legacyVisible);
    await expect(page.locator("body")).toContainText(/Beyvra/i);
    await expect(page).toHaveTitle(/Beyvra/i);
  });
}
