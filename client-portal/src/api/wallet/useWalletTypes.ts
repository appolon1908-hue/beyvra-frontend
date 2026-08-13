import { useMutation } from "@tanstack/react-query";
import { IWalletType } from "@interfaces";
import { beyvraWalletApi } from "api/generated/beyvra";

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
  return beyvraWalletApi.currencies<WalletTypeResponse>(token);
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
