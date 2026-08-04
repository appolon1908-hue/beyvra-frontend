import { codestraAuthApi } from "api/generated/codestraDemo";

export async function revokeSession(
  accessToken?: string,
  refreshToken?: string,
): Promise<void> {
  if (!accessToken || !refreshToken) return;

  await codestraAuthApi.logout(accessToken, refreshToken);
}
