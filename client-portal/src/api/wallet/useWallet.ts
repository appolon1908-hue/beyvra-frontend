import { useMutation } from "@tanstack/react-query";
import type { IWallet } from "@interfaces";
import { beyvraWalletApi } from "api/generated/beyvra";
import { logInternalError } from "errors/userSafeError";
import { ApiError } from "api/errors";
import type { BaseMutationHookOptions, PaginatedResponse } from "api/types";

export type WalletResponse = PaginatedResponse<IWallet>;

/**
 * Fetches user wallet information
 * @param token - Authentication token
 * @returns Paginated list of user wallets
 * @throws ApiError on request failure
 */
export async function fetchWallet(token: string): Promise<WalletResponse> {
  try {
    const result = await beyvraWalletApi.wallets(token);
    if (!result || typeof result !== "object") {
      throw new ApiError(500, "INVALID_RESPONSE", undefined);
    }
    return {
      count: (result as Record<string, unknown>).count as number || 0,
      next: (result as Record<string, unknown>).next as string | null || null,
      previous: (result as Record<string, unknown>).previous as string | null || null,
      results: ((result as Record<string, unknown>).results as IWallet[]) || [],
    };
  } catch (error) {
    logInternalError(error, { endpoint: "wallet.list" });
    throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN");
  }
}

type UseWalletProps = BaseMutationHookOptions<WalletResponse, string>;

/**
 * Hook to fetch user wallets
 * @example
 * const { mutate } = useWallet({
 *   onSuccess: (data) => console.log(data.results)
 * });
 * mutate(accessToken);
 */
export const useWallet = (props?: UseWalletProps) => {
  const receivedProps = props || ({} as UseWalletProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<WalletResponse, Error, string>({
    mutationFn: fetchWallet,
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

export default useWallet;
