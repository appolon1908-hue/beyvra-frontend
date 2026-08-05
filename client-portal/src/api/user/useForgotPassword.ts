import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { codestraAuthApi } from "api/generated/codestraDemo";
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
  try { return await codestraAuthApi.forgotPassword<ForgotPassResponse>(data); }
  catch (error) { const message = getApiErrorMessage(error, "Unable to request a password reset. Please try again."); toast.error(message); throw error instanceof ApiError ? error : new ApiError(message, 500); }
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
