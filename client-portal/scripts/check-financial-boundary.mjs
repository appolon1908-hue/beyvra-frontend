import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const portal = fileURLToPath(new URL("../", import.meta.url));
const roots = [join(portal, "src")];
try { await readdir(join(portal, "dist")); roots.push(join(portal, "dist")); } catch { /* build output is optional before build */ }

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  }))).flat();
}

const forbiddenIdentifiers = /provider_(?:customer|wallet|transaction)_id/i;
const forbiddenNetwork = /(?:fetch|axios|WebSocket|EventSource|import)[^\n]{0,240}(?:polygon[^\n]*oms|\boms\b|financial-service|custody-provider|payment-provider)/i;
const findings = [];
for (const root of roots) {
  for (const path of await files(root)) {
    if (!new Set([".ts", ".tsx", ".js", ".mjs", ".html"]).has(extname(path))) continue;
    const source = await readFile(path, "utf8");
    if (forbiddenIdentifiers.test(source)) findings.push(`${path}: provider authority identifier`);
    if (forbiddenNetwork.test(source)) findings.push(`${path}: forbidden direct financial/provider network call`);
  }
}

if (findings.length) {
  console.error(findings.join("\n"));
  process.exit(1);
}
console.log(`DIRECT_FRONTEND_OMS_CALLS=0 DIRECT_FRONTEND_FINANCIAL_SERVICE_CALLS=0 DIRECT_FRONTEND_CUSTODY_PROVIDER_CALLS=0 files_scanned=${(await Promise.all(roots.map(files))).flat().length}`);
