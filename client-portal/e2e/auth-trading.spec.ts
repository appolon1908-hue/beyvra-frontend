import { expect, test } from "@playwright/test";
import { openPaperPlatform, paperSession } from "./support/session";

test("authenticated PAPER account enters the shared workspace without funding eligibility", async ({ page, context, baseURL }) => {
  const { api, headers } = await paperSession(context, baseURL);
  const accounts = await api.get("/api/v1/trading/accounts", {
    headers: { ...headers, "X-Beyvra-Simulation-Mode": "true" },
  });
  expect(accounts.status()).toBe(200);
  const payload = await accounts.json();
  expect(payload.results.length).toBeGreaterThan(0);
  for (const account of payload.results) {
    expect(account).toMatchObject({ execution_mode: "PAPER", funding_enabled: false, withdrawals_enabled: false });
    expect(account.account_id).toBeTruthy();
    expect(typeof account.available).toBe("string");
  }
  await openPaperPlatform(page);
});
