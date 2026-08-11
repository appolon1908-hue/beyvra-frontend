import { describe, expect, it } from "vitest";

import { RealtimeSequenceTracker } from "./UnifiedRealtimeClient";

describe("RealtimeSequenceTracker", () => {
  it("detects a gap that requires canonical REST snapshot recovery", () => {
    const tracker = new RealtimeSequenceTracker();
    expect(tracker.observe("orders", 41)).toEqual({ status: "APPLIED", sequence: 41 });
    expect(tracker.observe("orders", 42)).toEqual({ status: "APPLIED", sequence: 42 });
    expect(tracker.observe("orders", 45)).toEqual({ status: "GAP", expected: 43, received: 45 });
    expect(tracker.observe("orders", 43)).toEqual({ status: "APPLIED", sequence: 43 });
  });

  it("tracks channels independently and tolerates duplicate delivery", () => {
    const tracker = new RealtimeSequenceTracker();
    expect(tracker.observe("orders", 7).status).toBe("APPLIED");
    expect(tracker.observe("orders", 7).status).toBe("DUPLICATE_OR_STALE");
    expect(tracker.observe("wallet", 100).status).toBe("APPLIED");
    expect(tracker.observe("orders", 8).status).toBe("APPLIED");
  });

  it("replaces state from a canonical snapshot without accepting rollback", () => {
    const tracker = new RealtimeSequenceTracker();
    tracker.observe("wallet", 10);
    expect(tracker.observe("wallet", 13).status).toBe("GAP");
    tracker.replaceFromSnapshot("wallet", 12);
    expect(tracker.observe("wallet", 13)).toEqual({ status: "APPLIED", sequence: 13 });
    expect(() => tracker.replaceFromSnapshot("wallet", 11)).toThrow("STALE_SNAPSHOT_SEQUENCE");
  });
});
