import { useMutation } from "@tanstack/react-query";
import { beyvraBankApi } from "api/generated/beyvra";
import { logInternalError } from "errors/userSafeError";
import { ApiError } from "api/errors";
import type { BaseMutationHookOptions, BankDetailsResponse } from "api/types";

/**
 * Fetches bank account details
 * @param token - Authentication token
 * @returns Bank details information
 * @throws ApiError on request failure
 */
async function fetchBankDetails(token: string): Promise<BankDetailsResponse> {
  try {
    const result = await beyvraBankApi.details(token);
    if (!result || typeof result !== "object") {
      throw new ApiError(500, "INVALID_RESPONSE", undefined);
    }
    return result as BankDetailsResponse;
  } catch (error) {
    logInternalError(error, { endpoint: "bank.details" });
    throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN");
  }
}

type UseAdminBankDetailsProps = BaseMutationHookOptions<BankDetailsResponse, string>;

/**
 * Hook to fetch bank account details
 * @example
 * const { mutate } = useAdminBankDetails({
 *   onSuccess: (data) => console.log(data.data)
 * });
 * mutate(accessToken);
 */
export const useAdminBankDetails = (props?: UseAdminBankDetailsProps) => {
  const receivedProps = props || ({} as UseAdminBankDetailsProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<BankDetailsResponse, Error, string>({
    mutationFn: fetchBankDetails,
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

export default useAdminBankDetails;
