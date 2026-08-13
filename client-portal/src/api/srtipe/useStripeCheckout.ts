import { useMutation } from "@tanstack/react-query";

type FetcherData = { amount: number; walletId: string; token: string };

export async function stripeCheckoutFetcher({
  amount,
  walletId,
  token,
}: FetcherData): Promise<boolean> {
  void amount; void walletId; void token;
  throw new Error("Payments are unavailable in the Beyvra Demo environment.");
}

type Props = {
  onSuccess?: (data: unknown, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export const useStripeCheckout = (props: Props) => {
  const receivedProps = props;

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: stripeCheckoutFetcher,
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

export default useStripeCheckout;
