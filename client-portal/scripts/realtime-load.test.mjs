import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:http";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { WebSocketServer } from "ws";

async function fixture({ mode = "PAPER", rejectSubscription = false } = {}) {
  const paths = [];
  const gateway = new WebSocketServer({ noServer: true });
  const server = createServer(async (req, res) => {
    paths.push(req.url);
    for await (const _chunk of req) { /* consume request body */ }
    res.setHeader("Content-Type", "application/json");
    const payloads = {
      "/api/v1/workspace/bootstrap": { state: "user.ready", account: { execution_mode: mode, funding_enabled: false, withdrawals_enabled: false } },
      "/api/v1/auth/oidc/csrf/": { csrfToken: "fixture-csrf" },
      "/api/v1/realtime/v2/subscription-token": { token: "fixture-subscription" },
      "/api/v1/realtime/v2/connection-token": { token: "fixture-connection" },
    };
    if (!(req.url in payloads)) { res.statusCode = 404; res.end("{}"); return; }
    if (req.method === "POST" && req.headers["x-csrftoken"] !== "fixture-csrf") { res.statusCode = 403; res.end("{}"); return; }
    res.end(JSON.stringify(payloads[req.url]));
  });
  server.on("upgrade", (req, socket, head) => {
    paths.push(req.url);
    if (req.url !== "/ws/v2/") { socket.destroy(); return; }
    gateway.handleUpgrade(req, socket, head, (ws) => gateway.emit("connection", ws));
  });
  gateway.on("connection", (socket) => socket.on("message", (raw) => {
    const command = JSON.parse(raw.toString());
    if (command.connect) {
      assert.equal(command.connect.token, "fixture-connection");
      socket.send(JSON.stringify({ id: command.id, connect: { client: "fixture-client" } }));
    } else if (command.subscribe) {
      socket.send(JSON.stringify(rejectSubscription ? { id: command.id, error: { code: 403 } } : { id: command.id, subscribe: {} }));
    }
  }));
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const directory = await mkdtemp(join(tmpdir(), "beyvra-load-test-"));
  const storage = join(directory, "session.json");
  // Synthetic local protocol fixture, never staging authentication.
  await writeFile(storage, JSON.stringify({ cookies: [], origins: [] }), { mode: 0o600 });
  return {
    paths,
    async run() {
      const child = spawn(process.execPath, [fileURLToPath(new URL("./realtime-load.mjs", import.meta.url))], {
        env: { ...process.env, LOAD_BASE_URL: `http://127.0.0.1:${server.address().port}`, LOAD_STORAGE_STATE: storage,
          LOAD_CONNECTIONS: "2", LOAD_DURATION_MS: "50", LOAD_TIMEOUT_MS: "3000", LOAD_CHANNELS: '["system.status"]' },
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stdout = ""; let stderr = "";
      child.stdout.on("data", (chunk) => { stdout += chunk; });
      child.stderr.on("data", (chunk) => { stderr += chunk; });
      const timeout = setTimeout(() => child.kill("SIGKILL"), 10000);
      const [code] = await once(child, "close");
      clearTimeout(timeout);
      return { code, stdout, stderr };
    },
    async close() {
      gateway.clients.forEach((socket) => socket.terminate());
      await new Promise((resolve) => gateway.close(resolve));
      await new Promise((resolve) => server.close(resolve));
      await rm(directory, { recursive: true, force: true });
    },
  };
}

test("V2 load fixture counts authenticated connections and confirmed subscriptions", async () => {
  const server = await fixture();
  try {
    const result = await server.run();
    assert.equal(result.code, 0, result.stderr);
    const metrics = JSON.parse(result.stdout);
    assert.equal(metrics.connected, 2);
    assert.equal(metrics.acknowledged, 2);
    assert.equal(metrics.failed, 0);
    assert.ok(server.paths.includes("/ws/v2/"));
    assert.ok(server.paths.every((path) => path.startsWith("/api/v1/") || path === "/ws/v2/"));
    assert.ok(!result.stdout.includes("fixture-connection"));
  } finally { await server.close(); }
});

test("rejected subscriptions fail the load result", async () => {
  const server = await fixture({ rejectSubscription: true });
  try {
    const result = await server.run();
    assert.equal(result.code, 1);
    const metrics = JSON.parse(result.stdout);
    assert.equal(metrics.acknowledged, 0);
    assert.equal(metrics.failed, 2);
  } finally { await server.close(); }
});

test("LIVE fixtures fail before token acquisition or socket connection", async () => {
  const server = await fixture({ mode: "LIVE" });
  try {
    const result = await server.run();
    assert.equal(result.code, 1);
    assert.match(result.stderr, /normally authenticated PAPER account/);
    assert.deepEqual(server.paths, ["/api/v1/workspace/bootstrap"]);
  } finally { await server.close(); }
});
