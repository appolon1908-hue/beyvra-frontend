import { ISignInForm, IUser } from "@interfaces";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import getEnv from "utils/env";

export async function fethLogin(data: ISignInForm): Promise<boolean> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  console.log(getEnv("VITE_API_BASE_URL"), BASE_URL, 'Here');
  try {
    console.log(data)
    const response = await fetch(`${BASE_URL}/user/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    const result = await response.json();

    console.log(result);

    if (!response.ok) {
      toast.error(result.detail);
      throw new Error(`${result}`);
    }
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
}

interface LoginSuccess {
  access: string;
  refresh: string;
  user: IUser
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

  return useMutation<any, unknown, ISignInForm>({
    mutationFn: fethLogin,
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
