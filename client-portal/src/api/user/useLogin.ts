import { ISignInForm, IUser } from "@interfaces";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ApiError } from "api/errors";
import { beyvraAuthApi } from "api/generated/beyvra";
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";
import type { BaseMutationHookOptions } from "api/types";

export interface LoginResponse {
  access?: string;
  refresh?: string;
  user?: IUser;
  mfa_required?: boolean;
  login_token?: string;
}

// Backward compatibility alias
export type LoginSuccess = LoginResponse;
/**
 * Authenticates user with email and password
 * @param data - Login credentials
 * @returns Access token, refresh token, and user info
 * @throws ApiError on authentication failure
 */
export async function fetchLogin(data: ISignInForm): Promise<LoginResponse> {
  try {
    return await beyvraAuthApi.login<LoginResponse>(data);
  } catch (error) {
    logInternalError(error, { endpoint: "auth.login" });
    toast.error(toUserSafeErrorText(error, "auth"));
    throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN");
  }
}

type UseLoginProps = BaseMutationHookOptions<LoginResponse, ISignInForm>;

/**
 * Hook for user login
 * @example
 * const { mutate, isPending } = useLogin({
 *   onSuccess: (response) => {
 *     setCookie("access_token", response.access);
 *   }
 * });
 * mutate({ email: "user@example.com", password: "..." });
 */
export const useLogin = (props?: UseLoginProps) => {
  const receivedProps = props || ({} as UseLoginProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<LoginResponse, Error, ISignInForm>({
    mutationFn: fetchLogin,
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

export default useLogin;

