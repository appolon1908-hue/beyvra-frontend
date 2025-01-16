import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import getEnv from "utils/env";

type ForgotPassResponse = {
  detail: string;
};

type useFrogotPassowrdProps = {
  onSuccess?: (
    data: ForgotPassResponse,
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (
    error: ForgotPassResponse,
    variables: unknown,
    context: unknown
  ) => void;
  [index: string]: any;
};

type ForgotPasswordVariables = {
  email: string;
};

export async function fetchForgotPassword(data: ForgotPasswordVariables) {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  try {
    const response = await fetch(`${BASE_URL}/user/password_reset/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
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

export const useFrogotPassowrd = (props: useFrogotPassowrdProps) => {
  const receivedProps = props || ({} as useFrogotPassowrdProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, ForgotPassResponse, any>({
    mutationFn: fetchForgotPassword,
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

export default useFrogotPassowrd;
