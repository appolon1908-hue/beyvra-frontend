import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../src/", import.meta.url));
const endpointRegistry = fileURLToPath(new URL("../src/api/endpoints.ts", import.meta.url));
const schemaUrl = process.env.API_SCHEMA_URL ?? "http://127.0.0.1:8080/api/schema/";
const sourceOnly = process.argv.includes("--source-only");
const minimumRegistryPaths = 20;

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  }));
  return files.flat().filter((path) => /\.(ts|tsx)$/.test(path));
}

function canonical(rawPath) {
  const beforeQuery = rawPath.trim().split("?")[0];
  const withLeadingSlash = beforeQuery.startsWith("/") ? beforeQuery : `/${beforeQuery}`;
  return withLeadingSlash
    .replace(/^\/api(?=\/)/, "")
    .replace(/\$\{[^}]+\}/g, "{}")
    .replace(/\{[^}]+\}/g, "{}")
    .replace(/\/$/, "") || "/";
}

function isApiPath(rawPath) {
  const normalized = rawPath.trim().replace(/^\//, "");
  return normalized.length > 0 && !normalized.startsWith("ws/");
}

function endpointDefinitions(source) {
  const endpoints = new Set();
  for (const line of source.split("\n")) {
    const staticDefinition = line.match(/^\s*[A-Za-z0-9_]+:\s*["']([^"']+)["'],?\s*$/);
    const dynamicDefinition = line.match(
      /^\s*[A-Za-z0-9_]+:\s*\([^)]*\)\s*=>\s*`([^`]+)`,?\s*$/,
    );
    const rawPath = staticDefinition?.[1] ?? dynamicDefinition?.[1];
    if (rawPath && isApiPath(rawPath)) endpoints.add(canonical(rawPath));
  }
  return endpoints;
}

function directEndpointCalls(source) {
  const endpoints = new Set();
  const patterns = [
    /getApiUrl\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
    /(?:authenticatedRequest|codestraRequest)(?:<[\s\S]{0,300}?>)?\(\s*["'`]([^"'`]+)["'`]/g,
    /\$\{BASE_URL\}(\/[^`"']+)/g,
    /\$\{getEnv\(\s*["']VITE_API_BASE_URL["']\s*\)\}(\/[^`"']+)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      if (isApiPath(match[1])) endpoints.add(canonical(match[1]));
    }
  }
  return endpoints;
}

function schemaPaths(schemaText) {
  const endpoints = new Set();
  try {
    const parsed = JSON.parse(schemaText);
    if (parsed && typeof parsed === "object" && parsed.paths && typeof parsed.paths === "object") {
      for (const path of Object.keys(parsed.paths)) endpoints.add(canonical(path));
    }
  } catch {
    // The production schema endpoint currently serves YAML; JSON is also accepted.
  }

  const yamlPath = /^\s*["']?(\/api\/[^"'\s:]+)["']?\s*:\s*$/gm;
  for (const match of schemaText.matchAll(yamlPath)) endpoints.add(canonical(match[1]));
  return endpoints;
}

const registrySource = await readFile(endpointRegistry, "utf8");
const registryEndpoints = endpointDefinitions(registrySource);
if (registryEndpoints.size < minimumRegistryPaths) {
  throw new Error(
    `Endpoint discovery failed: parsed ${registryEndpoints.size} paths from src/api/endpoints.ts; `
    + `expected at least ${minimumRegistryPaths}.`,
  );
}

for (const required of [
  "/v1/workspace/bootstrap",
  "/v1/trading/orders",
  "/v1/integrations/crm/connections",
]) {
  if (!registryEndpoints.has(required)) {
    throw new Error(`Endpoint discovery failed: required registry path is missing: ${required}`);
  }
}

const directEndpoints = new Set();
for (const file of await sourceFiles(sourceRoot)) {
  const source = await readFile(file, "utf8");
  for (const endpoint of directEndpointCalls(source)) directEndpoints.add(endpoint);
}

const frontendEndpoints = new Set([...registryEndpoints, ...directEndpoints]);
if (frontendEndpoints.size === 0) {
  throw new Error("Endpoint discovery failed: no frontend API paths were found.");
}

if (sourceOnly) {
  console.log(
    `Discovered ${frontendEndpoints.size} frontend API paths `
    + `(${registryEndpoints.size} registry, ${directEndpoints.size} direct).`,
  );
} else {
  const schemaResponse = await fetch(schemaUrl, { redirect: "follow" });
  if (!schemaResponse.ok) {
    throw new Error(`Schema request failed: ${schemaResponse.status} (${schemaUrl})`);
  }
  const backendEndpoints = schemaPaths(await schemaResponse.text());
  if (backendEndpoints.size === 0) {
    throw new Error(`Backend schema at ${schemaUrl} contained no parseable API paths.`);
  }

  const ignored = new Set(["/user/websocket_ticket"]);
  const missing = [...frontendEndpoints]
    .filter((path) => !ignored.has(path) && !backendEndpoints.has(path))
    .sort();

  console.log(
    `Checked ${frontendEndpoints.size} frontend API paths `
    + `(${registryEndpoints.size} registry, ${directEndpoints.size} direct) `
    + `against ${backendEndpoints.size} backend paths.`,
  );
  if (missing.length) {
    console.error(
      "Missing from backend schema:\n"
      + missing.map((path) => `- ${path}`).join("\n"),
    );
    process.exit(1);
  }
}
