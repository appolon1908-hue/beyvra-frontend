import { expect, test } from "@playwright/test";

test("real financial actions stay disabled and demo actions are explicit", async ({ page }) => {
  await page.goto("/platform");
  await expect(page.getByRole("heading", { name: "Beyvra Demo Platform" })).toBeAttached();
  const body = await page.locator("body").innerText();
  expect(body).not.toMatch(/withdrawal request created|deposit confirmed|transfer successful/i);
});
