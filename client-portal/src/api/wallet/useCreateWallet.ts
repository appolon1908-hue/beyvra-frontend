import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { IWallet } from "@interfaces";
import getEnv from "utils/env";

type useCreateWalletProps = {
  onSuccess?: (data: IWallet, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

type WalletData = {
  account_type: number;
};

export async function fetchCreateWallet(
  data: IWallet[],
  token: string
): Promise<boolean> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  console.log(data);
  try {
    const response = await fetch(`${BASE_URL}/wallet/wallets/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    console.log(response);
    const result = await response.json();
    console.log(result);

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

export const useCreateWallet = (props: useCreateWalletProps) => {
  const receivedProps = props || ({} as useCreateWalletProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: (variables) =>
      fetchCreateWallet(variables.data, variables.token),
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

export default useCreateWallet;