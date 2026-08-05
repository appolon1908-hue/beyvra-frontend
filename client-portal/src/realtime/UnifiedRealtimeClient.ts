import { getSocketUrl } from "utils/env";
import { codestraRealtimeV2Api } from "api/generated/codestraDemo";

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
  private readonly useV2 = import.meta.env.VITE_REALTIME_V2_ENABLED === "true";
  private v2Failed = false;

  constructor(private readonly identityToken: string, private readonly ticket: TicketFactory) {}

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
      const useV2Transport = this.useV2 && !this.v2Failed;
      const wsTicket = useV2Transport
        ? (await codestraRealtimeV2Api.connectionToken(this.identityToken)).token
        : await this.ticket();
      if (this.closed || !this.channels.size) return;
      const socket = useV2Transport
        ? new WebSocket(getSocketUrl("ws/v2/connection/websocket"))
        : new WebSocket(getSocketUrl("ws/v1/", { ws_ticket: wsTicket }));
      this.socket = socket;
      socket.onopen = () => {
        this.connecting = false;
        this.reconnectAttempt = 0;
        if (useV2Transport) {
          void this.sendV2Connect(wsTicket);
        } else {
          this.send({ action: "subscribe", request_id: crypto.randomUUID(), channels: [...this.channels] });
        }
        this.dispatch("system.status", { type: "connection", status: "connected" });
      };
      socket.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data) as Record<string, any>;
          const message = useV2Transport && raw.push
            ? { ...(raw.push.pub?.data || {}), channel: raw.push.channel, type: raw.push.pub?.data?.type || "event" }
            : raw as UnifiedRealtimeMessage;
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
      if (this.useV2 && import.meta.env.VITE_REALTIME_V2_V1_FALLBACK_ENABLED !== "false") this.v2Failed = true;
      this.dispatch("system.status", { type: "connection", status: "error" });
      if (!this.closed && this.channels.size) this.reconnectTimer = window.setTimeout(() => void this.open(), 1_000);
    }
  }

  private async sendV2Connect(connectionToken: string): Promise<void> {
    this.send({ id: 1, connect: { token: connectionToken } });
    for (const channel of this.channels) {
      try {
        // Subscription authorization is performed by the private middleware
        // proxy. Keep the signed token endpoint available for SDK consumers,
        // but do not put bearer material on the wire when proxy auth is enabled.
        await codestraRealtimeV2Api.subscriptionToken(this.tokenForApi(), channel);
        this.send({ id: crypto.randomUUID(), subscribe: { channel, recover: true } });
      } catch {
        this.dispatch("system.status", { type: "error", code: "SUBSCRIPTION_TOKEN_FAILED", channel });
      }
    }
  }

  private tokenForApi(): string {
    // The legacy facade supplies the bearer token as its identity key. V2 token
    // acquisition is only enabled explicitly and remains cookie-authenticated
    // by the shared API client as an additional safeguard.
    return this.identityToken;
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
    active = { token, client: new UnifiedRealtimeClient(token, ticket) };
  }
  return active.client;
}
