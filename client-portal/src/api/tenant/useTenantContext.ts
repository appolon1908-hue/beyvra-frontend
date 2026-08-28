import { useQuery } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

export type TenantContext = { tenantId: string; name: string; active: boolean; role: string; environment: string };

export function useTenantContext() {
  return useQuery({
    queryKey: ["tenant-context"],
    queryFn: () => authenticatedRequest<TenantContext>(apiEndpoints.integrations.tenantContext),
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
