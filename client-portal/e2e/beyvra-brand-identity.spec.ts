import { expect, test } from "@playwright/test";
import { openPaperPlatform } from "./support/session";

test("authenticated PAPER platform has no visible legacy identity", async ({ page }) => {
  await openPaperPlatform(page);
  await expect(page.locator("body")).not.toContainText(/\b(?:Tradi|Tradix|Tradx|Tradex)\b/i);
});
