import { useMutation } from "@tanstack/react-query";
import { IUser } from "@interfaces";
import { beyvraProfileApi } from "api/generated/beyvra";

type useUpdateUserProps = {
  onSuccess?: (data: IUser, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

type UserData = {
  profile_picture?: File;
  first_name?: string;
  last_name?: string;
  address?: string;
  [key: string]: any;
};

export async function fetcUpdateUser(
  data: UserData,
  token: string
): Promise<IUser> {
  try {
    const formData = new FormData();

    // Append each key-value pair to the formData
    Object.keys(data).forEach((key) => {
      if (key === "profile_picture") {
        const file = data[key] as File;
        formData.append(key, file, file.name);
      } else {
        formData.append(key, data[key]);
      }
    });

    return await beyvraProfileApi.update(token, formData) as IUser;
  } catch (error) {
    throw new Error(error as string);
  }
}

export const useUpdateUser = (props: useUpdateUserProps) => {
  const receivedProps = props || ({} as useUpdateUserProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<IUser, unknown, { data: UserData; token: string }>({
    mutationFn: (variables) => fetcUpdateUser(variables.data, variables.token),
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

export default useUpdateUser;
