import { beyvraAuthApi } from "api/generated/beyvra";

export async function revokeSession(
  accessToken?: string,
  refreshToken?: string,
): Promise<void> {
  if (!accessToken || !refreshToken) return;

  await beyvraAuthApi.logout(accessToken, refreshToken);
}
