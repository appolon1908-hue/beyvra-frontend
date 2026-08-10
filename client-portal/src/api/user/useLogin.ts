import { ISignInForm, IUser } from "@interfaces";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ApiError } from "api/errors";
import { beyvraAuthApi } from "api/generated/beyvra";
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";

export async function fetchLogin(data: ISignInForm): Promise<LoginSuccess> {
  try {
    return await beyvraAuthApi.login<LoginSuccess>(data);
  } catch (error) {
    logInternalError(error, { endpoint: "auth.login" });
    toast.error(toUserSafeErrorText(error, "auth"));
    throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN");
  }
}

/** @deprecated Use fetchLogin. */
export const fethLogin = fetchLogin;

export interface LoginSuccess {
  access?: string;
  refresh?: string;
  user?: IUser;
  mfa_required?: boolean;
  login_token?: string;
}

type useLoginProps = {
  onSuccess?: (
    data: LoginSuccess,
    variables: ISignInForm,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: ISignInForm, context: unknown) => void;
};
export const useLogin = (props: useLoginProps) => {
  const receivedProps = props || ({} as useLoginProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<LoginSuccess, Error, ISignInForm>({
    mutationFn: fetchLogin,
    onSuccess: (data, variables, context) => {
      /* Add On success actions here if needed */
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

export default useLogin;
