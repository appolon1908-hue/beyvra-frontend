import { useMutation } from "@tanstack/react-query";

type DemoFundsInput = { walletId: number; amount: number };
const disabled = async (_input: DemoFundsInput): Promise<never> => {
  throw new Error("SIMULATION_MONEY_MOVEMENT_DISABLED");
};

export function useDemoDeposit(_token?: string) {
  return useMutation({ mutationFn: disabled });
}

export function useDemoWithdrawal(_token?: string) {
  return useMutation({ mutationFn: disabled });
}
