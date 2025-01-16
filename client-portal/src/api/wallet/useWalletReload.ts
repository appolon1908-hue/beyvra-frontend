import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import getEnv from "utils/env";
import { WalletData } from "@store/slices/wallet";

type useUpdateWalletProps = {
  onSuccess?: (data: {wallet: WalletData}, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function fetchRefillWallet(
  id: string | number,
  token: string,
): Promise<boolean> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  try {
    const response = await fetch(`${BASE_URL}/wallet/wallets/${id}/refill/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      Object.keys(result).forEach((field) => {
        const errors = result[field];
        errors.forEach((errorMessage: string) => {
          toast.error(`${field}: ${errorMessage}`);
        });
      });
      throw new Error(`${result}`);
    }
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
}

export const useWalletRefill = (props: useUpdateWalletProps) => {
  const receivedProps = props || ({} as useUpdateWalletProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: (variables) =>
      fetchRefillWallet( variables?.id, variables.token),
    onSuccess: (data, variables, context) => {
      if (onSuccessOverride) {
        onSuccessOverride(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (onErrorOverride) {
        onErrorOverride(error, variables, context);
      }
    },
    ...(rest || {}),
  });
};

export default useWalletRefill;
