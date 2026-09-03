import { describe, expect, it } from "vitest";
import { ApiError } from "api/errors";
import { assertMutationsAllowed } from "./deploymentMode";

describe("deployment read-only mutation guard", () => {
  it("blocks mutation preparation before CSRF or network work", () => {
    try {
      assertMutationsAllowed("request-blocked", true);
      throw new Error("expected mutation guard to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({
        status: 503,
        code: "DEPLOYMENT_READ_ONLY",
        requestId: "request-blocked",
      });
    }
  });

  it("allows mutations when the deployment is explicitly active", () => {
    expect(() => assertMutationsAllowed("request-active", false)).not.toThrow();
  });
});
