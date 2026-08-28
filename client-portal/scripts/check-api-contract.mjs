import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));
const endpointsFile = fileURLToPath(new URL("../src/api/endpoints.ts", import.meta.url));
const schemaUrl = process.env.API_SCHEMA_URL ?? "http://127.0.0.1:8080/api/schema/";
const schemaFile = process.env.API_SCHEMA_FILE;

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
  const withoutHost = normalized
    .split("?")[0]
    .replace(/\$\{[^}]+\}/g, "{}")
    .replace(/\{[^}]+\}/g, "{}")
    .replace(/\/$/, "");
  const withLeadingSlash = withoutHost.startsWith("/") ? withoutHost : `/${withoutHost}`;
  return withLeadingSlash || "/";
}

const schema = schemaFile
  ? await readFile(schemaFile, "utf8")
  : await (async () => {
      const schemaResponse = await fetch(schemaUrl, { redirect: "follow" });
      if (!schemaResponse.ok) throw new Error(`Schema request failed: ${schemaResponse.status}`);
      return schemaResponse.text();
    })();

function openApiPaths(source) {
  try {
    const parsed = JSON.parse(source);
    if (parsed && typeof parsed === "object" && parsed.paths && typeof parsed.paths === "object") {
      return Object.keys(parsed.paths);
    }
  } catch {
    // Fall through to the lightweight YAML path extractor used by the checked-in contract.
  }
  return [...source.matchAll(/^  (\/api\/[^:]+):$/gm)].map((match) => match[1]);
}

const backendPaths = new Set(
  openApiPaths(schema)
    .filter((path) => path.startsWith("/api/"))
    .map((path) => canonical(path.slice(4))),
);

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

const configuredEndpoints = await readFile(endpointsFile, "utf8");
const endpointPatterns = [
  /["']((?:v1|notification|portfolio|trades)\/[^"'`$]*)["']/g,
  /`((?:v1|notification|portfolio|trades)\/[^`]*)`/g,
];
for (const pattern of endpointPatterns) {
  for (const match of configuredEndpoints.matchAll(pattern)) {
    endpoints.add(canonical(match[1]));
  }
}

const ignored = new Set(["/user/websocket_ticket"]);
const missing = [...endpoints].filter((path) => !ignored.has(path) && !backendPaths.has(path)).sort();
console.log(`Checked ${endpoints.size} frontend API paths against ${backendPaths.size} backend paths.`);
if (missing.length) {
  console.error("Missing from backend schema:\n" + missing.map((path) => `- ${path}`).join("\n"));
  process.exit(1);
}
