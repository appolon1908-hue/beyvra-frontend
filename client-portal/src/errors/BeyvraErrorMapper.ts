import { ErrorContext, UserSafeError, toUserSafeError, toUserSafeErrorText } from "./userSafeError";

/** The only boundary chart UI may use to turn failures into user-visible text. */
export class BeyvraErrorMapper {
  static map(error: unknown, context: ErrorContext = "market"): UserSafeError {
    return toUserSafeError(error, context);
  }

  static text(error: unknown, context: ErrorContext = "market"): string {
    return toUserSafeErrorText(error, context);
  }

  static marketState(error: unknown): "provider-unavailable" | "error" {
    const value = error && typeof error === "object" ? error as { code?: string; status?: number } : {};
    return value.code === "PROVIDER_UNAVAILABLE" || [502, 503, 504].includes(value.status ?? 0)
      ? "provider-unavailable"
      : "error";
  }
}
