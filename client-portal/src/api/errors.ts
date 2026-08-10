import { toUserSafeError } from "errors/userSafeError";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code?: string,
    public readonly requestId?: string,
    public readonly correlationId?: string,
  ) {
    super(toUserSafeError({ status, code }).message);
    this.name = "BeyvraApiError";
  }
}

export function getApiErrorMessage(payload: unknown, _fallback?: string): string {
  return toUserSafeError(payload).message;
}
