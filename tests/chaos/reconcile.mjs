import { assertChaosGuard } from "./guard.mjs";
import { assertDemoInvariants } from "./invariants.mjs";

const origin = assertChaosGuard();
const token = process.env.CHAOS_SYNTHETIC_TOKEN;
if (!token) throw new Error("SYNTHETIC_TOKEN_REQUIRED");
const headers = { Authorization: `Bearer ${token}` };

async function read(path) {
  const response = await fetch(`${origin}${path}`, { headers, signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`RECONCILIATION_READ_FAILED:${path}:${response.status}`);
  return response.json();
}

const evidence = {
  orders: await read("/api/v1/demo/orders"),
  trades: await read("/api/v1/demo/trades"),
  wallet: await read("/api/v1/demo/wallet"),
};
console.log(JSON.stringify({ reconciliation: "PASS", ...assertDemoInvariants(evidence) }));

