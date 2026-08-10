import { useMutation } from "@tanstack/react-query";
import { beyvraWalletApi } from "api/generated/beyvra";
import IPaymentType from "@interfaces/IPaymentType";

type Props = {
  onSuccess?: (
    data: IPaymentType[],
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function fetchTradeList(token: string) {
  return beyvraWalletApi.paymentMethods(token);
}

export const useQRCodeList = (props: Props) => {
  const receivedProps = props || ({} as Props);

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

export default useQRCodeList;
