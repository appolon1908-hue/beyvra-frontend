import { beyvraAuthApi } from "api/generated/beyvra";
import { clearBffCsrfToken } from "security/bffSession";

export async function revokeSession(): Promise<string> {
  const result = await beyvraAuthApi.logout();
  clearBffCsrfToken();
  return result.logoutUrl;
}
