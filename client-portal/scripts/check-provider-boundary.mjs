import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("../src/", import.meta.url).pathname;
const forbidden = [
  /api\.coingecko\.com/i, /pro-api\.coingecko\.com/i,
  /api\.tradestation\.com/i, /sim-api\.tradestation\.com/i,
  /interactivebrokers\.com/i, /api\.polygon\.io/i,
  /api\.alpaca\.markets/i, /newsdata\.io/i,
];

const files = [];
const visit = (directory) => {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) visit(path);
    else if (/\.(?:ts|tsx|js|jsx)$/.test(name)) files.push(path);
  }
};
visit(root);

const violations = files.flatMap((file) => {
  const source = readFileSync(file, "utf8");
  return forbidden.filter((pattern) => pattern.test(source)).map((pattern) => `${relative(root, file)}: ${pattern}`);
});
if (violations.length) {
  console.error(`Direct provider references are prohibited:\n${violations.join("\n")}`);
  process.exit(1);
}
console.log(`Provider boundary PASS (${files.length} source files checked)`);

