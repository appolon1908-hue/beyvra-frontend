import { beforeEach, describe, expect, it, vi } from "vitest";
import { enterpriseApi } from "api/enterprise";

vi.mock("utils/env", () => ({ getApiUrl: (path: string) => `/api/${path.replace(/^\//, "")}` }));
vi.mock("security/bffSession", async () => {
  const actual = await vi.importActual<typeof import("security/bffSession")>("security/bffSession");
  return { ...actual, getBffCsrfToken: vi.fn().mockResolvedValue("csrf-test") };
});

describe("enterprise API BFF boundary", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(globalThis, "navigator", { configurable: true, value: { onLine: true } });
  });

  it("uses same-origin cookies without a browser bearer token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }));
    vi.stubGlobal("fetch", fetchMock);

    await enterpriseApi.watchlists();

    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0];
    expect(init.credentials).toBe("include");
    expect(new Headers(init.headers).has("Authorization")).toBe(false);
  });

  it("blocks offline mutations before they can reach the API", async () => {
    Object.defineProperty(globalThis, "navigator", { configurable: true, value: { onLine: false } });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    let blocked: unknown;
    try {
      enterpriseApi.createWatchlist("Primary");
    } catch (error) {
      blocked = error;
    }
    expect(blocked).toMatchObject({ code: "OFFLINE_MUTATION_BLOCKED" });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

