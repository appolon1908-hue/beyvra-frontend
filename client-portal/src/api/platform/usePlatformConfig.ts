import { useQuery } from "@tanstack/react-query";
import { PlatformFeatureFlags, stagingPlatformFeatures } from "config/platformFeatures";
import { beyvraDemoApi } from "api/generated/beyvra";
import { BFF_SESSION_MARKER } from "security/bffSession";

export async function fetchPlatformConfig(): Promise<PlatformFeatureFlags> {
  const payload = await beyvraDemoApi.config(BFF_SESSION_MARKER);
  return { ...stagingPlatformFeatures, ...payload } as PlatformFeatureFlags;
}

export function usePlatformConfig() {
  return useQuery({
    queryKey: ["platform-config", "bff-session"],
    queryFn: fetchPlatformConfig,
    staleTime: 5 * 60_000,
    retry: 1,
    placeholderData: stagingPlatformFeatures,
  });
}
