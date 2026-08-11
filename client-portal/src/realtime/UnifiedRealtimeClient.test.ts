import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const realtimeApi = vi.hoisted(() => ({
  connectionToken: vi.fn(async () => ({ token: "synthetic-connection-token" })),
  subscriptionToken: vi.fn(async () => ({ token: "synthetic-subscription-token" })),
}));

vi.mock("api/generated/beyvra", () => ({ beyvraRealtimeV2Api: realtimeApi }));
vi.mock("utils/env", () => ({ getSocketUrl: (path: string) => `ws://staging.invalid/${path}` }));

import { RealtimeSequenceTracker, UnifiedRealtimeClient } from "./UnifiedRealtimeClient";

class FakeWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 3;
  static instances: FakeWebSocket[] = [];

  readyState = FakeWebSocket.CONNECTING;
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  onclose: (() => void) | null = null;
  sent: string[] = [];

  constructor(readonly url: string) {
    FakeWebSocket.instances.push(this);
  }

  open(): void {
    this.readyState = FakeWebSocket.OPEN;
    this.onopen?.();
  }

  message(payload: unknown): void {
    this.onmessage?.({ data: JSON.stringify(payload) });
  }

  send(payload: string): void {
    this.sent.push(payload);
  }

  close(): void {
    this.readyState = FakeWebSocket.CLOSED;
    this.onclose?.();
  }
}

const settle = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(Math, "random").mockReturnValue(0);
  FakeWebSocket.instances = [];
  realtimeApi.connectionToken.mockClear();
  realtimeApi.subscriptionToken.mockClear();
  Object.assign(globalThis, { window: globalThis, WebSocket: FakeWebSocket });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("RealtimeSequenceTracker", () => {
  it("detects a gap that requires canonical REST snapshot recovery", () => {
    const tracker = new RealtimeSequenceTracker();
    expect(tracker.observe("orders", 41)).toBeUndefined();
    expect(tracker.observe("orders", 42)).toBeUndefined();
    expect(tracker.observe("orders", 45)).toEqual({ expected: 43, received: 45 });
  });

  it("tracks channels independently and tolerates duplicate delivery", () => {
    const tracker = new RealtimeSequenceTracker();
    expect(tracker.observe("orders", 7)).toBeUndefined();
    expect(tracker.observe("orders", 7)).toBeUndefined();
    expect(tracker.observe("wallet", 100)).toBeUndefined();
    expect(tracker.observe("orders", 8)).toBeUndefined();
  });
});

describe("UnifiedRealtimeClient recovery", () => {
  it("reconnects with a fresh server-issued connection token", async () => {
    const client = new UnifiedRealtimeClient("synthetic-identity", async () => "legacy-ticket");
    const unsubscribe = client.subscribe("market.quote:BTC-USD", vi.fn());
    await settle();

    expect(FakeWebSocket.instances).toHaveLength(1);
    FakeWebSocket.instances[0].open();
    FakeWebSocket.instances[0].close();
    await vi.advanceTimersByTimeAsync(1_000);
    await settle();

    expect(FakeWebSocket.instances).toHaveLength(2);
    expect(realtimeApi.connectionToken).toHaveBeenCalledTimes(2);
    unsubscribe();
  });

  it("recovers a canonical snapshot before dispatching the event after a gap", async () => {
    const received: Array<Record<string, unknown>> = [];
    const recover = vi.fn(async () => ({ type: "snapshot.recovered", sequence: 2, data: { price: "100" } }));
    const client = new UnifiedRealtimeClient("synthetic-identity", async () => "legacy-ticket");
    const unsubscribe = client.subscribe(
      "market.quote:BTC-USD",
      (message) => received.push(message),
      recover,
    );
    await settle();

    const socket = FakeWebSocket.instances[0];
    socket.open();
    socket.message({ channel: "market.quote:BTC-USD", sequence: 1, type: "market.quote.updated" });
    socket.message({ channel: "market.quote:BTC-USD", sequence: 3, type: "market.quote.updated" });
    await settle();

    expect(recover).toHaveBeenCalledTimes(1);
    expect(received.map((message) => message.sequence)).toEqual([1, 2, 3]);
    expect(received[1]).toMatchObject({ type: "snapshot.recovered", channel: "market.quote:BTC-USD" });
    unsubscribe();
  });
});
