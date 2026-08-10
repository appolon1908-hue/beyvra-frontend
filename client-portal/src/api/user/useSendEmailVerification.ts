import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { beyvraAuthApi } from "api/generated/beyvra";

type SendEmailResponse = {
  detail: string;
};

type useSendEmailVerificationProps = {
  onSuccess?: (
    data: SendEmailResponse,
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function fetchEmailVerification({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  return beyvraAuthApi.sendEmailVerification<SendEmailResponse>(token, email);
}

export const useSendEmailVerification = (
  props: useSendEmailVerificationProps
) => {
  const receivedProps = props || ({} as useSendEmailVerificationProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: fetchEmailVerification,
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

export default useSendEmailVerification;
