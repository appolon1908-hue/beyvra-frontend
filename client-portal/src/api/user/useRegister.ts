import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import getEnv from "utils/env";
import { ApiError, getApiErrorMessage } from "api/errors";
import type { IUser } from "@interfaces";

export interface RegisterResponse {
  access: string;
  refresh: string;
  user: IUser;
}

export async function fetchRegister(data: Record<string, string>): Promise<RegisterResponse> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  const response = await fetch(`${BASE_URL}/user/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
  });
  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = getApiErrorMessage(result, "Unable to register. Please try again.");
    toast.error(message);
    throw new ApiError(message, response.status);
  }
  return result as RegisterResponse;
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
