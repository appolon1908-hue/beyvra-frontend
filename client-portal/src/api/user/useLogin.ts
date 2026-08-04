import { ISignInForm, IUser } from "@interfaces";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ApiError, getApiErrorMessage } from "api/errors";
import { codestraAuthApi } from "api/generated/codestraDemo";

export async function fetchLogin(data: ISignInForm): Promise<LoginSuccess> {
  try {
    return await codestraAuthApi.login<LoginSuccess>(data);
  } catch (error) {
    const message = getApiErrorMessage(error, "Unable to sign in. Please try again.");
    toast.error(message);
    throw error instanceof ApiError ? error : new ApiError(message, 500);
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
