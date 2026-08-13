import fs from "node:fs";
import path from "node:path";

const endpoint = process.env.LIBRETRANSLATE_URL;
const apiKey = process.env.LIBRETRANSLATE_API_KEY;
if (!endpoint) throw new Error("LIBRETRANSLATE_URL is required");

const root = path.join(process.cwd(), "public", "locales");
const source = JSON.parse(fs.readFileSync(path.join(root, "en", "translation.json"), "utf8"));
const targets = fs.readdirSync(root).filter((locale) => locale !== "en");

for (const target of targets) {
  const file = path.join(root, target, "translation.json");
  const catalog = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [key, english] of Object.entries(source)) {
    if (catalog[key] && catalog[key] !== english) continue;
    const response = await fetch(`${endpoint.replace(/\/$/, "")}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: english, source: "en", target, format: "text", ...(apiKey ? { api_key: apiKey } : {}) }),
    });
    if (!response.ok) throw new Error(`LibreTranslate ${response.status} for ${target}:${key}`);
    catalog[key] = (await response.json()).translatedText;
  }
  fs.writeFileSync(file, `${JSON.stringify(catalog, null, 2)}\n`);
}
