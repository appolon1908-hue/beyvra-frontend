import { useQuery } from "@tanstack/react-query";
import { financialApi, listResults } from "./api";
import { DISABLED_FINANCIAL_FEATURES, MoneyActivity, toMoneyActivity } from "./types";

const keys = {
  features: ["financial", "features"] as const,
  wallets: ["financial", "wallets"] as const,
  compliance: ["financial", "compliance"] as const,
  requirements: ["financial", "requirements"] as const,
  activity: ["financial", "activity"] as const,
};

export function useFinancialFeatures(token?: string) {
  return useQuery({
    queryKey: keys.features,
    queryFn: () => financialApi.features(token),
    staleTime: 30_000,
    retry: false,
    placeholderData: DISABLED_FINANCIAL_FEATURES,
  });
}

export function useWalletSnapshots(token: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: keys.wallets,
    queryFn: async () => listResults(await financialApi.wallets(token)),
    enabled,
    retry: false,
  });
}

export function useCompliance(token: string | undefined, enabled: boolean) {
  const profile = useQuery({
    queryKey: keys.compliance,
    queryFn: () => financialApi.complianceProfile(token),
    enabled,
    retry: false,
  });
  const requirements = useQuery({
    queryKey: keys.requirements,
    queryFn: () => financialApi.complianceRequirements(token),
    enabled,
    retry: false,
  });
  return { profile, requirements };
}

export function useMoneyActivity(token: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: keys.activity,
    queryFn: async (): Promise<MoneyActivity[]> => {
      const [deposits, withdrawals, transfers] = await Promise.all([
        financialApi.deposits(token), financialApi.withdrawals(token), financialApi.transfers(token),
      ]);
      return [
        ...listResults(deposits).map((value) => toMoneyActivity(value, "DEPOSIT")),
        ...listResults(withdrawals).map((value) => toMoneyActivity(value, "WITHDRAWAL")),
        ...listResults(transfers).map((value) => toMoneyActivity(value, "TRANSFER")),
      ].sort((left, right) => Date.parse(right.occurred_at) - Date.parse(left.occurred_at));
    },
    enabled,
    retry: false,
  });
}
