import { useMutation } from "@tanstack/react-query";
import { ITransaction } from "@interfaces";
import getEnv from "utils/env";

export type TransactionResultType = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ITransaction[];
};

type UseTransactionsProps = {
  onSuccess?: (
    data: TransactionResultType,
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

type FetchTransactionsArgs = {
  token: string;
  options?: {
    currency: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_desc?: string;
    status?: "PENDING" | "SUCCESSFUL" | "FAILED" | "REFUNDED";
    type?: "DEPOSIT" | "WITHDRAWAL" | "TRADE" | "TRANSFER";
  };
};

export async function fetchTransactions({
  token,
  options,
}: FetchTransactionsArgs): Promise<TransactionResultType> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");

  const searchParams = new URLSearchParams();

  if (options) {
    Object.keys(options).forEach((key) => {
      if (options[key as keyof FetchTransactionsArgs["options"]]) {
        return searchParams.set(
          key,
          String(options[key as keyof FetchTransactionsArgs["options"]])
        );
      }
    });
  }

  try {
    const response = await fetch(
      `${BASE_URL}/wallet/transactions/?${searchParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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

export async function fetchTransactions2({
  token,
  options,
}: FetchTransactionsArgs): Promise<TransactionResultType> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");

  const searchParams = new URLSearchParams();

  if (options) {
    Object.keys(options).forEach((key) => {
      if (options[key as keyof FetchTransactionsArgs["options"]]) {
        return searchParams.set(
          key,
          String(options[key as keyof FetchTransactionsArgs["options"]])
        );
      }
    });
  }

  try {
    const response = await fetch(
      `${BASE_URL}/wallet/withdrawal-request/?${searchParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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

export const useTransactions = (props: UseTransactionsProps) => {
  const receivedProps = props || ({} as UseTransactionsProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: fetchTransactions2,
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

export default useTransactions;
