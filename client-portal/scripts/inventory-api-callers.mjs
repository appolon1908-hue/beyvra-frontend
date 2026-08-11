import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceRoot = join(root, "src");
const jsonOutput = process.argv[2] ?? join(root, "../docs/evidence/frontend-api-callers.json");
const markdownOutput = process.argv[3] ?? join(root, "../docs/FRONTEND-API-CALLERS.md");

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  }))).flat().filter((path) => /\.(ts|tsx|js|jsx)$/.test(path) && !/\.test\./.test(path));
}

const records = [];
for (const file of await files(sourceRoot)) {
  const lines = (await readFile(file, "utf8")).split("\n");
  lines.forEach((line, index) => {
    if (!/(authenticatedRequest|\bfetch\s*\(|new WebSocket|new EventSource|apiEndpoints\.)/.test(line)) return;
    const trimmed = line.trim();
    if (trimmed.startsWith("//")) return;
    const context = lines.slice(index, index + 5).join(" ");
    let classification = "UNMAPPED";
    if (/apiEndpoints\.|getApiUrl\(|beyvraRealtimeV2Api\.|getSocketUrl\(/.test(context)) classification = "MAPPED_CANONICAL_CLIENT";
    else if (/fetch\(endpoint/.test(line) && file.endsWith("geoLocale.ts")) classification = "APPROVED_EXTERNAL_LOCALE_DISCOVERY";
    else if (/fetch\(getApiUrl\(path\)/.test(line)) classification = "MAPPED_GENERATED_CLIENT";
    else if (/authenticatedRequest/.test(line) && /import/.test(line)) classification = "CLIENT_IMPORT";
    else if (/export async function authenticatedRequest/.test(line)) classification = "CANONICAL_CLIENT_ABSTRACTION";
    else if (/authenticatedRequest/.test(line) && /(`v1\/|\bendpoint\b)/.test(context)) classification = "MAPPED_PARAMETERIZED_CLIENT";
    records.push({ file: relative(root, file), line: index + 1, caller: trimmed.slice(0, 300), classification });
  });
}

const unmapped = records.filter((record) => record.classification === "UNMAPPED");
await mkdir(dirname(jsonOutput), { recursive: true });
await mkdir(dirname(markdownOutput), { recursive: true });
await writeFile(jsonOutput, JSON.stringify({ schema_version: 1, caller_count: records.length, unmapped_count: unmapped.length, callers: records }, null, 2) + "\n");
const lines = [
  "# Frontend API Caller Inventory",
  "",
  "Generated from production TypeScript/JavaScript sources. Test fixtures are inventoried separately in the route-test matrix.",
  "",
  `Call sites: **${records.length}**. Unmapped: **${unmapped.length}**.`,
  "",
  "| File | Line | Classification | Caller |",
  "|---|---:|---|---|",
  ...records.map((record) => `| \`${record.file}\` | ${record.line} | ${record.classification} | \`${record.caller.replaceAll("|", "\\|")}\` |`),
];
await writeFile(markdownOutput, lines.join("\n") + "\n");
console.log(`FRONTEND_API_CALLERS=${records.length}`);
console.log(`UNMAPPED_FRONTEND_API_CALLERS=${unmapped.length}`);
if (unmapped.length) process.exit(1);
