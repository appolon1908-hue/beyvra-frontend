import { describe, expect, it } from "vitest";
import { beyvraAuthApi, beyvraDemoApi, beyvraRealtimeV2Api } from "./beyvra";
import { codestraAuthApi, codestraDemoApi, codestraRealtimeV2Api } from "./codestraDemo";

describe("generated client compatibility", () => {
  it("keeps legacy exports as aliases of the canonical Beyvra client", () => {
    expect(beyvraAuthApi).toBe(codestraAuthApi);
    expect(beyvraDemoApi).toBe(codestraDemoApi);
    expect(beyvraRealtimeV2Api).toBe(codestraRealtimeV2Api);
  });
});
