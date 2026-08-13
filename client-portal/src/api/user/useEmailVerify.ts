import { useMutation } from "@tanstack/react-query";

import { beyvraAuthApi } from "api/generated/beyvra";

type EmailVerificationVariables = {
  uidb64?: string;
  token?: string;
};

type VerificationReponse = { detail: string };

type useEmailVerifyProps = {
  onSuccess?: (
    data: VerificationReponse,
    variables: EmailVerificationVariables,
    context: unknown
  ) => void;
  onError?: (
    error: VerificationReponse,
    variables: EmailVerificationVariables,
    context: unknown
  ) => void;
  [index: string]: any;
};

export async function fetchEmailVerify(data: EmailVerificationVariables) {
  if (!data.uidb64 || !data.token) throw new Error("Verification link is incomplete.");
  return beyvraAuthApi.verifyEmail<VerificationReponse>(data.uidb64, data.token);
}

export const useEmailVerify = (props: useEmailVerifyProps) => {
  const receivedProps = props || ({} as useEmailVerifyProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, VerificationReponse, EmailVerificationVariables>({
    mutationFn: fetchEmailVerify,
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

export default useEmailVerify;
