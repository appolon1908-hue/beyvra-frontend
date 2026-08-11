import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function mockFinancialBoundary(page: import("@playwright/test").Page) {
  await page.route("**/api/v1/session", (route) => route.fulfill({ json: { state: "guest.ready" } }));
  await page.route("**/api/v1/features", (route) => route.fulfill({ json: {
    REAL_WALLET_READ_ENABLED: false,
    REAL_DEPOSITS_ENABLED: false,
    REAL_WITHDRAWALS_ENABLED: false,
    REAL_INTERNAL_TRANSFERS_ENABLED: false,
    REAL_MONEY_ENABLED: false,
  } }));
  await page.route("**/api/v1/compliance/profile", (route) => route.fulfill({ json: {
    status: "PENDING", deposit_eligible: false, withdrawal_eligible: false, transfer_eligible: false,
  } }));
  await page.route("**/api/v1/compliance/requirements", (route) => route.fulfill({ json: [
    { code: "KYC_REQUIRED" }, { code: "COMPLIANCE_REVIEW_REQUIRED" },
    { code: "STEP_UP_REQUIRED" }, { code: "DESTINATION_COOLDOWN" },
  ] }));
}

test.beforeEach(async ({ page }, testInfo) => {
  const baseURL = String(testInfo.project.use.baseURL || "http://127.0.0.1:8080");
  await page.context().addCookies([{ name: "access_token", value: "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJndWVzdF9kZW1vIjp0cnVlLCJleHAiOjQxMDI0NDQ4MDB9.fixture", url: baseURL }]);
  await mockFinancialBoundary(page);
});

test("wallet page is fail-closed and never fabricates a real balance", async ({ page }) => {
  await page.goto("/platform/wallet");
  await expect(page.getByRole("heading", { name: "Wallet", exact: true })).toBeVisible();
  await expect(page.getByText("Real-money services are unavailable")).toBeVisible();
  await expect(page.getByText("Virtual funds stay separate")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/real balance|available 0\.00|deposit confirmed/i);
});

test("deposit, withdrawal, transfer, compliance, step-up and cooldown UX are explicit", async ({ page }) => {
  await page.goto("/platform/funding");
  await expect(page.getByRole("heading", { name: "Deposit, withdraw & transfer" })).toBeVisible();
  await expect(page.getByText("Deposits are not currently available.")).toBeAttached();
  await expect(page.getByRole("button", { name: "Create deposit instructions" })).toBeDisabled();
  await page.getByRole("tab", { name: "Withdraw" }).click();
  await expect(page.getByRole("button", { name: "Review withdrawal" })).toBeDisabled();
  await expect(page.getByText("Recent multi-factor verification", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "Transfer" }).click();
  await expect(page.getByRole("button", { name: "Review transfer" })).toBeDisabled();
  await expect(page.getByText(/Identity verification is required/i)).toBeVisible();
  await expect(page.getByText(/security cooldown ends/i)).toBeVisible();
  const body = await page.locator("body").innerText();
  expect(body).not.toMatch(/polygon oms|provider_customer_id|provider_wallet_id|provider_transaction_id|request id|webhook|mTLS|financial-service/i);
});

test("money activity remains empty and disabled without canonical backend history", async ({ page }) => {
  await page.goto("/platform/activity");
  await expect(page.getByRole("heading", { name: "Money activity", exact: true })).toBeVisible();
  await expect(page.getByText("Real money activity")).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/completed|credited|successful/i);
});

for (const viewport of [
  { width: 375, height: 812 }, { width: 768, height: 1024 },
  { width: 1024, height: 768 }, { width: 1440, height: 900 },
]) {
  test(`money movement is responsive at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const path of ["/platform/wallet", "/platform/funding", "/platform/activity"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow, `${path} overflowed at ${viewport.width}px`).toBeFalsy();
    }
  });
}

test("wallet and funding pages meet automated accessibility checks", async ({ page }) => {
  for (const [path, heading] of [
    ["/platform/wallet", "Wallet"],
    ["/platform/funding", "Deposit, withdraw & transfer"],
    ["/platform/activity", "Money activity"],
  ] as const) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
    expect(results.violations, `${path}: ${JSON.stringify(results.violations)}`).toEqual([]);
  }
});
