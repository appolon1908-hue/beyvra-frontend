export type CompatibilityStorage = Pick<Storage, "getItem" | "setItem">;

export function readWithLegacyMigration(
  storage: CompatibilityStorage | undefined,
  newKey: string,
  legacyKey: string,
): string | null {
  if (!storage) return null;
  const current = storage.getItem(newKey);
  if (current !== null) return current;
  const legacy = storage.getItem(legacyKey);
  if (legacy !== null) storage.setItem(newKey, legacy);
  return legacy;
}

export function writeCompatibilityValue(
  storage: CompatibilityStorage | undefined,
  newKey: string,
  value: string,
  legacyKey?: string,
): void {
  if (!storage) return;
  storage.setItem(newKey, value);
  // Cross-tab/session protocols need old open clients to observe the transition.
  if (legacyKey) storage.setItem(legacyKey, value);
}
