import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import getEnv from "utils/env";
import { ApiError, getApiErrorMessage } from "api/errors";

type ResetPasswordVariables = {
  uidb64?: string;
  token?: string;
  data: { new_password: string; new_password_confirm: string };
};

type VerificationReponse = { detail: string };

type useResetPasswordProps = {
  onSuccess?: (
    data: VerificationReponse,
    variables: ResetPasswordVariables,
    context: unknown
  ) => void;
  onError?: (
    error: Error,
    variables: ResetPasswordVariables,
    context: unknown
  ) => void;
  [index: string]: any;
};

export async function fetchResetPassword(data: ResetPasswordVariables) {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  if (!data.uidb64 || !data.token) throw new ApiError("This password reset link is incomplete.", 400);

  const response = await fetch(
      `${BASE_URL}/user/password_reset_confirm/${data.uidb64}/${data.token}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data.data),
      }
  );
  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = getApiErrorMessage(result, "Unable to reset the password. The link may have expired.");
    toast.error(message);
    throw new ApiError(message, response.status);
  }
  return result as VerificationReponse;
}

export const useResetPassword = (props: useResetPasswordProps) => {
  const receivedProps = props || ({} as useResetPasswordProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<VerificationReponse, Error, ResetPasswordVariables>({
    mutationFn: fetchResetPassword,
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

export default useResetPassword;
