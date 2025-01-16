import { useMutation } from "@tanstack/react-query";
import { IWallet } from "@interfaces";
import getEnv from "utils/env";

type WalletsResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: IWallet[];
};

type useWalletProps = {
  onSuccess?: (data: WalletsResponse, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function fethWallet(token: string): Promise<WalletsResponse> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
    try {
    const response = await fetch(`${BASE_URL}/wallet/wallets/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result}`);
    }
    return {
      count: result.count || 0,
      next: result.next || null,
      previous: result.previous || null,
      results: result.results || [],
    };
  } catch (error) {
    throw new Error(error as string);
  }
}

export const useWallet = (props: useWalletProps) => {
  const receivedProps = props || ({} as useWalletProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: (token: string) => fethWallet(token),
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

export default useWallet;
