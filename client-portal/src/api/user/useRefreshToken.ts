import { useMutation } from "@tanstack/react-query";
import { beyvraAuthApi } from "api/generated/beyvra";
import { logInternalError } from "errors/userSafeError";
import { ApiError } from "api/errors";
import type { BaseMutationHookOptions, TokenRefreshResponse } from "api/types";

interface TokenRefreshVariables {
  refresh: string;
}

/**
 * Fetches a new access token using refresh token
 * @param data - Refresh token request
 * @returns New access and refresh tokens
 */
export async function fetchRefreshToken(
  data: TokenRefreshVariables
): Promise<TokenRefreshResponse> {
  try {
    return await beyvraAuthApi.refresh<TokenRefreshResponse>(data);
  } catch (error) {
    logInternalError(error, { endpoint: "auth.refresh" });
    throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN");
  }
}

type UseRefreshTokenProps = BaseMutationHookOptions<TokenRefreshResponse, TokenRefreshVariables>;

/**
 * Hook to refresh authentication token
 * @example
 * const { mutate } = useRefreshToken({
 *   onSuccess: (tokens) => setCookie("access_token", tokens.access)
 * });
 * mutate({ refresh: refreshToken });
 */
export const useRefreshToken = (props?: UseRefreshTokenProps) => {
  const receivedProps = props || ({} as UseRefreshTokenProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<TokenRefreshResponse, Error, TokenRefreshVariables>({
    mutationFn: fetchRefreshToken,
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

export default useRefreshToken;

