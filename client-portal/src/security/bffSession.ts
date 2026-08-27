import { getApiUrl } from "utils/env";

export const BFF_SESSION_MARKER = "beyvra-bff-session";
export const BFF_GUEST_MARKER = "beyvra-bff-guest";

export const isBffSessionMarker = (value?: string) =>
  value === BFF_SESSION_MARKER || value === BFF_GUEST_MARKER;

export const isUnsafeMethod = (method?: string) =>
  !["GET", "HEAD", "OPTIONS"].includes((method || "GET").toUpperCase());

let csrfRequest: Promise<string> | null = null;

export const getBffCsrfToken = async (): Promise<string> => {
  if (!csrfRequest) {
    csrfRequest = fetch(getApiUrl("v1/auth/oidc/csrf/"), {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("CSRF_BOOTSTRAP_FAILED");
        const payload = (await response.json()) as { csrfToken?: string };
        if (!payload.csrfToken) throw new Error("CSRF_TOKEN_MISSING");
        return payload.csrfToken;
      })
      .catch((error) => {
        csrfRequest = null;
        throw error;
      });
  }
  return csrfRequest;
};

export const clearBffCsrfToken = () => {
  csrfRequest = null;
};
