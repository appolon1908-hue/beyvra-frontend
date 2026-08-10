import { useMutation } from "@tanstack/react-query";
import { IUser } from "@interfaces";
import { beyvraProfileApi } from "api/generated/beyvra";

export async function fethProfile(token: string): Promise<boolean> {
  try {
    return await beyvraProfileApi.profile(token) as boolean;
  } catch (error) {
    throw new Error(error as string);
  }
}

type useProfileProps = {
  onSuccess?: (data: IUser, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};
export const useProfile = (props: useProfileProps) => {
  const receivedProps = props || ({} as useProfileProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: (token: string) => fethProfile(token),
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

export default useProfile;
