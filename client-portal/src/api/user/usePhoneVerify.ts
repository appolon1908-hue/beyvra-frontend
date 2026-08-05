import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { codestraAuthApi } from "api/generated/codestraDemo";

type PhoneVerificationVariables = {
  code: string;
};

type VerificationReponse = { detail: string };

type usePhoneVerifyProps = {
  onSuccess?: (
    data: VerificationReponse,
    variables: PhoneVerificationVariables,
    context: unknown
  ) => void;
  onError?: (
    error: VerificationReponse,
    variables: PhoneVerificationVariables,
    context: unknown
  ) => void;
  [index: string]: any;
};

export async function fetchPhoneVerify(
  data: PhoneVerificationVariables,
  token: string
) {
  return codestraAuthApi.verifyPhone(token, data);
}

export const usePhoneVerify = (props: usePhoneVerifyProps) => {
  const receivedProps = props || ({} as usePhoneVerifyProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, VerificationReponse, any>({
    mutationFn: (variables) =>
      fetchPhoneVerify(variables.data, variables.token),
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

export default usePhoneVerify;
