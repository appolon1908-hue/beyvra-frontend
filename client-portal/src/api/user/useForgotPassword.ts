import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { beyvraAuthApi } from "api/generated/beyvra";
import { ApiError } from "api/errors";
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";

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
  try { return await beyvraAuthApi.forgotPassword<ForgotPassResponse>(data); }
  catch (error) { logInternalError(error, { endpoint: "auth.forgot_password" }); toast.error(toUserSafeErrorText(error, "auth")); throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN"); }
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
