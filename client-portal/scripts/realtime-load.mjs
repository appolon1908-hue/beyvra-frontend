import WebSocket from "ws";

const base = process.env.LOAD_BASE_URL || "https://staging.codestra.cloud";
const count = Number(process.env.LOAD_CONNECTIONS || 1);
const durationMs = Number(process.env.LOAD_DURATION_MS || 5000);
const timeoutMs = Number(process.env.LOAD_TIMEOUT_MS || 15000);
const channels = ["market.status", "notification", "demo.order"];
const started = Date.now();
const metrics = { requested: count, connected: 0, failed: 0, acknowledged: 0, duplicateAcks: 0, errors: 0, ticketFailures: 0, errorMessages: {}, connectMs: [], ackMs: [] };

const sessionCount = Math.max(1, Number(process.env.LOAD_SESSION_COUNT || 1));
const accesses = await Promise.all(Array.from({ length: sessionCount }, async (_, index) => {
  const post = await fetch(`${base}/api/v1/demo/sessions`, {
    method: "POST",
    headers: { "content-type": "application/json", "idempotency-key": `load-${Date.now()}-${index}` },
    body: "{}",
  });
  if (!post.ok) throw new Error(`guest session failed: ${post.status}`);
  return (await post.json()).access;
}));

async function ticket(index) {
  const access = accesses[index % accesses.length];
  const response = await fetch(`${base}/api/user/websocket_ticket/`, { headers: { authorization: `Bearer ${access}` } });
  if (!response.ok) { metrics.ticketFailures++; throw new Error(`ticket failed: ${response.status}`); }
  return (await response.json()).ws_ticket;
}

const sockets = [];
await Promise.all(Array.from({ length: count }, async () => {
  let wsTicket;
  try { wsTicket = await ticket(Math.floor(Math.random() * accesses.length)); } catch (error) {
    metrics.failed++;
    const key = String(error?.message || "ticket failure"); metrics.errorMessages[key] = (metrics.errorMessages[key] || 0) + 1;
    return;
  }
  await new Promise((resolve) => {
    const openedAt = Date.now();
    const socket = new WebSocket(`${base.replace(/^http/, "ws")}/ws/v1/?ws_ticket=${encodeURIComponent(wsTicket)}`);
    sockets.push(socket);
    let settled = false;
    const finish = () => { if (!settled) { settled = true; clearTimeout(timer); resolve(); } };
    const timer = setTimeout(() => { metrics.failed++; socket.terminate(); finish(); }, timeoutMs);
    socket.on("open", () => {
      metrics.connected++; metrics.connectMs.push(Date.now() - openedAt);
      socket.send(JSON.stringify({ action: "subscribe", request_id: crypto.randomUUID(), channels }));
    });
    socket.on("message", (raw) => {
      let message; try { message = JSON.parse(raw.toString()); } catch { metrics.errors++; return; }
      if (message.type === "subscription.ack") {
        metrics.acknowledged++; if ((message.added || []).length !== channels.length) metrics.duplicateAcks++;
        metrics.ackMs.push(Date.now() - openedAt); finish();
      }
      if (message.type === "error" || message.type === "subscription.error") metrics.errors++;
    });
    socket.on("error", (error) => { metrics.errors++; const key = String(error?.message || "unknown"); metrics.errorMessages[key] = (metrics.errorMessages[key] || 0) + 1; });
    socket.on("close", () => { if (!settled) metrics.failed++; finish(); });
  });
}));
await new Promise((resolve) => setTimeout(resolve, durationMs));
sockets.forEach((socket) => socket.close());
const percentile = (values, p) => { const sorted = [...values].sort((a, b) => a - b); return sorted.length ? sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * p) - 1)] : null; };
console.log(JSON.stringify({ ...metrics, elapsedMs: Date.now() - started, connectP50Ms: percentile(metrics.connectMs, .5), connectP95Ms: percentile(metrics.connectMs, .95), connectP99Ms: percentile(metrics.connectMs, .99), ackP95Ms: percentile(metrics.ackMs, .95) }));
