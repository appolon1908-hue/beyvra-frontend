import { beyvraAuthApi } from "api/generated/beyvra";

export type AuthAction = "login" | "register";

export type OidcConfig = {
  enabled?: boolean;
  oidc_enabled?: boolean;
  mode?: string;
  loginUrl?: string;
  login_url?: string;
  registerUrl?: string;
  register_url?: string;
  registrationUrl?: string;
  registration_url?: string;
  providers?: {
    oidc?: { enabled?: boolean };
    google?: { enabled?: boolean };
  };
  oidc?: {
    enabled?: boolean;
    loginUrl?: string;
    login_url?: string;
    registerUrl?: string;
    register_url?: string;
    registrationUrl?: string;
    registration_url?: string;
  };
};

type OidcStartResponse = {
  authorizationUrl?: string;
  authorization_url?: string;
  redirectUrl?: string;
  redirect_url?: string;
  url?: string;
  code?: string;
};

export function isOidcEnabled(config: OidcConfig | null | undefined): boolean {
  return Boolean(
    config?.enabled === true ||
    config?.oidc_enabled === true ||
    config?.mode === "oidc" ||
    config?.providers?.oidc?.enabled === true ||
    config?.oidc?.enabled === true,
  );
}

function configuredRedirectUrl(config: OidcConfig, action: AuthAction): string | undefined {
  if (action === "register") {
    return (
      config.registerUrl ||
      config.register_url ||
      config.registrationUrl ||
      config.registration_url ||
      config.oidc?.registerUrl ||
      config.oidc?.register_url ||
      config.oidc?.registrationUrl ||
      config.oidc?.registration_url
    );
  }

  return config.loginUrl || config.login_url || config.oidc?.loginUrl || config.oidc?.login_url;
}

function responseRedirectUrl(result: OidcStartResponse): string | undefined {
  return result.authorizationUrl || result.authorization_url || result.redirectUrl || result.redirect_url || result.url;
}

export async function fetchOidcConfig(): Promise<OidcConfig | null> {
  try {
    return await beyvraAuthApi.oidcConfig<OidcConfig>();
  } catch {
    return null;
  }
}

export async function beginOidcAuthIfEnabled(action: AuthAction, legalAccepted = false): Promise<boolean> {
  const config = await fetchOidcConfig();
  if (!isOidcEnabled(config)) return false;

  const configuredUrl = configuredRedirectUrl(config!, action);
  if (configuredUrl) {
    window.location.assign(configuredUrl);
    return true;
  }

  const body = {
    action,
    legalConfirmed: action === "register" ? legalAccepted : false,
    returnPath: "/platform",
  };
  const result =
    action === "register"
      ? await beyvraAuthApi.oidcRegister<OidcStartResponse>(body)
      : await beyvraAuthApi.oidcLogin<OidcStartResponse>(body);
  const redirectUrl = responseRedirectUrl(result);
  if (!redirectUrl) throw new Error(result.code || "OIDC_AUTH_FAILED");
  window.location.assign(redirectUrl);
  return true;
}
