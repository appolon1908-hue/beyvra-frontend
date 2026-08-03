import { useQuery } from "@tanstack/react-query";
import { getApiUrl } from "utils/env";
import { PlatformFeatureFlags, stagingPlatformFeatures } from "config/platformFeatures";

export async function fetchPlatformConfig(): Promise<PlatformFeatureFlags> {
  const response = await fetch(getApiUrl("platform/config"), {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("Platform configuration is unavailable");
  return { ...stagingPlatformFeatures, ...(await response.json()) } as PlatformFeatureFlags;
}

export function usePlatformConfig() {
  return useQuery({
    queryKey: ["platform-config"],
    queryFn: fetchPlatformConfig,
    staleTime: 5 * 60_000,
    retry: 1,
    placeholderData: stagingPlatformFeatures,
  });
}
