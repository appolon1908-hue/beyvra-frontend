import { afterEach, describe, expect, it, vi } from "vitest";
import { beginOidcAuthIfEnabled, beginOidcPasswordResetIfEnabled, isOidcEnabled } from "./oidc";

const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json" },
});

describe("OIDC auth mode helper", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("recognizes supported backend OIDC config shapes", () => {
    expect(isOidcEnabled({ enabled: true })).toBe(true);
    expect(isOidcEnabled({ oidc_enabled: true })).toBe(true);
    expect(isOidcEnabled({ mode: "oidc" })).toBe(true);
    expect(isOidcEnabled({ providers: { oidc: { enabled: true } } })).toBe(true);
    expect(isOidcEnabled({ oidc: { enabled: true } })).toBe(true);
    expect(isOidcEnabled({ enabled: false })).toBe(false);
    expect(isOidcEnabled(null)).toBe(false);
  });

  it("starts OIDC login before local auth when the backend enables it", async () => {
    const assign = vi.fn();
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(response({ enabled: true }))
      .mockResolvedValueOnce(response({ authorizationUrl: "https://idp.example/login" }));
    vi.stubGlobal("fetch", fetch);
    vi.stubGlobal("window", { ...globalThis, location: { assign }, setTimeout, clearTimeout });

    await expect(beginOidcAuthIfEnabled("login")).resolves.toBe(true);

    expect(String(fetch.mock.calls[0][0])).toContain("v1/auth/oidc/config/");
    expect(String(fetch.mock.calls[1][0])).toContain("v1/auth/oidc/login/");
    expect(assign).toHaveBeenCalledWith("https://idp.example/login");
  });

  it("falls back to local auth when OIDC is disabled or unavailable", async () => {
    const fetch = vi.fn().mockResolvedValue(response({ enabled: false }));
    vi.stubGlobal("fetch", fetch);
    vi.stubGlobal("window", { ...globalThis, location: { assign: vi.fn() }, setTimeout, clearTimeout });

    await expect(beginOidcAuthIfEnabled("login")).resolves.toBe(false);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("redirects password reset to the backend identity authority when OIDC is enabled", async () => {
    const assign = vi.fn();
    const fetch = vi.fn().mockResolvedValue(response({ enabled: true, passwordResetAuthority: "keycloak" }));
    vi.stubGlobal("fetch", fetch);
    vi.stubGlobal("window", { ...globalThis, location: { assign }, setTimeout, clearTimeout });

    await expect(beginOidcPasswordResetIfEnabled()).resolves.toBe(true);

    expect(String(fetch.mock.calls[0][0])).toContain("v1/auth/oidc/config/");
    expect(assign).toHaveBeenCalledWith("/api/v1/auth/oidc/password-reset/");
  });
});
