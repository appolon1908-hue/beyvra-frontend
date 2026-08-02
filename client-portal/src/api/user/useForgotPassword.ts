import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import getEnv from "utils/env";
import { ApiError, getApiErrorMessage } from "api/errors";

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
    error: Error,
    variables: unknown,
    context: unknown
  ) => void;
  [index: string]: any;
};

type ForgotPasswordVariables = {
  email: string;
};

export async function fetchForgotPassword(data: ForgotPasswordVariables): Promise<ForgotPassResponse> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  const response = await fetch(`${BASE_URL}/user/password_reset/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
  });
  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = getApiErrorMessage(result, "Unable to request a password reset. Please try again.");
    toast.error(message);
    throw new ApiError(message, response.status);
  }
  return result as ForgotPassResponse;
}

export const useFrogotPassowrd = (props: useFrogotPassowrdProps) => {
  const receivedProps = props || ({} as useFrogotPassowrdProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<ForgotPassResponse, Error, ForgotPasswordVariables>({
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
