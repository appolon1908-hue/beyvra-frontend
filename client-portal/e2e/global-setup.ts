import { request, type FullConfig } from "@playwright/test";
import { stat } from "node:fs/promises";

export default async function globalSetup(config: FullConfig) {
  if (process.env.E2E_PUBLIC_ONLY === "true") return;
  const storageState = process.env.E2E_STORAGE_STATE;
  if (!storageState) throw new Error("E2E_STORAGE_STATE must reference an authenticated PAPER test session captured through normal sign-in");
  const metadata = await stat(storageState);
  if (!metadata.isFile() || (metadata.mode & 0o077) !== 0) {
    throw new Error("Authenticated E2E session state must be a private regular file (0600 or 0400)");
  }
  const baseURL = config.projects[0]?.use.baseURL ?? process.env.E2E_BASE_URL ?? "http://127.0.0.1:8080";
  const context = await request.newContext({ baseURL, storageState, timeout: 10_000 });
  try {
    const response = await context.get("/api/v1/workspace/bootstrap");
    if (!response.ok()) throw new Error(`Authenticated PAPER bootstrap failed (${response.status()})`);
    const payload = await response.json();
    if (payload.state !== "user.ready" || payload.account?.execution_mode !== "PAPER" ||
        payload.account.funding_enabled !== false || payload.account.withdrawals_enabled !== false) {
      throw new Error("E2E requires a normally authenticated PAPER account with financial effects disabled");
    }
  } finally {
    await context.dispose();
  }
}
