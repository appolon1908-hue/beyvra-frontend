import { useMutation } from "@tanstack/react-query";
import { IWalletType } from "@interfaces";
import { beyvraWalletApi } from "api/generated/beyvra";

type WalletTypeResponse = {
  
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

export async function fetchTradeList(token: string) {
  return beyvraWalletApi.tradeAssets(token);
}

export const useTradeList = (props: useWalletTypesProps) => {
  const receivedProps = props || ({} as useWalletTypesProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: (token: string) => fetchTradeList(token),
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

export default useTradeList;
