import { useMutation } from "@tanstack/react-query";
import { ITransaction } from "@interfaces";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

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

  return authenticatedRequest<TransactionResultType>(`${apiEndpoints.wallets.transactions}?${searchParams}`, token);
}

export const useTransactions = (props: UseTransactionsProps) => {
  const receivedProps = props || ({} as UseTransactionsProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: fetchTransactions,
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
