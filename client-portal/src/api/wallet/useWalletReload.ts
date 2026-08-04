import { useMutation } from "@tanstack/react-query";

import { codestraWalletApi } from "api/generated/codestraDemo";
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
  try {
    return await codestraWalletApi.refillLegacy(token, id) as boolean;
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
