type PlatformEvent =
  | "session_bootstrap"
  | "market_snapshot"
  | "market_feed_reconnect"
  | "order_rejected"
  | "chart_init_failure"
  | "overlay_transition";

const SAFE_KEYS = new Set(["durationMs", "status", "retryCount", "code", "overlay", "symbol", "interval"]);

/** Emits vendor-neutral diagnostics without identifiers, credentials or payload data. */
export function recordPlatformEvent(event: PlatformEvent, metadata: Record<string, unknown> = {}) {
  const safe = Object.fromEntries(Object.entries(metadata).filter(([key, value]) => SAFE_KEYS.has(key) && (typeof value === "string" || typeof value === "number" || typeof value === "boolean")));
  if (import.meta.env.DEV) console.debug(`[platform] ${event}`, safe);
  window.dispatchEvent(new CustomEvent("platform-telemetry", { detail: { event, ...safe } }));
}
