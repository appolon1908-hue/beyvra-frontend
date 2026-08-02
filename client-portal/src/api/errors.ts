export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;

  const messages: string[] = [];
  for (const [field, value] of Object.entries(payload)) {
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (typeof item === "string") {
        messages.push(field === "detail" || field === "non_field_errors" ? item : `${field}: ${item}`);
      } else if (item && typeof item === "object") {
        messages.push(getApiErrorMessage(item, fallback));
      }
    }
  }

  return messages.filter(Boolean).join(" ") || fallback;
}
