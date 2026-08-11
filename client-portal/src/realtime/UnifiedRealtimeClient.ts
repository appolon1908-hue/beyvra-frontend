import { getSocketUrl } from "utils/env";
import { beyvraRealtimeV2Api } from "api/generated/beyvra";

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
type SnapshotRecovery = () => Promise<UnifiedRealtimeMessage | void>;

export type SequenceObservation =
  | { status: "UNSEQUENCED" }
  | { status: "APPLIED"; sequence: number }
  | { status: "DUPLICATE_OR_STALE"; sequence: number }
  | { status: "GAP"; expected: number; received: number };

export class RealtimeSequenceTracker {
  private readonly sequences = new Map<string, number>();

  observe(channel: string, sequence?: number): SequenceObservation {
    if (typeof sequence !== "number" || !Number.isSafeInteger(sequence) || sequence < 0) return { status: "UNSEQUENCED" };
    const previous = this.sequences.get(channel);
    if (previous === undefined) {
      this.sequences.set(channel, sequence);
      return { status: "APPLIED", sequence };
    }
    if (sequence <= previous) return { status: "DUPLICATE_OR_STALE", sequence };
    if (sequence > previous + 1) return { status: "GAP", expected: previous + 1, received: sequence };
    this.sequences.set(channel, sequence);
    return { status: "APPLIED", sequence };
  }

  replaceFromSnapshot(channel: string, sequence: number): void {
    if (!Number.isSafeInteger(sequence) || sequence < 0) throw new Error("INVALID_SNAPSHOT_SEQUENCE");
    const previous = this.sequences.get(channel);
    if (previous !== undefined && sequence < previous) throw new Error("STALE_SNAPSHOT_SEQUENCE");
    this.sequences.set(channel, sequence);
  }

  clear(channel: string): void {
    this.sequences.delete(channel);
  }
}

/** One authenticated socket per browser runtime, with reference-counted subscriptions. */
export class UnifiedRealtimeClient {
  private socket: WebSocket | null = null;
  private reconnectTimer: number | undefined;
  private reconnectAttempt = 0;
  private closed = false;
  private connecting = false;
  private readonly listeners = new Map<string, Set<Listener>>();
  private readonly channels = new Set<string>();
  private readonly recovery = new Map<string, SnapshotRecovery>();
  private readonly recoveryInFlight = new Map<string, Promise<UnifiedRealtimeMessage | void>>();
  private readonly sequenceTracker = new RealtimeSequenceTracker();
  private readonly useV2 = import.meta.env.VITE_REALTIME_V2_ENABLED !== "false";
  private v2Failed = false;

  constructor(private readonly identityToken: string, private readonly ticket: TicketFactory) {}

  subscribe(channel: string, listener: Listener, recoverSnapshot?: SnapshotRecovery): () => void {
    const channelListeners = this.listeners.get(channel) || new Set<Listener>();
    channelListeners.add(listener);
    this.listeners.set(channel, channelListeners);
    this.channels.add(channel);
    if (recoverSnapshot) this.recovery.set(channel, recoverSnapshot);
    this.closed = false;
    void this.open();
    if (this.socket?.readyState === WebSocket.OPEN) this.send({ action: "subscribe", request_id: crypto.randomUUID(), channels: [channel] });
    return () => {
      const current = this.listeners.get(channel);
      current?.delete(listener);
      if (!current?.size) {
        this.listeners.delete(channel);
        this.channels.delete(channel);
        this.recovery.delete(channel);
        this.sequenceTracker.clear(channel);
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
        ? (await beyvraRealtimeV2Api.connectionToken(this.identityToken)).token
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
          void this.dispatchWithRecovery(channel, message);
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
          this.dispatch("system.status", { type: "connection", status: "reconnecting", attempt: this.reconnectAttempt, delay });
          this.reconnectTimer = window.setTimeout(() => void this.open(), delay);
        }
      };
    } catch {
      this.connecting = false;
      if (this.useV2 && import.meta.env.VITE_REALTIME_V2_V1_FALLBACK_ENABLED === "true") this.v2Failed = true;
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
        await beyvraRealtimeV2Api.subscriptionToken(this.tokenForApi(), channel);
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

  private async dispatchWithRecovery(channel: string, message: UnifiedRealtimeMessage): Promise<void> {
    let observation = this.sequenceTracker.observe(channel, message.sequence);
    if (observation.status === "DUPLICATE_OR_STALE") return;
    if (observation.status === "GAP") {
      this.dispatch("system.status", { type: "sequence.gap", channel, expected: observation.expected, received: observation.received });
      const recover = this.recovery.get(channel);
      if (!recover) return;
      let pending = this.recoveryInFlight.get(channel);
      if (!pending) {
        pending = recover().finally(() => this.recoveryInFlight.delete(channel));
        this.recoveryInFlight.set(channel, pending);
      }
      let snapshot: UnifiedRealtimeMessage | void;
      try {
        snapshot = await pending;
      } catch {
        this.dispatch("system.status", { type: "error", code: "SNAPSHOT_RECOVERY_FAILED", channel });
        return;
      }
      if (!snapshot || typeof snapshot.sequence !== "number") {
        this.dispatch("system.status", { type: "error", code: "SNAPSHOT_RECOVERY_FAILED", channel });
        return;
      }
      try {
        this.sequenceTracker.replaceFromSnapshot(channel, snapshot.sequence);
      } catch {
        this.dispatch("system.status", { type: "error", code: "STALE_SNAPSHOT", channel });
        return;
      }
      this.dispatch(channel, { ...snapshot, type: snapshot.type || "snapshot.recovered", channel });
      observation = this.sequenceTracker.observe(channel, message.sequence);
      if (observation.status === "DUPLICATE_OR_STALE") return;
      if (observation.status === "GAP") {
        this.dispatch("system.status", { type: "sequence.gap", channel, expected: observation.expected, received: observation.received });
        return;
      }
    }
    this.dispatch(channel, message);
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
