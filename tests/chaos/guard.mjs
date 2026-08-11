const allowedHosts = new Set(["staging.beyvra.com", "isolated-staging.beyvra.test"]);

export function assertChaosGuard(env = process.env) {
  if (env.CHAOS_EXECUTE !== "YES") throw new Error("CHAOS_EXECUTION_NOT_AUTHORIZED");
  if (env.CHAOS_SYNTHETIC_ACCOUNT !== "YES") throw new Error("SYNTHETIC_ACCOUNT_REQUIRED");
  const base = new URL(env.CHAOS_BASE_URL ?? "");
  if (base.protocol !== "https:" || !allowedHosts.has(base.hostname)) throw new Error("ISOLATED_STAGING_HOST_REQUIRED");
  if (env.REAL_TRADING_ENABLED !== "false" || env.EXTERNAL_EXECUTION_ENABLED !== "false" || env.REAL_MONEY_ENABLED !== "false") {
    throw new Error("REAL_VALUE_FLAGS_MUST_BE_FALSE");
  }
  return base.origin;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`CHAOS_GUARD=PASS BASE=${assertChaosGuard()}`);
}

