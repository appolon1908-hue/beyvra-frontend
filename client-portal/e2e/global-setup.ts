import { request, type FullConfig } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0]?.use.baseURL ?? process.env.E2E_BASE_URL ?? "http://127.0.0.1:8080";
  const context = await request.newContext({ baseURL, timeout: 10_000 });
  try {
    const storagePath = path.resolve("test-results/storage/guest.json");
    await fs.mkdir(path.dirname(storagePath), { recursive: true });
    if (process.env.E2E_SKIP_GUEST_BOOTSTRAP === "true") {
      await context.storageState({ path: storagePath });
      return;
    }
    const response = await context.post("/api/v1/demo/sessions", {
      headers: { "Idempotency-Key": `playwright-global-${Date.now()}` },
      data: {},
    });
    if (!response.ok()) {
      throw new Error(`Guest session bootstrap failed (${response.status()}) at ${baseURL}`);
    }
    const payload = await response.json() as { access?: string };
    if (!payload.access) throw new Error("Guest session response did not contain an access credential");
    const origin = new URL(baseURL).origin;
    await fs.writeFile(storagePath, JSON.stringify({ cookies: [
      { name: "access_token", value: payload.access, domain: new URL(origin).hostname, path: "/", expires: -1, httpOnly: false, secure: origin.startsWith("https:"), sameSite: "Strict" },
      { name: "codestra_guest_session", value: payload.access, domain: new URL(origin).hostname, path: "/", expires: -1, httpOnly: false, secure: origin.startsWith("https:"), sameSite: "Strict" },
    ], origins: [] }));
  } catch (error) {
    throw new Error(`Playwright auth setup failed for ${baseURL}: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await context.dispose();
  }
}
