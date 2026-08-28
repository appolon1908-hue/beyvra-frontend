import { useMutation } from "@tanstack/react-query";
import type { IUser } from "@interfaces";
import { beyvraProfileApi } from "api/generated/beyvra";
import { logInternalError, toUserSafeErrorText } from "errors/userSafeError";
import { ApiError } from "api/errors";
import type { BaseMutationHookOptions, ProfileResponse } from "api/types";

/**
 * Fetches user profile data
 * @param token - Authentication token
 * @returns User profile information
 */
export async function fetchProfile(token: string): Promise<IUser> {
  try {
    const response = await beyvraProfileApi.profile(token);
    if (!response) {
      throw new ApiError(500, "INVALID_RESPONSE", undefined);
    }
    return response as IUser;
  } catch (error) {
    logInternalError(error, { endpoint: "user.profile" });
    throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN");
  }
}

type UseProfileProps = BaseMutationHookOptions<IUser, string>;

/**
 * Hook to fetch user profile
 * @example
 * const { mutate } = useProfile({
 *   onSuccess: (user) => console.log(user.email)
 * });
 * mutate(accessToken);
 */
export const useProfile = (props?: UseProfileProps) => {
  const receivedProps = props || ({} as UseProfileProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<IUser, Error, string>({
    mutationFn: fetchProfile,
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

