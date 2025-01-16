import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import getEnv from "utils/env";
import { WalletData } from "@store/slices/wallet";

type useUpdateWalletProps = {
  onSuccess?: (data: {wallet: WalletData}, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function tradeTransaction(
  data: WalletData,
  token: string,
): Promise<boolean> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  try {
    console.log(token);
    const response = await fetch(`${BASE_URL}/trades/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    console.log(response);
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

export const useTrade = (props: useUpdateWalletProps) => {
  const receivedProps = props || ({} as useUpdateWalletProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: (variables) =>
      tradeTransaction(variables.data, variables.token),
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

export default useTrade;
