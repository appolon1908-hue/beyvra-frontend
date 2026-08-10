import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { beyvraAuthApi } from "api/generated/beyvra";

type SendPhoneResponse = {
  detail: string;
};

type useSendPhoneVerificationProps = {
  onSuccess?: (
    data: SendPhoneResponse,
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function fetchPhoneVerification(token: string) {
  return beyvraAuthApi.sendPhoneVerification(token);
}

export const useSendPhoneVerification = (
  props: useSendPhoneVerificationProps
) => {
  const receivedProps = props || ({} as useSendPhoneVerificationProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: fetchPhoneVerification,
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

export default useSendPhoneVerification;
