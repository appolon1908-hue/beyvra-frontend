import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

type DemoFundsInput = { walletId: number; amount: number };

export function useDemoDeposit(token?: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ walletId, amount }: DemoFundsInput) => authenticatedRequest(
      apiEndpoints.wallets.deposit(walletId), token!, {
        method: "POST",
        body: JSON.stringify({ amount, currency: "USD", gateway: "demo" }),
      }
    ),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["portfolio-summary"] });
      client.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDemoWithdrawal(token?: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ walletId, amount }: DemoFundsInput) => authenticatedRequest(
      apiEndpoints.wallets.withdraw(walletId), token!, {
        method: "POST",
        body: JSON.stringify({ amount, gateway: "demo" }),
      }
    ),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["portfolio-summary"] });
      client.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
