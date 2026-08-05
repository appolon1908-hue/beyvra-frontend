import { getSocketUrl } from "utils/env";

export type UnifiedRealtimeMessage = {
  type?: string;
  channel?: string;
  sequence?: number;
  data?: unknown;
  payload?: unknown;
  [key: string]: unknown;
};

type Listener = (message: UnifiedRealtimeMessage) => void;
type TicketFactory = () => Promise<string>;

/** One authenticated socket per browser runtime, with reference-counted subscriptions. */
class UnifiedRealtimeClient {
  private socket: WebSocket | null = null;
  private reconnectTimer: number | undefined;
  private reconnectAttempt = 0;
  private closed = false;
  private connecting = false;
  private readonly listeners = new Map<string, Set<Listener>>();
  private readonly channels = new Set<string>();

  constructor(private readonly ticket: TicketFactory) {}

  subscribe(channel: string, listener: Listener): () => void {
    const channelListeners = this.listeners.get(channel) || new Set<Listener>();
    channelListeners.add(listener);
    this.listeners.set(channel, channelListeners);
    this.channels.add(channel);
    this.closed = false;
    void this.open();
    if (this.socket?.readyState === WebSocket.OPEN) this.send({ action: "subscribe", request_id: crypto.randomUUID(), channels: [channel] });
    return () => {
      const current = this.listeners.get(channel);
      current?.delete(listener);
      if (!current?.size) {
        this.listeners.delete(channel);
        this.channels.delete(channel);
        this.send({ action: "unsubscribe", request_id: crypto.randomUUID(), channels: [channel] });
      }
      if (!this.channels.size) this.close();
    };
  }

  close(): void {
    this.closed = true;
    if (this.reconnectTimer !== undefined) window.clearTimeout(this.reconnectTimer);
    this.reconnectTimer = undefined;
    this.socket?.close(1000, "no_subscribers");
    this.socket = null;
  }

  private async open(): Promise<void> {
    if (this.closed || this.connecting || this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING || !this.channels.size) return;
    this.connecting = true;
    try {
      const wsTicket = await this.ticket();
      if (this.closed || !this.channels.size) return;
      const socket = new WebSocket(getSocketUrl("ws/v1/", { ws_ticket: wsTicket }));
      this.socket = socket;
      socket.onopen = () => {
        this.connecting = false;
        this.reconnectAttempt = 0;
        this.send({ action: "subscribe", request_id: crypto.randomUUID(), channels: [...this.channels] });
        this.dispatch("system.status", { type: "connection", status: "connected" });
      };
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as UnifiedRealtimeMessage;
          const channel = message.channel || "system.status";
          this.dispatch(channel, message);
          if (channel !== "system.status" && message.type?.startsWith("market.")) this.dispatch("market.status", message);
        } catch {
          this.dispatch("system.status", { type: "error", code: "INVALID_MESSAGE" });
        }
      };
      socket.onerror = () => socket.close();
      socket.onclose = () => {
        if (this.socket === socket) this.socket = null;
        this.connecting = false;
        this.dispatch("system.status", { type: "connection", status: "disconnected" });
        if (!this.closed && this.channels.size) {
          const delay = Math.min(30_000, 1_000 * 2 ** this.reconnectAttempt) + Math.floor(Math.random() * 500);
          this.reconnectAttempt += 1;
          this.reconnectTimer = window.setTimeout(() => void this.open(), delay);
        }
      };
    } catch {
      this.connecting = false;
      this.dispatch("system.status", { type: "connection", status: "error" });
      if (!this.closed && this.channels.size) this.reconnectTimer = window.setTimeout(() => void this.open(), 1_000);
    }
  }

  private dispatch(channel: string, message: UnifiedRealtimeMessage): void {
    this.listeners.get(channel)?.forEach((listener) => listener(message));
  }

  private send(message: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(message));
  }
}

let active: { token: string; client: UnifiedRealtimeClient } | undefined;

export function getUnifiedRealtimeClient(token: string, ticket: TicketFactory): UnifiedRealtimeClient {
  if (!active || active.token !== token) {
    active?.client.close();
    active = { token, client: new UnifiedRealtimeClient(ticket) };
  }
  return active.client;
}
