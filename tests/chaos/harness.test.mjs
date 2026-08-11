import test from "node:test";
import assert from "node:assert/strict";
import { assertChaosGuard } from "./guard.mjs";
import { assertDemoInvariants } from "./invariants.mjs";

test("guard is fail closed by default", () => {
  assert.throws(() => assertChaosGuard({}), /CHAOS_EXECUTION_NOT_AUTHORIZED/);
});

test("guard rejects production and non-HTTPS targets", () => {
  const flags = { CHAOS_EXECUTE: "YES", CHAOS_SYNTHETIC_ACCOUNT: "YES", REAL_TRADING_ENABLED: "false", EXTERNAL_EXECUTION_ENABLED: "false", REAL_MONEY_ENABLED: "false" };
  assert.throws(() => assertChaosGuard({ ...flags, CHAOS_BASE_URL: "https://beyvra.com" }), /ISOLATED_STAGING_HOST_REQUIRED/);
  assert.throws(() => assertChaosGuard({ ...flags, CHAOS_BASE_URL: "http://staging.beyvra.com" }), /ISOLATED_STAGING_HOST_REQUIRED/);
});

test("reconciliation detects duplicates and non-simulation evidence", () => {
  assert.throws(() => assertDemoInvariants({ orders: [{ id: 1 }, { id: 1 }], trades: [], wallet: {} }), /DUPLICATE/);
  assert.throws(() => assertDemoInvariants({ orders: [{ id: 1, real: true }], trades: [], wallet: {} }), /NON_SIMULATION/);
});

test("safe synthetic evidence passes", () => {
  assert.deepEqual(assertDemoInvariants({ orders: [{ id: 1, simulation: true }], trades: [], wallet: {} }), { orderCount: 1, tradeCount: 0, walletObserved: true });
});
