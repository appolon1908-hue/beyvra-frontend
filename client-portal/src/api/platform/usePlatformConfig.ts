import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { PlatformFeatureFlags, stagingPlatformFeatures } from "config/platformFeatures";
import { codestraDemoApi } from "api/generated/codestraDemo";

export async function fetchPlatformConfig(token: string): Promise<PlatformFeatureFlags> {
  const payload = await codestraDemoApi.config(token);
  return { ...stagingPlatformFeatures, ...payload } as PlatformFeatureFlags;
}

export function usePlatformConfig() {
  const [cookies] = useCookies(["access_token"]);
  return useQuery({
    queryKey: ["platform-config", cookies.access_token ?? "anonymous"],
    queryFn: () => fetchPlatformConfig(cookies.access_token ?? ""),
    enabled: Boolean(cookies.access_token),
    staleTime: 5 * 60_000,
    retry: 1,
    placeholderData: stagingPlatformFeatures,
  });
}
