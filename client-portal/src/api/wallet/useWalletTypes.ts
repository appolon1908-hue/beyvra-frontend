import { useMutation } from "@tanstack/react-query";
import { IWalletType } from "@interfaces";
import getEnv from "utils/env";

type WalletTypeResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: IWalletType[];
};

type useWalletTypesProps = {
  onSuccess?: (
    data: WalletTypeResponse,
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function fetchWalletTypes(token: string): Promise<WalletTypeResponse> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  try {
    const response = await fetch(`${BASE_URL}/wallet/currencies/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result}`);
    }
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
}

export const useWalletTypes = (props: useWalletTypesProps) => {
  const receivedProps = props || ({} as useWalletTypesProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: (token: string) => fetchWalletTypes(token),
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

export default useWalletTypes;
