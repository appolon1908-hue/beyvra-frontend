import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ApiError } from "api/errors";
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";
import { beyvraAuthApi } from "api/generated/beyvra";
import type { IUser } from "@interfaces";
import type { BaseMutationHookOptions } from "api/types";

export interface RegisterResponse {
  access: string;
  refresh: string;
  user: IUser;
}

/**
 * Registers a new user account
 * @param data - Registration form data
 * @returns Access token, refresh token, and user info
 * @throws ApiError on registration failure
 */
export async function fetchRegister(data: Record<string, string>): Promise<RegisterResponse> {
  try {
    return await beyvraAuthApi.register<RegisterResponse>(data);
  } catch (error) {
    logInternalError(error, { endpoint: "auth.register" });
    toast.error(toUserSafeErrorText(error, "auth"));
    throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN");
  }
}

type UseRegisterProps = BaseMutationHookOptions<RegisterResponse, Record<string, string>>;

/**
 * Hook for user registration
 * @example
 * const { mutate, isPending } = useRegister({
 *   onSuccess: (response) => {
 *     setCookie("access_token", response.access);
 *   }
 * });
 * mutate({ email: "user@example.com", password: "...", ... });
 */
export const useRegister = (props?: UseRegisterProps) => {
  const receivedProps = props || ({} as UseRegisterProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<RegisterResponse, Error, Record<string, string>>({
    mutationFn: fetchRegister,
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

export default useRegister;
