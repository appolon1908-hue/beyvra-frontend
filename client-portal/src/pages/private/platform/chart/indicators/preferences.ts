import { DEFAULT_INDICATORS, IndicatorConfig } from "./types";
import { validateIndicatorConfig } from "./IndicatorEngine";
import { readWithLegacyMigration, writeCompatibilityValue } from "compat/storageKeys";

const KEY = "beyvra.chart.indicators.v1";
const LEGACY_KEY = "codestra.chart.indicators.v1";

export function loadIndicatorPreferences(storage: Pick<Storage, "getItem" | "setItem"> | undefined = typeof localStorage === "undefined" ? undefined : localStorage): IndicatorConfig[] {
  if (!storage) return structuredClone(DEFAULT_INDICATORS);
  try {
    const value = JSON.parse(readWithLegacyMigration(storage, KEY, LEGACY_KEY) || "null");
    if (!Array.isArray(value)) return structuredClone(DEFAULT_INDICATORS);
    return DEFAULT_INDICATORS.map((fallback) => {
      const stored = value.find((item: Partial<IndicatorConfig>) => item?.id === fallback.id && item.type === fallback.type);
      if (!stored) return { ...fallback };
      const candidate = { ...fallback, ...stored } as IndicatorConfig;
      try { validateIndicatorConfig(candidate); return candidate; } catch { return { ...fallback }; }
    });
  } catch { return structuredClone(DEFAULT_INDICATORS); }
}

export function saveIndicatorPreferences(configs: readonly IndicatorConfig[], storage: Pick<Storage, "getItem" | "setItem"> | undefined = typeof localStorage === "undefined" ? undefined : localStorage) {
  writeCompatibilityValue(storage, KEY, JSON.stringify(configs));
}
