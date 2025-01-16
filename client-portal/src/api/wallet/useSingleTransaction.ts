import { useMutation } from "@tanstack/react-query";
import { ITransaction } from "@interfaces";

import getEnv from "utils/env";

type FetchTransactionVariables = {
  transactionId: string;
  token: string;
};

type useSingleTransactionProps = {
  onSuccess?: (
    data: ITransaction,
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function fetchTransaction(
  data: FetchTransactionVariables
): Promise<ITransaction> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  try {
    const response = await fetch(
      `${BASE_URL}/wallet/transactions/${data.transactionId}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );
    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result}`);
    }
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
}

export const useSingleTransaction = (props: useSingleTransactionProps) => {
  const receivedProps = props || ({} as useSingleTransactionProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<ITransaction, unknown, FetchTransactionVariables>({
    mutationFn: (data: FetchTransactionVariables) => fetchTransaction(data),
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

export default useSingleTransaction;
