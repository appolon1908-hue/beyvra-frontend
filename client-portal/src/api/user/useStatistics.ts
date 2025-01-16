import { useMutation } from "@tanstack/react-query";
import { IUser, IUserStat } from "@interfaces";
import getEnv from "utils/env";

export async function fetchUserStat(token: string): Promise<boolean> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");

  try {
    const response = await fetch(`${BASE_URL}/user/trading_statistics/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    if (!response.ok) {

      
      throw new Error(`${result}`);
    }

    return result;
  } catch (error) {
    throw new Error(error as string);
  }
}

type useProfileProps = {
  onSuccess?: (data: IUserStat, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};
export const useUserStat = (props: useProfileProps) => {
  const receivedProps = props || ({} as useProfileProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: (token: string) => fetchUserStat(token),
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

export default useUserStat;
