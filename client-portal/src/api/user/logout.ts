import getEnv from "utils/env";

export async function revokeSession(
  accessToken?: string,
  refreshToken?: string,
): Promise<void> {
  if (!accessToken || !refreshToken) return;

  const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/user/token/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Logout failed with status ${response.status}`);
  }
}
