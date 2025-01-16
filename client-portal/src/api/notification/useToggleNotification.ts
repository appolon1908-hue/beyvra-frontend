import { useMutation } from "@tanstack/react-query";
import { INotification } from "@interfaces";
import getEnv from "utils/env";

export async function toggleSingeNotification(data: any, token: string): Promise<boolean> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  try {
    const response = await fetch(`${BASE_URL}/notification/toggle_notification/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(data),
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

type useNotificationProps = {
  onSuccess?: (data: INotification, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};
export const useNotificationToggle = (props: useNotificationProps) => {
  const receivedProps = props || ({} as useNotificationProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: (variables) => toggleSingeNotification(variables.data, variables.token),
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

export default useNotificationToggle;
