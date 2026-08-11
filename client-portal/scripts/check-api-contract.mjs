import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));
const endpointRegistry = fileURLToPath(new URL("../src/api/endpoints.ts", import.meta.url));
const contractSnapshot = fileURLToPath(
  new URL("../../docs/evidence/backend-api-contract.json", import.meta.url),
);

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  }));
  return files.flat().filter((path) => /\.(ts|tsx)$/.test(path));
}

function canonical(path) {
  const normalized = path.includes("queryParams") ? path.split("${")[0] : path;
  return normalized
    .split("?")[0]
    .replace(/\$\{[^}]+\}/g, "{}")
    .replace(/\{[^}]+\}/g, "{}")
    .replace(/\/$/, "") || "/";
}

let backendPaths;
if (process.env.API_SCHEMA_URL) {
  const schemaResponse = await fetch(process.env.API_SCHEMA_URL, { redirect: "follow" });
  if (!schemaResponse.ok) throw new Error(`Schema request failed: ${schemaResponse.status}`);
  const schema = await schemaResponse.text();
  backendPaths = new Set(
    [...schema.matchAll(/^  (\/api\/[^:]+):$/gm)].map((match) => canonical(match[1].slice(4))),
  );
} else {
  const snapshot = JSON.parse(await readFile(contractSnapshot, "utf8"));
  if (!snapshot.schema_digest || !Array.isArray(snapshot.paths)) {
    throw new Error("Backend API contract snapshot is missing provenance or paths.");
  }
  backendPaths = new Set(snapshot.paths.map((path) => canonical(path.slice(4))));
}

const endpoints = new Set();
for (const file of await sourceFiles(sourceRoot)) {
  const source = await readFile(file, "utf8");
  const patterns = [
    /\$\{BASE_URL\}(\/[^`"']+)/g,
    /\$\{getEnv\(\s*["']VITE_API_BASE_URL["']\s*\)\}(\/[^`"']+)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) endpoints.add(canonical(match[1]));
  }
}

// The application deliberately routes requests through apiEndpoints instead of
// interpolating VITE_API_BASE_URL at each call site.  The old scanner only
// recognized those retired inline patterns, which meant this check could pass
// while validating zero paths.  Treat the registry as the authoritative
// frontend contract and extract both constant and parameterized entries.
const registrySource = (await readFile(endpointRegistry, "utf8")).split(
  "export const socketEndpoints",
)[0];
for (const match of registrySource.matchAll(/:\s*["']([^"']+)["']/g)) {
  endpoints.add(canonical(`/${match[1]}`));
}
for (const match of registrySource.matchAll(/=>\s*`([^`]+)`/g)) {
  endpoints.add(canonical(`/${match[1]}`));
}

const ignored = new Set(["/user/websocket_ticket"]);
const missing = [...endpoints].filter((path) => !ignored.has(path) && !backendPaths.has(path)).sort();
if (endpoints.size === 0) {
  throw new Error("No frontend API paths were discovered; refusing a false-green contract check.");
}
console.log(`Checked ${endpoints.size} frontend API paths against ${backendPaths.size} backend paths.`);
if (missing.length) {
  console.error("Missing from backend schema:\n" + missing.map((path) => `- ${path}`).join("\n"));
  process.exit(1);
}
