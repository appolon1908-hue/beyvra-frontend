import { ISignInForm, IUser } from "@interfaces";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import getEnv from "utils/env";
import { ApiError, getApiErrorMessage } from "api/errors";

export async function fetchLogin(data: ISignInForm): Promise<LoginSuccess> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  const response = await fetch(`${BASE_URL}/user/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
  });
  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = getApiErrorMessage(result, "Unable to sign in. Please try again.");
    toast.error(message);
    throw new ApiError(message, response.status);
  }
  return result as LoginSuccess;
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
