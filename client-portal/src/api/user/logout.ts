import { beyvraAuthApi } from "api/generated/beyvra";
import { fetchOidcConfig, isOidcEnabled } from "api/auth/oidc";

export async function revokeSession(
  accessToken?: string,
  refreshToken?: string,
): Promise<void> {
  const config = await fetchOidcConfig();
  if (isOidcEnabled(config)) {
    await beyvraAuthApi.oidcLogout();
    return;
  }

  await beyvraAuthApi.logout(accessToken, refreshToken);
}
