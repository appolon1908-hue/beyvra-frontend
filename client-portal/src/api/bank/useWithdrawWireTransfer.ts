import { useMutation } from "@tanstack/react-query";
import { beyvraBankApi } from "api/generated/beyvra";

type FetcherData = { data: any; token: string };

export async function withdrawWireTransferFetcher({
  data,
  token,
}: FetcherData): Promise<boolean> {
  try {
    return beyvraBankApi.save(token, data);
  } catch (error) {
    throw new Error(error as string);
  }
}

type Props = {
  onSuccess?: (data: unknown, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export const useWithdrawWireTransfer = (props: Props) => {
  const receivedProps = props;

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: withdrawWireTransferFetcher,
    onSuccess: (data, variables, context) => {
      /* Add On success actions here if needed */
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

export default useWithdrawWireTransfer;
