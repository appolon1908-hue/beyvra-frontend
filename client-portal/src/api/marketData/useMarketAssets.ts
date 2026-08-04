import { useMutation } from "@tanstack/react-query";
import { codestraMarketApi } from "api/generated/codestraDemo";

type FetcherDataOptions = {
  token: string;
  data?: {
    asset_class: "crypto" | "us_equity" | "us_option";
    exchange?: string;
    page?: string;
    page_size?: string;
    status?: "active" | "inactive";
    // Index signature to allow other string keys
    [key: string]: string | undefined;
  };
};

export async function assetsListFetcher({
  token,
  data = {
    asset_class: "crypto",
  },
}: FetcherDataOptions) {
  return codestraMarketApi.assets(token, data);
}

type UseMarketAssetsProps = {
  onSuccess?: (data: unknown, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};
export const useMarketAssets = (props: UseMarketAssetsProps) => {
  const receivedProps = props || ({} as UseMarketAssetsProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation({
    mutationFn: assetsListFetcher,
    onSuccess: (data, variables, context) => {
      /* Add On success actions here if needed */
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

export default useMarketAssets;
