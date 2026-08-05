import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { codestraAuthApi } from "api/generated/codestraDemo";
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
  if (!data.uidb64 || !data.token) throw new ApiError("This password reset link is incomplete.", 400);
  try { return await codestraAuthApi.resetPassword<VerificationReponse>(data.uidb64, data.token, data.data); }
  catch (error) { const message = getApiErrorMessage(error, "Unable to reset the password. The link may have expired."); toast.error(message); throw error instanceof ApiError ? error : new ApiError(message, 500); }
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
