import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import getEnv from "utils/env";

type Props = {
  onSuccess?: (data: unknown, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function fetchVerify(data: { token: string; otp: string }) {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  try {
    const response = await fetch(`${BASE_URL}/user/verify_mfa_code/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp: data.otp }),
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

export const use2FAVerify = (props: Props) => {
  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = props;

  return useMutation<any, unknown, any>({
    mutationFn: fetchVerify,
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

export default use2FAVerify;
