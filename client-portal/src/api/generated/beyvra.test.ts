import { describe, expect, it } from "vitest";
import { beyvraAuthApi, beyvraRealtimeV2Api } from "./beyvra";
import { codestraAuthApi, codestraRealtimeV2Api } from "./codestraDemo";

describe("generated client compatibility", () => {
  it("keeps legacy exports as aliases of the canonical Beyvra client", () => {
    expect(beyvraAuthApi).toBe(codestraAuthApi);
    expect(beyvraRealtimeV2Api).toBe(codestraRealtimeV2Api);
  });
});
