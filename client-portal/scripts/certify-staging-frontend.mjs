import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const baseUrl = process.env.BEYVRA_FRONTEND_STAGING_URL ?? "https://staging.beyvra.com";
const output = process.argv.includes("--output")
  ? process.argv[process.argv.indexOf("--output") + 1]
  : "test-results/staging-frontend-evidence.json";

if (!baseUrl.toLowerCase().includes("staging") && process.env.ALLOW_NON_STAGING_CERTIFICATION !== "yes") {
  throw new Error("Refusing a non-staging target");
}

async function probe(path, options = {}) {
  try {
    const response = await fetch(new URL(path, baseUrl), { redirect: "manual", ...options });
    const text = await response.text();
    return {
      path,
      status: response.status,
      ok: response.ok,
      cacheControl: response.headers.get("cache-control") ?? "",
      contentType: response.headers.get("content-type") ?? "",
      bodySample: text.slice(0, 500),
    };
  } catch (error) {
    return { path, ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

const probes = {
  healthz: await probe("/healthz"),
  index: await probe("/"),
  config: await probe("/config.js"),
  anonymousApi: await probe("/api/v1/me", { headers: { Accept: "application/json" } }),
};

const configBody = probes.config.bodySample ?? "";
const forbiddenConfigTerms = [
  "SECRET",
  "PRIVATE_KEY",
  "DATABASE",
  "REDIS",
  "WEBHOOK",
  "TOKEN_HMAC",
  "API_SECRET",
];

const checks = {
  healthz_ok: probes.healthz.status === 200 && /ok/i.test(probes.healthz.bodySample ?? ""),
  index_loads_html: probes.index.status === 200 && /<html/i.test(probes.index.bodySample ?? ""),
  config_no_store: /no-store/i.test(probes.config.cacheControl),
  config_public_only: !forbiddenConfigTerms.some((term) => configBody.toUpperCase().includes(term)),
  anonymous_api_same_origin: probes.anonymousApi.status === 401 || probes.anonymousApi.status === 403,
};

const evidence = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  target: baseUrl,
  probes,
  checks,
  overall: Object.values(checks).every(Boolean) ? "PASS" : "FAIL",
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(evidence, null, 2)}\n`);
console.log(`FRONTEND_STAGING_EVIDENCE=${output}`);
if (evidence.overall !== "PASS") process.exit(1);
