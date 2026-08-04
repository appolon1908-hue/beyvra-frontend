import { useMutation } from "@tanstack/react-query";
import { NotificationType } from "@store/slices/notification";
import { codestraUserApi } from "api/generated/codestraDemo";

export async function fetchNotificationList(token: string): Promise<boolean> {
  try {
    return await codestraUserApi.notifications(token) as boolean;
  } catch (error) {
    throw new Error(error as string);
  }
}

type useNotificationProps = {
  onSuccess?: (
    data: { notifications: NotificationType[] },
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};
export const useNotificationList = (props: useNotificationProps) => {
  const receivedProps = props || ({} as useNotificationProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: (token: string) => fetchNotificationList(token),
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

export default useNotificationList;
