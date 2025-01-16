import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import getEnv from "utils/env";

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
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  try {
    const response = await fetch(`${BASE_URL}/user/verify_phone/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!response.ok) {
      toast.error(result.detail);
      throw new Error(`${result}`);
    }
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
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
