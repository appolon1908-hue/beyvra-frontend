import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ApiError } from "api/errors";
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";
import { beyvraAuthApi } from "api/generated/beyvra";
import type { IUser } from "@interfaces";

export interface RegisterResponse {
  access: string;
  refresh: string;
  user: IUser;
}

export async function fetchRegister(data: Record<string, string>): Promise<RegisterResponse> {
  try {
    return await beyvraAuthApi.register<RegisterResponse>(data);
  } catch (error) {
    logInternalError(error, { endpoint: "auth.register" });
    toast.error(toUserSafeErrorText(error, "auth"));
    throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN");
  }
}

/** @deprecated Use fetchRegister. */
export const fethRegister = fetchRegister;

type useRegisterProps = {
  onSuccess?: (data: RegisterResponse, variables: Record<string, string>, context: unknown) => void;
  onError?: (error: Error, variables: Record<string, string>, context: unknown) => void;
  [index: string]: any;
};
export const useRegister = (props: useRegisterProps) => {
  const receivedProps = props || ({} as useRegisterProps);

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
