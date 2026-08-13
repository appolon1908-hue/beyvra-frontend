import { describe, expect, it } from "vitest";
import { readWithLegacyMigration, writeCompatibilityValue } from "./storageKeys";

class MemoryStorage {
  values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe("browser storage compatibility", () => {
  it("prefers the Beyvra key", () => {
    const storage = new MemoryStorage();
    storage.setItem("beyvra.key", "new"); storage.setItem("codestra.key", "old");
    expect(readWithLegacyMigration(storage, "beyvra.key", "codestra.key")).toBe("new");
  });
  it("migrates an existing user's legacy value", () => {
    const storage = new MemoryStorage(); storage.setItem("codestra.key", "old");
    expect(readWithLegacyMigration(storage, "beyvra.key", "codestra.key")).toBe("old");
    expect(storage.getItem("beyvra.key")).toBe("old");
  });
  it("writes new state and optionally notifies legacy open tabs", () => {
    const storage = new MemoryStorage();
    writeCompatibilityValue(storage, "beyvra.key", "value", "codestra.key");
    expect(storage.getItem("beyvra.key")).toBe("value");
    expect(storage.getItem("codestra.key")).toBe("value");
  });
});
