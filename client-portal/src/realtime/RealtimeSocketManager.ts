import { getUnifiedRealtimeClient, UnifiedRealtimeMessage } from "./UnifiedRealtimeClient";

export type RealtimeKind = "market-data" | "news" | "account" | "platform";
export type RealtimeMessage = UnifiedRealtimeMessage;
type Listener = (message: RealtimeMessage) => void;

/** Compatibility facade; socket ownership lives in UnifiedRealtimeClient. */
export class RealtimeSocketManager {
  private unsubscribeHandler?: () => void;
  private readonly listeners = new Set<Listener>();

  constructor(private readonly kind: RealtimeKind, private readonly ticket: () => Promise<string>, private readonly token = "compatibility") {}

  onMessage(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async connect(): Promise<void> {
    const channel = this.kind === "market-data" ? "market.status" : `compat.${this.kind}`;
    const client = getUnifiedRealtimeClient(this.token, this.ticket);
    this.unsubscribeHandler = client.subscribe(channel, (message) => this.listeners.forEach((listener) => listener(message)));
  }

  close(): void {
    this.unsubscribeHandler?.();
    this.unsubscribeHandler = undefined;
  }

  subscribe(channels: unknown[]): void {
    // The unified client owns the subscription registry. This compatibility
    // facade intentionally ignores legacy opaque channel payloads.
    void channels;
  }

  unsubscribe(): void {
    this.close();
  }
}
