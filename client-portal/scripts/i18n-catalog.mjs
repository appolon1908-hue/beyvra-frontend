import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const localeRoot = path.join(root, "public", "locales");
const sourceRoot = path.join(root, "src");
const sourceLocale = "en";
const write = process.argv.includes("--write");

const walk = (dir, extensions) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const fullPath = path.join(dir, entry.name);
  if (entry.isDirectory()) return walk(fullPath, extensions);
  return extensions.some((extension) => entry.name.endsWith(extension)) ? [fullPath] : [];
});

const flatten = (value, prefix = "", result = {}) => {
  for (const [key, child] of Object.entries(value)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) flatten(child, fullKey, result);
    else result[fullKey] = child;
  }
  return result;
};

const usedKeys = new Set();
const hardCodedText = [];
for (const file of walk(sourceRoot, [".ts", ".tsx"])) {
  const source = fs.readFileSync(file, "utf8");
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "t") {
      const argument = node.arguments[0];
      if (argument && (ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument))) usedKeys.add(argument.text);
    }
    if (source.includes("useTranslation") && ts.isJsxText(node)) {
      const value = node.text.replace(/\s+/g, " ").trim();
      const isMarketSymbol = /^[A-Z]{2,}(?:\/[A-Z]{2,})?$/.test(value);
      const isQuotedAmount = /^\d+(?:[.,]\d+)?\s+[A-Z]{3}$/.test(value);
      if (/[A-Za-z]{2}/.test(value) && !isMarketSymbol && !isQuotedAmount) {
        hardCodedText.push(`${path.relative(root, file)}: ${value}`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
}

if (hardCodedText.length) {
  console.error(`Localized components contain ${hardCodedText.length} hard-coded JSX strings:\n${hardCodedText.join("\n")}`);
  process.exitCode = 1;
}

const locales = fs.readdirSync(localeRoot).filter((name) => fs.statSync(path.join(localeRoot, name)).isDirectory()).sort();
const sourcePath = path.join(localeRoot, sourceLocale, "translation.json");
const sourceCatalog = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const sourceFlat = flatten(sourceCatalog);
const missingSource = [...usedKeys].filter((key) => !(key in sourceFlat)).sort();

if (missingSource.length) {
  console.error(`English source catalog is missing ${missingSource.length} used keys:\n${missingSource.join("\n")}`);
  process.exitCode = 1;
}

for (const locale of locales.filter((name) => name !== sourceLocale)) {
  const file = path.join(localeRoot, locale, "translation.json");
  const catalog = JSON.parse(fs.readFileSync(file, "utf8"));
  const missing = Object.keys(sourceCatalog).filter((key) => !(key in catalog));
  if (write && missing.length) {
    for (const key of missing) catalog[key] = sourceCatalog[key];
    fs.writeFileSync(file, `${JSON.stringify(catalog, null, 2)}\n`);
  } else if (missing.length) {
    console.error(`${locale} is missing ${missing.length} source keys`);
    process.exitCode = 1;
  }
}

if (!process.exitCode) console.log(`Validated ${usedKeys.size} static keys across ${locales.length} locale catalogs.`);
