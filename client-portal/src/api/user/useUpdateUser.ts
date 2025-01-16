import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { IUser } from "@interfaces";
import getEnv from "utils/env";

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
): Promise<boolean> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
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

    const response = await fetch(`${BASE_URL}/user/me/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      referrerPolicy: "no-referrer",
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      Object.keys(result).forEach((field) => {
        const errors = result[field];
        errors.forEach((errorMessage: string) => {
          toast.error(`${field}: ${errorMessage}`);
        });
      });
      throw new Error(`${result}`);
    }
    return result;
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

  return useMutation<any, unknown, any>({
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
