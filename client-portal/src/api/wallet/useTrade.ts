import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { WalletData } from "@store/slices/wallet";
import { authenticatedRequest } from "api/client";
import { apiEndpoints } from "api/endpoints";

type useUpdateWalletProps = {
  onSuccess?: (data: {wallet: WalletData}, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function tradeTransaction(
  data: WalletData,
  token: string,
): Promise<boolean> {
  try {
    return await authenticatedRequest<boolean>(apiEndpoints.trades.list, token, {
      method: "POST",
      headers: {
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Trade could not be placed");
    throw error;
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
