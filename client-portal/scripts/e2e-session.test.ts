import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FullConfig } from "@playwright/test";

const fixture = vi.hoisted(() => ({
  stat: vi.fn(), get: vi.fn(), dispose: vi.fn(), newContext: vi.fn(),
}));
vi.mock("node:fs/promises", () => ({ stat: fixture.stat }));
vi.mock("@playwright/test", () => ({ request: { newContext: fixture.newContext } }));
import globalSetup from "../e2e/global-setup";

const config = { projects: [{ use: { baseURL: "https://local.example.invalid" } }] } as unknown as FullConfig;
const paper = { state: "user.ready", account: { execution_mode: "PAPER", funding_enabled: false, withdrawals_enabled: false } };

describe("authenticated PAPER E2E preflight", () => {
  beforeEach(() => {
    vi.stubEnv("E2E_PUBLIC_ONLY", "false");
    vi.stubEnv("E2E_STORAGE_STATE", "/private/session.json");
    fixture.stat.mockResolvedValue({ isFile: () => true, mode: 0o100600 });
    fixture.get.mockResolvedValue({ ok: () => true, json: async () => paper });
    fixture.dispose.mockResolvedValue(undefined);
    fixture.newContext.mockResolvedValue({ get: fixture.get, dispose: fixture.dispose });
  });
  afterEach(() => { vi.resetAllMocks(); vi.unstubAllEnvs(); });

  it("reads a normally authenticated PAPER session without issuing credentials", async () => {
    await globalSetup(config);
    expect(fixture.get).toHaveBeenCalledExactlyOnceWith("/api/v1/workspace/bootstrap");
    expect(fixture.newContext).toHaveBeenCalledWith(expect.objectContaining({ storageState: "/private/session.json" }));
    expect(fixture.dispose).toHaveBeenCalledOnce();
  });

  it("refuses missing state before creating any request context", async () => {
    vi.stubEnv("E2E_STORAGE_STATE", "");
    await expect(globalSetup(config)).rejects.toThrow("E2E_STORAGE_STATE");
    expect(fixture.newContext).not.toHaveBeenCalled();
  });

  it("public-only execution never bootstraps an authenticated session", async () => {
    vi.stubEnv("E2E_PUBLIC_ONLY", "true");
    await globalSetup(config);
    expect(fixture.stat).not.toHaveBeenCalled();
    expect(fixture.newContext).not.toHaveBeenCalled();
  });

  it("rejects world-readable session credentials", async () => {
    fixture.stat.mockResolvedValue({ isFile: () => true, mode: 0o100644 });
    await expect(globalSetup(config)).rejects.toThrow("private regular file");
    expect(fixture.newContext).not.toHaveBeenCalled();
  });

  it.each([
    { ...paper, state: "guest.ready" },
    { ...paper, account: { ...paper.account, execution_mode: "LIVE" } },
    { ...paper, account: { ...paper.account, funding_enabled: true } },
    { ...paper, account: { ...paper.account, withdrawals_enabled: "false" } },
    { state: "user.ready" },
  ])("rejects an ineligible account and disposes the API context", async (payload) => {
    fixture.get.mockResolvedValue({ ok: () => true, json: async () => payload });
    await expect(globalSetup(config)).rejects.toThrow("normally authenticated PAPER");
    expect(fixture.dispose).toHaveBeenCalledOnce();
  });

  it("rejects expired authentication without reporting a successful bootstrap", async () => {
    fixture.get.mockResolvedValue({ ok: () => false, status: () => 401 });
    await expect(globalSetup(config)).rejects.toThrow("bootstrap failed (401)");
    expect(fixture.dispose).toHaveBeenCalledOnce();
  });
});
