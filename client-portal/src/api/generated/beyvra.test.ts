import { afterEach, describe, expect, it, vi } from "vitest";
import { beyvraAuthApi, beyvraDemoApi, beyvraRealtimeV2Api } from "./beyvra";
import { codestraAuthApi, codestraDemoApi, codestraRealtimeV2Api } from "./codestraDemo";

const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json" },
});

describe("generated client compatibility", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("keeps legacy exports as aliases of the canonical Beyvra client", () => {
    expect(beyvraAuthApi).toBe(codestraAuthApi);
    expect(beyvraDemoApi).toBe(codestraDemoApi);
    expect(beyvraRealtimeV2Api).toBe(codestraRealtimeV2Api);
  });

  it("uses the canonical registration endpoint", async () => {
    const fetch = vi.fn().mockResolvedValue(response({ status: "pending_email_verification" }, 202));
    vi.stubGlobal("window", globalThis);
    vi.stubGlobal("fetch", fetch);

    await beyvraAuthApi.register({ email: "user@example.test" });

    expect(String(fetch.mock.calls[0][0])).toContain("v1/auth/register");
    expect(String(fetch.mock.calls[0][0])).not.toContain("v1/auth/create");
  });

  it("exposes the backend-owned OIDC auth endpoints", async () => {
    const fetch = vi.fn().mockResolvedValue(response({ enabled: true, authorizationUrl: "https://idp.example/login" }));
    vi.stubGlobal("window", globalThis);
    vi.stubGlobal("fetch", fetch);

    await beyvraAuthApi.oidcConfig();
    await beyvraAuthApi.oidcLogin({});
    await beyvraAuthApi.oidcRegister({});
    await beyvraAuthApi.oidcLogout();

    const paths = fetch.mock.calls.map(([url]) => String(url));
    expect(paths[0]).toContain("v1/auth/oidc/config/");
    expect(paths[1]).toContain("v1/auth/oidc/login/");
    expect(paths[2]).toContain("v1/auth/oidc/register/");
    expect(paths[3]).toContain("v1/auth/oidc/logout/");
  });

  it("can log out using only backend session cookies", async () => {
    const fetch = vi.fn().mockResolvedValue(response({}));
    vi.stubGlobal("window", globalThis);
    vi.stubGlobal("fetch", fetch);

    await beyvraAuthApi.logout();

    const init = fetch.mock.calls[0][1] as RequestInit;
    expect(String(fetch.mock.calls[0][0])).toContain("v1/auth/token/logout/");
    expect(init.credentials).toBe("include");
    expect(init.body).toBe("{}");
    expect(new Headers(init.headers).has("Authorization")).toBe(false);
  });
});
