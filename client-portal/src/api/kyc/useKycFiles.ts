import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { beyvraKycApi } from "api/generated/beyvra";
import { IKYCFilesProps } from "@interfaces";

export interface KYCFileResponse {
  count: number,
  next: string,
  previous: string,
  results: IKYCFilesProps[]

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
    data: KYCFileResponse,
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

}): Promise<KYCFileResponse> {
  return beyvraKycApi.files<KYCFileResponse>(data.token);
}
 const useKycFiles = (
  props: useKYCProps
): UseMutationResult<
KYCFileResponse,
  unknown,
  { token: string }
> => {
  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = props || ({} as useKYCProps);

  return useMutation<KYCFileResponse,unknown,{ token: string}>({
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

export default useKycFiles
