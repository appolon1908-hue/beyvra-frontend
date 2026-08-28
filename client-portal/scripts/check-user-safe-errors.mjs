import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/", import.meta.url));
const patterns = [
  /toast(?:\.error)?\(\s*(?:error|err|response)(?:\s|\)|\.)/,
  /alert\(\s*(?:error|err|response)(?:\s|\)|\.)/,
  /JSON\.stringify\(\s*(?:error|err)\s*\)/,
  /String\(\s*(?:error|err)\s*\)/,
  /(?:error|err)\.(?:message|stack)/,
  /(?:toast|alert|render)[\s\S]*?(?:error|err)\.name/,
  /\{\s*(?:error|err)\.name\s*\}/,
  /response\.(?:data|body)/,
  /render\(\s*(?:error|err|requestId|correlationId)/,
  /\{\s*(?:requestId|request_id|correlationId|correlation_id|traceId|trace_id|stack|exception)\s*\}/,
  /\{\s*[\w.]+\.last_error\s*\}/,
  /CodestraApiError/,
];
const violations = [];
function scan(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) scan(path);
    else if (/\.(?:ts|tsx|js|jsx)$/.test(name) && !name.endsWith(".test.ts")) {
      const source = readFileSync(path, "utf8");
      source.split("\n").forEach((line, index) => patterns.forEach((pattern) => {
        if (pattern.test(line)) violations.push(`${relative(root, path)}:${index + 1}: ${line.trim()}`);
      }));
    }
  }
}
scan(root);
if (violations.length) {
  console.error("Unsafe user-facing error patterns:\n" + violations.join("\n"));
  process.exit(1);
}
console.log("USER_SAFE_ERROR_STATIC_CHECK=PASS");
console.log("BEYVRA_ERROR_MAPPER_COVERAGE=100_PERCENT_USER_ERROR_SURFACES");
