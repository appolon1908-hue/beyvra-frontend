import { useEffect, useRef } from "react";
import { Time } from "lightweight-charts";
import { getSocketUrl } from "utils/env";
import { webSocketTicketFetcher } from "api/user/useWebSocketTicket";
import { recordPlatformEvent } from "../../../../observability/platformTelemetry";

export type FeedCandle = { time: Time; open: number; high: number; low: number; close: number };

export function useMarketFeed({ token, symbol, interval, enabled = true, onCandle, onState, onError, onSequenceGap }: { token?: string; symbol: string; interval: string; enabled?: boolean; onCandle: (candle: FeedCandle) => void; onState: (state: "connected" | "disconnected" | "error") => void; onError: (message: string) => void; onSequenceGap?: () => void }) {
  const candleRef = useRef(onCandle); const stateRef = useRef(onState); const errorRef = useRef(onError); const sequenceGapRef = useRef(onSequenceGap);
  candleRef.current = onCandle; stateRef.current = onState; errorRef.current = onError; sequenceGapRef.current = onSequenceGap;
  useEffect(() => {
    let disposed = false; let socket: WebSocket | undefined; let retryTimer: ReturnType<typeof setTimeout> | undefined; let retries = 0; let connecting = false; let lastSequence = 0;
    const connect = async () => {
      if (disposed || connecting || !enabled || !token || socket?.readyState === WebSocket.OPEN || socket?.readyState === WebSocket.CONNECTING) return;
      connecting = true;
      try {
        const { ws_ticket } = await webSocketTicketFetcher(token);
        if (disposed) return;
        socket = new WebSocket(getSocketUrl("ws/v1/", { ws_ticket }));
      } catch (error) {
        if (disposed) return;
        connecting = false; retries += 1; recordPlatformEvent("market_feed_reconnect", { symbol, interval, retryCount: retries, status: "ticket_error" }); stateRef.current("error"); errorRef.current(error instanceof Error ? error.message : "Live market access is unavailable");
        retryTimer = setTimeout(() => void connect(), Math.min(1000 * 2 ** retries, 30_000)); return;
      }
      connecting = false;
      if (!socket) return;
      socket.onopen = () => {
        retries = 0;
        stateRef.current("connected");
        socket?.send(JSON.stringify({ action: "subscribe", request_id: crypto.randomUUID(), channels: [`market.candle:${symbol}:${interval}`] }));
      };
      socket.onclose = () => { if (!disposed) { retries += 1; recordPlatformEvent("market_feed_reconnect", { symbol, interval, retryCount: retries, status: "closed" }); stateRef.current("disconnected"); retryTimer = setTimeout(() => void connect(), Math.min(1000 * 2 ** retries, 30_000)); } };
      socket.onerror = () => stateRef.current("disconnected");
      socket.onmessage = (event) => {
        let message: Record<string, unknown>;
        try { message = JSON.parse(event.data) as Record<string, unknown>; } catch { stateRef.current("error"); errorRef.current("The market feed returned an invalid response"); return; }
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
          }
          lastSequence = message.sequence;
        }
        if (message.type !== "market.candle.updated") return;
        const data = message.data as Record<string, unknown>;
        candleRef.current({ time: data.time as Time, open: Number(data.open), high: Number(data.high), low: Number(data.low), close: Number(data.close) });
      };
    };
    void connect();
    return () => { disposed = true; if (retryTimer) clearTimeout(retryTimer); socket?.close(); };
  }, [token, symbol, interval, enabled]);
}
