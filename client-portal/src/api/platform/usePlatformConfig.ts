import { useQuery } from "@tanstack/react-query";
import { PlatformFeatureFlags, stagingPlatformFeatures } from "config/platformFeatures";
import { beyvraDemoApi } from "api/generated/beyvra";

export async function fetchPlatformConfig(token = ""): Promise<PlatformFeatureFlags> {
  const payload = await beyvraDemoApi.config(token);
  return { ...stagingPlatformFeatures, ...payload } as PlatformFeatureFlags;
}

export function usePlatformConfig() {
  return useQuery({
    queryKey: ["platform-config"],
    queryFn: () => fetchPlatformConfig(),
    staleTime: 5 * 60_000,
    retry: 1,
    placeholderData: stagingPlatformFeatures,
  });
}
