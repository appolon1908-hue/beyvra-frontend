import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { codestraKycApi } from "api/generated/codestraDemo";
import IKYC from "@interfaces/IKYC";

export interface KYCResponse {
  count: number,
  next: string,
  previous: string,
  results: IKYC[]

}

type KYCQueryParams = {
  symbol?: string;
  start?: string;
  end?: string;
  sort?: "asc" | "desc";
  include_content?: string;
  exclude_contentless?: string;
  size?: string;
};

type useKYCProps = {
  onSuccess?: (
    data: KYCResponse,
    variables: { token: string },
    context: unknown
  ) => void;
  onError?: (
    error: unknown,
    variables: { token: string },
    context: unknown
  ) => void;
};

export async function fetchKYC(data: {
  token: string;

}): Promise<KYCResponse> {
  return codestraKycApi.profile<KYCResponse>(data.token);
}
 const useKyc = (
  props: useKYCProps
): UseMutationResult<
  KYCResponse,
  unknown,
  { token: string }
> => {
  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = props || ({} as useKYCProps);

  return useMutation<KYCResponse,unknown,{ token: string}>({
    mutationFn: (data) => fetchKYC(data),
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
    ...rest,
  });
};

export default useKyc
