import { describe, expect, it } from "vitest";

import {
  privateUserChannel,
  realtimeV2SocketPath,
  RealtimeSequenceTracker,
} from "./UnifiedRealtimeClient";

describe("realtime V2 public transport", () => {
  it("uses the public proxy route and leaves the Centrifugo rewrite to nginx", () => {
    expect(realtimeV2SocketPath).toBe("ws/v2/");
    expect(realtimeV2SocketPath).not.toContain("connection/websocket");
  });
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

describe("privateUserChannel", () => {
  it("derives a private channel from JWT identity without treating it as authorization", () => {
    const payload = btoa(JSON.stringify({ user_id: "42" })).replace(/=/g, "");
    expect(privateUserChannel("notification", `header.${payload}.signature`)).toBe("notification.42");
  });

  it("rejects opaque and malformed identity tokens", () => {
    expect(privateUserChannel("notification", "opaque-token")).toBeUndefined();
  });
});
