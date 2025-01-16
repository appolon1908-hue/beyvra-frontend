import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import getEnv from "utils/env";

type ChangePassResponse = {
  detail: string;
};

type useChangePassowrdProps = {
  onSuccess?: (
    data: ChangePassResponse,
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export type ChangePasswordForm = {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
};

type ChangePasswordVariables = {
  token: string;
  formData: ChangePasswordForm;
};

export async function fetchChangePassword(data: ChangePasswordVariables) {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  try {
    const response = await fetch(`${BASE_URL}/user/password_change/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.token}`,
      },
      body: JSON.stringify(data.formData),
    });
    const result = await response.json();

    if (!response.ok) {
      Object.keys(result).forEach((field) => {
        const errors = result[field];
        errors.forEach((errorMessage: string) => {
          toast.error(`${field}: ${errorMessage}`);
        });
      });
      throw new Error(`${result}`);
    }
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
}

export const useChangePassowrd = (props: useChangePassowrdProps) => {
  const receivedProps = props || ({} as useChangePassowrdProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, ChangePassResponse, ChangePasswordVariables, unknown>(
    {
      mutationFn: fetchChangePassword,
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
    }
  );
};

export default useChangePassowrd;
