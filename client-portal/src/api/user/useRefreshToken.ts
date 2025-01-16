import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import getEnv from "utils/env";

interface TokenRefreshSuccess {
  access: string;
  refresh: string;
}

type RefreshTokenVariables = {
  refresh: string;
};

type useRefreshTokenProps = {
  onSuccess?: (
    data: TokenRefreshSuccess,
    variables: RefreshTokenVariables,
    context: unknown
  ) => void;
  onError?: (
    error: unknown,
    variables: RefreshTokenVariables,
    context: unknown
  ) => void;
  [index: string]: any;
};

export async function fethRefreshToken(
  data: RefreshTokenVariables
): Promise<boolean> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  try {
    const response = await fetch(`${BASE_URL}/user/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!response.ok) {
      toast.error(result.detail);
      throw new Error(`${result}`);
    }
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
}

export const useRefreshToken = (props: useRefreshTokenProps) => {
  const receivedProps = props || ({} as useRefreshTokenProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, RefreshTokenVariables>({
    mutationFn: fethRefreshToken,
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

export default useRefreshToken;
