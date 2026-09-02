import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));
const contractPath = fileURLToPath(new URL("../contracts/backend-paths.json", import.meta.url));
const endpointRegistryPath = fileURLToPath(new URL("../src/api/endpoints.ts", import.meta.url));

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  }));
  return files.flat().filter((path) => /\.(ts|tsx)$/.test(path));
}

function canonical(path) {
  const normalized = path.includes("queryParams")
    ? path.split("${")[0]
    : path.replace(/\$\{(?:suffix|params)\}$/, "");
  return normalized
    .split("?")[0]
    .replace(/\$\{[^}]+\}/g, "{}")
    .replace(/\{[^}]+\}/g, "{}")
    .replace(/\/$/, "") || "/";
}

function apiRelative(path) {
  return path.startsWith("/") ? path : `/${path}`;
}

const contract = JSON.parse(await readFile(contractPath, "utf8"));
if (!Array.isArray(contract.paths) || !contract.sourceSha || !contract.sha256) {
  throw new Error("Pinned backend contract must include sourceSha, sha256, and paths.");
}
const backendPaths = new Set(contract.paths.map(canonical));

const endpoints = new Set();
for (const file of await sourceFiles(sourceRoot)) {
  const source = await readFile(file, "utf8");
  const patterns = [
    /\$\{BASE_URL\}(\/[^`"']+)/g,
    /\$\{getEnv\(\s*["']VITE_API_BASE_URL["']\s*\)\}(\/[^`"']+)/g,
    /codestraRequest(?:<[^>]+>)?\(\s*["']([^"']+)/g,
    /codestraRequest(?:<[^>]+>)?\(\s*`([^`]+)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) endpoints.add(canonical(apiRelative(match[1])));
  }
}

// Registry values are relative to getApiUrl()'s /api base. Inspect this file
// explicitly so moving calls behind typed hooks cannot make this gate report a
// false pass with zero or partial coverage.
const endpointRegistry = (await readFile(endpointRegistryPath, "utf8")).split("export const socketEndpoints")[0];
for (const pattern of [/:\s*["']([^"']+)["']/g, /=>\s*`([^`]+)`/g]) {
  for (const match of endpointRegistry.matchAll(pattern)) {
    endpoints.add(canonical(`/${match[1].replace(/^\//, "")}`));
  }
}

const ignored = new Set(["/user/websocket_ticket"]);
const missing = [...endpoints].filter((path) => !ignored.has(path) && !backendPaths.has(path)).sort();
if (endpoints.size < 40) {
  throw new Error(`Contract coverage regression: discovered only ${endpoints.size} frontend API paths.`);
}
console.log(`Checked ${endpoints.size} frontend API paths against ${backendPaths.size} pinned backend paths (${contract.sourceSha}).`);
if (missing.length) {
  console.error("Missing from backend schema:\n" + missing.map((path) => `- ${path}`).join("\n"));
  process.exit(1);
}
