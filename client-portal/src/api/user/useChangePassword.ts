import { useMutation } from "@tanstack/react-query";
import { beyvraProfileApi } from "api/generated/beyvra";

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
  try {
    return await beyvraProfileApi.changePassword(data.token, data.formData);
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
