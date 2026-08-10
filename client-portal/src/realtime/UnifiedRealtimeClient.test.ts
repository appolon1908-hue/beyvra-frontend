import { describe, expect, it } from "vitest";

import { RealtimeSequenceTracker } from "./UnifiedRealtimeClient";

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
