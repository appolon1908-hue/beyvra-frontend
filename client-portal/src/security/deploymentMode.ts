import { ApiError } from "api/errors";
import getEnv from "utils/env";

export const isDeploymentReadOnly = () =>
  String(getEnv("VITE_DEPLOYMENT_READ_ONLY") || "").trim().toLowerCase() === "true";

export function assertMutationsAllowed(
  requestId: string = crypto.randomUUID(),
  deploymentReadOnly = isDeploymentReadOnly(),
): void {
  if (deploymentReadOnly) {
    throw new ApiError(503, "DEPLOYMENT_READ_ONLY", requestId);
  }
}
