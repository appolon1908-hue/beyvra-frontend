import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

const activePatterns = [
  "src/**/*.{ts,tsx}",
  "public/**/*.{json,xml,txt,webmanifest}",
  "index.html",
  ".env.example",
  "config.js.template",
  "nginx-default.conf",
  "../deploy/Caddyfile.*",
];
const forbidden = /codestra(?:-ai)?\.com|(?:[a-z0-9-]+\.)?codestra\.cloud|\bCodestra\b|\bTradi\b|\bTradix\b|\bTradx\b|\bTradex\b|\bTrading[- ]X\b|\bTrade[- ]X\b|trad(?:e)?x\.(?:com|io)/i;
const internalCompatibility = new Set(["src/api/generated/codestraDemo.ts"]);
const internalCompatibilityLines = /codestra(?:\.chart\.|:last-logout)/i;
const files = activePatterns.flatMap((pattern) => globSync(pattern));
const failures = [];

for (const file of new Set(files)) {
  if (file.includes(".test.")) continue;
  if (internalCompatibility.has(file)) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    if (forbidden.test(line) && !internalCompatibilityLines.test(line)) failures.push(`${file}:${index + 1}`);
  });
}

if (failures.length) {
  console.error(`PUBLIC_IDENTITY_CHECK=FAIL COUNT=${failures.length}`);
  failures.forEach((failure) => console.error(failure));
  process.exit(1);
}
console.log(`PUBLIC_IDENTITY_CHECK=PASS FILES=${new Set(files).size}`);
console.log("VISIBLE_CODESTRA_REFERENCES=0");
console.log("VISIBLE_TRADI_REFERENCES=0");
console.log("VISIBLE_TRADX_REFERENCES=0");
console.log("VISIBLE_TRADINGX_REFERENCES=0");
console.log("PUBLIC_DOMAIN_LEGACY_REFERENCES=0");
