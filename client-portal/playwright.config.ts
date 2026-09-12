import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:8080",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "public", testMatch: "public-identity.spec.ts" },
    ...(process.env.E2E_PUBLIC_ONLY === "true" ? [] : [{
      name: "authenticated-paper",
      testIgnore: "public-identity.spec.ts",
      use: { storageState: process.env.E2E_STORAGE_STATE },
    }]),
  ],
  reporter: [["list"], ["html", { open: "never" }]],
});
