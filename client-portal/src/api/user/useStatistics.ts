import { useMutation } from "@tanstack/react-query";
import { IUser, IUserStat } from "@interfaces";
import { codestraAuthApi } from "api/generated/codestraDemo";

export async function fetchUserStat(token: string): Promise<boolean> {
  return codestraAuthApi.statistics(token);
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
