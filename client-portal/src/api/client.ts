import { getApiUrl } from "utils/env";

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export async function authenticatedRequest<T>(
  endpoint: string,
  token: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(getApiUrl(endpoint), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
      ...init.headers,
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(payload.detail || payload.error || "The request could not be completed", response.status);
  }
  return payload as T;
}
