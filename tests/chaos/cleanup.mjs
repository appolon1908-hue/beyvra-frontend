import fs from "node:fs";
import { assertChaosGuard } from "./guard.mjs";

assertChaosGuard();
const evidencePath = process.env.CHAOS_EVIDENCE_FILE;
if (!evidencePath || !fs.existsSync(evidencePath)) throw new Error("CHAOS_EVIDENCE_REQUIRED");
const evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8"));
if (evidence.environment !== "isolated-staging" || evidence.synthetic !== true) throw new Error("UNSAFE_CLEANUP_EVIDENCE");

// Frontend chaos creates no authoritative resources and therefore performs no
// deletion. Demo orders settle under backend authority and are reconciled only.
console.log("CHAOS_CLEANUP=NO_DESTRUCTIVE_ACTION_REQUIRED");

