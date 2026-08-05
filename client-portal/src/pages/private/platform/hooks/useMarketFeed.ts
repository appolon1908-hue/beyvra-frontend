import { useEffect, useRef } from "react";
import { Time } from "lightweight-charts";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";
import { recordPlatformEvent } from "../../../../observability/platformTelemetry";
import { getUnifiedRealtimeClient } from "realtime/UnifiedRealtimeClient";

export type FeedCandle = { time: Time; open: number; high: number; low: number; close: number };

export function useMarketFeed({ token, symbol, interval, enabled = true, onCandle, onState, onError, onSequenceGap }: { token?: string; symbol: string; interval: string; enabled?: boolean; onCandle: (candle: FeedCandle) => void; onState: (state: "connected" | "disconnected" | "error") => void; onError: (message: string) => void; onSequenceGap?: () => void }) {
  const candleRef = useRef(onCandle); const stateRef = useRef(onState); const errorRef = useRef(onError); const sequenceGapRef = useRef(onSequenceGap);
  candleRef.current = onCandle; stateRef.current = onState; errorRef.current = onError; sequenceGapRef.current = onSequenceGap;
  useEffect(() => {
    if (!enabled || !token) return;
    let lastSequence = 0;
    const channel = `market.candle:${symbol}:${interval}`;
    const client = getUnifiedRealtimeClient(token, async () => (await webSocketTicketFetcher(token)).ws_ticket);
    const unsubscribe = client.subscribe(channel, (message) => {
      if (message.type === "market.status.changed") {
        const status = (message.data as Record<string, unknown> | undefined)?.status;
        stateRef.current(status === "connected" ? "connected" : "disconnected");
        return;
      }
      if (typeof message.sequence === "number") {
        if (message.sequence <= lastSequence) return;
        if (lastSequence > 0 && message.sequence > lastSequence + 1) {
          sequenceGapRef.current?.();
          stateRef.current("disconnected");
          errorRef.current("Market data recovery is in progress");
          recordPlatformEvent("market_feed_reconnect", { symbol, interval, status: "sequence_gap" });
        }
        lastSequence = message.sequence;
      }
      if (message.type !== "market.candle.updated") return;
      const data = message.data as Record<string, unknown>;
      candleRef.current({ time: data.time as Time, open: Number(data.open), high: Number(data.high), low: Number(data.low), close: Number(data.close) });
    });
    return unsubscribe;
  }, [token, symbol, interval, enabled]);
}
