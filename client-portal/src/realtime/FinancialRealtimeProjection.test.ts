import { describe, expect, it, vi } from "vitest";

import { financialPrivateChannel, FINANCIAL_REALTIME_TOPICS, subscribeFinancialProjection } from "./FinancialRealtimeProjection";

describe("financial realtime projection", () => {
  it("uses only the authenticated subject in every private channel", () => {
    for (const topic of Object.keys(FINANCIAL_REALTIME_TOPICS) as Array<keyof typeof FINANCIAL_REALTIME_TOPICS>) {
      expect(financialPrivateChannel(topic, 42)).toBe(`${topic}:42`);
    }
    expect(() => financialPrivateChannel("wallet.updated.v1", 0)).toThrow("INVALID_AUTHENTICATED_SUBJECT");
  });

  it("registers canonical REST recovery without opening or mutating financial state", () => {
    const subscribe = vi.fn((_channel: string, _listener: unknown, _recover?: unknown) => vi.fn());
    const client = { subscribe } as any;
    const listener = vi.fn();
    const unsubscribe = subscribeFinancialProjection(client, "withdrawal.updated.v1", 42, "identity", listener);
    expect(subscribe).toHaveBeenCalledOnce();
    expect(subscribe.mock.calls[0][0]).toBe("withdrawal.updated.v1:42");
    expect(typeof subscribe.mock.calls[0][2]).toBe("function");
    expect(unsubscribe).toBeTypeOf("function");
  });
});
