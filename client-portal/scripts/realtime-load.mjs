import { stat } from "node:fs/promises";
import { request } from "@playwright/test";
import WebSocket from "ws";

function integer(name, fallback, maximum) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isSafeInteger(value) || value < 1 || value > maximum) throw new Error(`Invalid ${name}`);
  return value;
}

const target = process.env.LOAD_BASE_URL;
const storageState = process.env.LOAD_STORAGE_STATE;
if (!target || !storageState) throw new Error("LOAD_BASE_URL and private LOAD_STORAGE_STATE are required");
const base = new URL(target);
if (!["http:", "https:"].includes(base.protocol) || base.username || base.password || base.pathname !== "/" || base.search || base.hash) {
  throw new Error("LOAD_BASE_URL must be an HTTP(S) origin without credentials");
}
const metadata = await stat(storageState);
if (!metadata.isFile() || (metadata.mode & 0o077) !== 0) throw new Error("LOAD_STORAGE_STATE must be a private regular file");
const count = integer("LOAD_CONNECTIONS", 1, 1000);
const durationMs = integer("LOAD_DURATION_MS", 5000, 300000);
const timeoutMs = integer("LOAD_TIMEOUT_MS", 15000, 60000);
const channels = JSON.parse(process.env.LOAD_CHANNELS ?? '["system.status"]');
if (!Array.isArray(channels) || channels.length < 1 || channels.length > 13 ||
    channels.some((channel) => typeof channel !== "string" || !channel || channel.length > 200) ||
    new Set(channels).size !== channels.length) throw new Error("LOAD_CHANNELS must contain 1–13 distinct channel names");
const api = await request.newContext({ baseURL: base.origin, storageState, timeout: timeoutMs });
const sockets = [];
let shuttingDown = false;
const started = Date.now();
const metrics = { requested: count, subscriptions: channels.length, connected: 0, failed: 0, acknowledged: 0, errors: 0, tokenFailures: 0, connectMs: [], ackMs: [] };

try {
  const workspace = await api.get("/api/v1/workspace/bootstrap");
  if (workspace.status() !== 200) throw new Error("Authenticated workspace is unavailable");
  const { state, account } = await workspace.json();
  if (state !== "user.ready" || account?.execution_mode !== "PAPER" || account.funding_enabled !== false || account.withdrawals_enabled !== false) {
    throw new Error("Load fixture requires a normally authenticated PAPER account");
  }
  const csrf = await api.get("/api/v1/auth/oidc/csrf/");
  if (csrf.status() !== 200) throw new Error("CSRF bootstrap failed");
  const { csrfToken } = await csrf.json();
  if (typeof csrfToken !== "string" || !csrfToken) throw new Error("CSRF bootstrap returned no token");
  const headers = { "X-CSRFToken": csrfToken, Origin: base.origin, Referer: `${base.origin}/platform` };
  // Exercise the existing V2 authorization API. B17 migrates token acquisition
  // to /api/v1/realtime/session; no guest sessions or V1 sockets are created.
  for (const channel of channels) {
    const authorized = await api.post("/api/v1/realtime/v2/subscription-token", { headers, data: { channel } });
    if (authorized.status() !== 200) throw new Error("Channel authorization failed");
  }
  const socketURL = new URL("/ws/v2/", base);
  socketURL.protocol = base.protocol === "https:" ? "wss:" : "ws:";
  await Promise.all(Array.from({ length: count }, async () => {
    let token;
    try {
      const issued = await api.post("/api/v1/realtime/v2/connection-token", { headers, data: {} });
      if (issued.status() !== 200) throw new Error("Connection token unavailable");
      token = (await issued.json()).token;
      if (typeof token !== "string" || !token) throw new Error("Connection token missing");
    } catch {
      metrics.tokenFailures++; metrics.failed++;
      return;
    }
    await new Promise((resolve) => {
      const openedAt = Date.now();
      const socket = new WebSocket(socketURL);
      sockets.push(socket);
      let finished = false;
      let connected = false;
      const pending = new Set(channels.map((_, index) => index + 2));
      const finish = (failed) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        if (failed) { metrics.failed++; socket.terminate(); }
        resolve();
      };
      const timer = setTimeout(() => finish(true), timeoutMs);
      socket.on("open", () => socket.send(JSON.stringify({ id: 1, connect: { token } })));
      socket.on("message", (raw) => {
        for (const line of raw.toString().split("\n").filter(Boolean)) {
          let reply;
          try { reply = JSON.parse(line); } catch { metrics.errors++; finish(true); return; }
          if (!reply || typeof reply !== "object" || Array.isArray(reply)) { metrics.errors++; finish(true); return; }
          if (!Object.keys(reply).length) { socket.send("{}"); continue; }
          if (reply.error) { metrics.errors++; finish(true); return; }
          if (reply.id === 1 && reply.connect && !connected) {
            connected = true; metrics.connected++; metrics.connectMs.push(Date.now() - openedAt);
            channels.forEach((channel, index) => socket.send(JSON.stringify({ id: index + 2, subscribe: { channel, recover: true } })));
          } else if (connected && pending.has(reply.id) && reply.subscribe) {
            pending.delete(reply.id); metrics.acknowledged++;
            if (!pending.size) { metrics.ackMs.push(Date.now() - openedAt); finish(false); }
          }
        }
      });
      socket.on("error", () => { metrics.errors++; finish(true); });
      socket.on("close", () => {
        if (!finished) finish(true);
        else if (!shuttingDown && connected && !pending.size) metrics.errors++;
      });
    });
  }));
  await new Promise((resolve) => setTimeout(resolve, durationMs));
} finally {
  shuttingDown = true;
  sockets.forEach((socket) => socket.terminate());
  await api.dispose();
}
const percentile = (values, p) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted.length ? sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)] : null;
};
process.stdout.write(JSON.stringify({ ...metrics, elapsedMs: Date.now() - started, connectP95Ms: percentile(metrics.connectMs, .95), ackP95Ms: percentile(metrics.ackMs, .95) }) + "\n");
if (metrics.failed || metrics.errors || metrics.connected !== count || metrics.acknowledged !== count * channels.length) process.exitCode = 1;
