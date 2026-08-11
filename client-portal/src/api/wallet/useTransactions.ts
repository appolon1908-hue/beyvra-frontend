import { useMutation } from "@tanstack/react-query";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

export type TransactionHistoryEntry = {
  id: string;
  type: "ORDER" | "TRADE" | "FEE" | "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "ADJUSTMENT" | "RESERVATION" | "SETTLEMENT";
  asset: string;
  instrument?: string;
  side?: string;
  quantity?: string;
  price?: string;
  amount: string;
  fee: string;
  status: string;
  occurred_at: string;
  settled_at: string | null;
  source_ref: string;
  simulation: boolean;
};

export type TransactionResultType = {
  next: string | null;
  results: TransactionHistoryEntry[];
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
    asset?: string;
    created_after?: string;
    created_before?: string;
    cursor?: string;
    instrument?: string;
    limit?: number;
    status?: string;
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

  return useMutation<TransactionResultType, unknown, FetchTransactionsArgs>({
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
