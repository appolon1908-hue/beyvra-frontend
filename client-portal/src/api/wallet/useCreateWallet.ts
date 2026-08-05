import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { IWallet } from "@interfaces";
import { codestraWalletApi } from "api/generated/codestraDemo";

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
  return codestraWalletApi.create(token, data) as Promise<boolean>;
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
