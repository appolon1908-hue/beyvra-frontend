import { useMutation } from "@tanstack/react-query";
import {  IUser } from "@interfaces";
import { beyvraProfileApi } from "api/generated/beyvra";

export async function disableUserWalkThrough(token: string): Promise<IUser> {
  try {
    return await beyvraProfileApi.disableWalkthrough(token) as IUser;
  } catch (error) {
    throw new Error(error as string);
  }
}

type useDisableWalkThroughProps = {
  onSuccess?: (data: IUser, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};
export const useDisableWalkThrough = (props: useDisableWalkThroughProps) => {
  const receivedProps = props || ({} as useDisableWalkThroughProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<IUser, Error, { token: string }>({
    mutationFn: (variables) => disableUserWalkThrough(variables.token),
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

export default useDisableWalkThrough;
