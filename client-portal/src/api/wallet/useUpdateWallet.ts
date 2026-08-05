import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { codestraWalletApi } from "api/generated/codestraDemo";
import { WalletData } from "@store/slices/wallet";

type useUpdateWalletProps = {
  onSuccess?: (
    data: { wallet: WalletData },
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function fetchUpdateWallet(
  data: WalletData,
  id: string | number,
  token: string,
  archive = false
): Promise<boolean> {
  return (archive ? codestraWalletApi.archive(token, id) : codestraWalletApi.update(token, id, data)) as Promise<boolean>;
}

export const useUpdateWallet = (props: useUpdateWalletProps) => {
  const receivedProps = props || ({} as useUpdateWalletProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: (variables) =>
      fetchUpdateWallet(
        variables.data,
        variables?.id,
        variables.token,
        variables?.archive
      ),
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

export default useUpdateWallet;
