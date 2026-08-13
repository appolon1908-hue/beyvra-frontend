import { useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

export type TenantContext = { tenantId: string; name: string; active: boolean; role: string; environment: string };

export function useTenantContext() {
  const [cookies] = useCookies(["access_token"]);
  return useQuery({
    queryKey: ["tenant-context"],
    enabled: Boolean(cookies.access_token),
    queryFn: () => authenticatedRequest<TenantContext>(apiEndpoints.integrations.tenantContext, cookies.access_token),
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
