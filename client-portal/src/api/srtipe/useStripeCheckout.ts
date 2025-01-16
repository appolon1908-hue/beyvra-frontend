import { useMutation } from "@tanstack/react-query";
import getEnv from "utils/env";

type FetcherData = { amount: number; walletId: string; token: string };

export async function stripeCheckoutFetcher({
  amount,
  walletId,
  token,
}: FetcherData): Promise<boolean> {
  try {
    const BASE_URL = getEnv("VITE_API_BASE_URL");
    const response = await fetch(`${BASE_URL}/payment/stripe_checkout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: amount,
        wallet_id: walletId,
      }),
    });
    const result = await response.json();

    if (!response.ok) {
      const errorKey = Object.keys(result)[0];
      const [errorMessage] = result[errorKey] as string;

      throw new Error(errorMessage);
    }
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
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
