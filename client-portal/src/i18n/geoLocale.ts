import type { i18n } from "i18next";

const countryLocales: Record<string, string> = {
  AE: "ar", AR: "es", AT: "de", AU: "en", BR: "en", CA: "en",
  CH: "de", CL: "es", CO: "es", DE: "de", EG: "ar", ES: "es",
  FR: "fr", GB: "en", IN: "hi", JP: "ja", MA: "ar", MX: "es",
  NG: "en", PE: "es", SA: "ar", US: "en",
};

export async function applyGeoLocaleHint(instance: i18n) {
  if (localStorage.getItem("i18nextLng")) return;
  const endpoint = import.meta.env.VITE_GEOIP_ENDPOINT;
  if (!endpoint) return;

  try {
    const response = await fetch(endpoint, { credentials: "same-origin" });
    if (!response.ok) return;
    const data = await response.json() as { country_code?: string; country?: { iso_code?: string } };
    const countryCode = (data.country_code || data.country?.iso_code || "").toUpperCase();
    const locale = countryLocales[countryCode];
    if (locale) await instance.changeLanguage(locale);
  } catch {
    // Browser and persisted language detection remain the safe fallback.
  }
}
