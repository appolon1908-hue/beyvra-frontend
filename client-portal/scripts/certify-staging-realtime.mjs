import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import WebSocket from "ws";

const baseUrl = process.env.E2E_BASE_URL ?? "https://staging.beyvra.com";
const requested = Number(process.env.WS_CONNECTIONS ?? 520);
const soakSeconds = Number(process.env.WS_SOAK_SECONDS ?? 60);
const rampBatchSize = Number(process.env.WS_RAMP_BATCH_SIZE ?? 20);
const rampDelayMs = Number(process.env.WS_RAMP_DELAY_MS ?? 250);
const output = process.env.WS_EVIDENCE_OUTPUT;

if (!baseUrl.includes("staging") || requested < 500 || soakSeconds < 30) {
  throw new Error("Staging target, at least 500 connections, and at least 30 seconds are required");
}

async function api(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const payload = await response.json();
  if (!response.ok) throw new Error(`${path} returned HTTP ${response.status}`);
  return payload;
}

const session = await api("/api/v1/demo/sessions", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Idempotency-Key": `ws-load-${randomUUID()}` },
  body: "{}",
});
const connection = await api("/api/v1/realtime/v2/connection-token", {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access}` },
  body: "{}",
});

const wsUrl = process.env.WS_URL ?? (baseUrl.replace(/^http/, "ws") + "/ws/v2/connection/websocket");
const sockets = [];
const latencies = [];
const failures = [];

function openClient(index) {
  return new Promise((resolve) => {
    const started = performance.now();
    const socket = new WebSocket(wsUrl, { handshakeTimeout: 15_000 });
    const timer = setTimeout(() => {
      failures.push({ index, category: "timeout" });
      socket.terminate();
      resolve();
    }, 20_000);
    socket.once("open", () => socket.send(JSON.stringify({ id: 1, connect: { token: connection.token } })));
    socket.on("message", (raw) => {
      if (raw.toString().trim() === "{}") {
        socket.send("{}");
        return;
      }
      let message;
      try { message = JSON.parse(raw.toString()); } catch { return; }
      if (message.id === 1 && message.connect) {
        clearTimeout(timer);
        latencies.push(performance.now() - started);
        sockets.push(socket);
        resolve();
      } else if (message.error) {
        clearTimeout(timer);
        failures.push({ index, category: "protocol", code: message.error.code });
        socket.terminate();
        resolve();
      }
    });
    socket.once("error", (error) => {
      clearTimeout(timer);
      failures.push({ index, category: "socket", message: error.message.slice(0, 120) });
      resolve();
    });
  });
}

for (let offset = 0; offset < requested; offset += rampBatchSize) {
  await Promise.all(Array.from({ length: Math.min(rampBatchSize, requested - offset) }, (_, index) => openClient(offset + index)));
  await new Promise((resolve) => setTimeout(resolve, rampDelayMs));
}

const connectedAtStart = sockets.filter((socket) => socket.readyState === WebSocket.OPEN).length;
await new Promise((resolve) => setTimeout(resolve, soakSeconds * 1000));
const connectedAfterSoak = sockets.filter((socket) => socket.readyState === WebSocket.OPEN).length;
sockets.forEach((socket) => socket.close(1000, "certification_complete"));

const sorted = latencies.toSorted((left, right) => left - right);
const percentile = (p) => sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * p))] ?? 0;
const report = {
  schema_version: 1,
  target: baseUrl,
  websocket_target: wsUrl,
  authenticated_principal: "synthetic_guest_demo",
  requested,
  connected_at_start: connectedAtStart,
  connected_after_soak: connectedAfterSoak,
  failures: failures.length,
  failure_samples: failures.slice(0, 10),
  soak_seconds: soakSeconds,
  ramp: { batch_size: rampBatchSize, delay_ms: rampDelayMs },
  latency_ms: { p50: Number(percentile(0.5).toFixed(2)), p95: Number(percentile(0.95).toFixed(2)), p99: Number(percentile(0.99).toFixed(2)) },
  result: connectedAtStart === requested && connectedAfterSoak === requested && failures.length === 0 ? "PASS" : "FAIL",
};
console.log(JSON.stringify(report, null, 2));
if (output) await writeFile(output, JSON.stringify(report, null, 2) + "\n");
if (report.result !== "PASS") process.exitCode = 1;
