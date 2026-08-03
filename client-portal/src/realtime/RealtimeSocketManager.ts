import { getSocketUrl } from "utils/env";

export type RealtimeKind = "market-data" | "news" | "account" | "platform";
export type RealtimeMessage = { type?: string; sequence?: number; [key: string]: unknown };

type Listener = (message: RealtimeMessage) => void;

export class RealtimeSocketManager {
  private socket: WebSocket | null = null;
  private retryTimer: number | undefined;
  private retryAttempt = 0;
  private closed = false;
  private sequence = 0;
  private subscriptions: unknown[] = [];
  private readonly listeners = new Set<Listener>();

  constructor(private readonly kind: RealtimeKind, private readonly ticket: () => Promise<string>) {}

  onMessage(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async connect(): Promise<void> {
    this.closed = false;
    await this.open();
  }

  close(): void {
    this.closed = true;
    if (this.retryTimer !== undefined) window.clearTimeout(this.retryTimer);
    this.retryTimer = undefined;
    this.socket?.close(1000, "client_closed");
    this.socket = null;
  }

  subscribe(channels: unknown[]): void {
    this.subscriptions = channels;
    this.send({ type: "subscribe", requestId: crypto.randomUUID(), channels });
  }

  unsubscribe(): void {
    this.subscriptions = [];
    this.send({ type: "unsubscribe", requestId: crypto.randomUUID() });
  }

  private async open(): Promise<void> {
    if (this.closed || this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) return;
    const wsTicket = await this.ticket();
    if (this.closed) return;
    const socket = new WebSocket(getSocketUrl(`/ws/v1/${this.kind}`, { ws_ticket: wsTicket }));
    this.socket = socket;
    socket.onopen = () => {
      this.retryAttempt = 0;
      if (this.subscriptions.length) this.subscribe(this.subscriptions);
    };
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as RealtimeMessage;
        if (typeof message.sequence === "number" && message.sequence <= this.sequence) return;
        if (typeof message.sequence === "number") this.sequence = message.sequence;
        this.listeners.forEach((listener) => listener(message));
      } catch {
        this.listeners.forEach((listener) => listener({ type: "error", code: "invalid_message" }));
      }
    };
    socket.onerror = () => socket.close();
    socket.onclose = () => {
      if (this.socket === socket) this.socket = null;
      if (this.closed) return;
      const delay = Math.min(30_000, 1_000 * 2 ** this.retryAttempt) + Math.floor(Math.random() * 500);
      this.retryAttempt += 1;
      this.retryTimer = window.setTimeout(() => void this.open(), delay);
    };
  }

  private send(payload: unknown): void {
    if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(payload));
  }
}
