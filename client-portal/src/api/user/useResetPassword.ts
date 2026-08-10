import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { beyvraAuthApi } from "api/generated/beyvra";
import { ApiError } from "api/errors";
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";

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
  if (!data.uidb64 || !data.token) throw new ApiError(400, "VALIDATION_ERROR");
  try { return await beyvraAuthApi.resetPassword<VerificationReponse>(data.uidb64, data.token, data.data); }
  catch (error) { logInternalError(error, { endpoint: "auth.password_reset" }); toast.error(toUserSafeErrorText(error, "auth")); throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN"); }
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
