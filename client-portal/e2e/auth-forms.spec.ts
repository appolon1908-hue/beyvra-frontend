import { expect, test } from "@playwright/test";

test("registers, starts the walkthrough, and enters the platform", async ({ page }) => {
  const unique = Date.now();
  const email = `form-${unique}@example.test`;
  const password = "FormTrade9!";

  await page.goto("/signIn");
  await page.getByRole("tab", { name: "Registration" }).click();
  const registration = page.locator(".ant-tabs-tabpane-active");

  await registration.getByPlaceholder("First Name").fill("Form");
  await registration.getByPlaceholder("Last Name").fill("Trader");
  await registration.getByPlaceholder("Email").fill(email);
  await registration.getByPlaceholder("Phone number").fill(`555${String(unique).slice(-7)}`);
  await registration.getByPlaceholder("Password", { exact: true }).fill(password);
  await registration.getByPlaceholder("Confirm password").fill(password);
  await registration.getByText("I confirm that I am of legal age").click();
  await registration.getByRole("button", { name: "Register" }).click();

  await expect(page).toHaveURL(/\/walkThrough$/);
  await expect(page.getByText("Welcome!", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Skip training" }).click();
  await expect(page).toHaveURL(/\/platform$/);
  await expect(page.context().cookies()).resolves.toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "access_token", secure: true }),
      expect.objectContaining({ name: "refresh_token", secure: true }),
    ]),
  );
});
