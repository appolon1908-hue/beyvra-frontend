import { useMutation } from "@tanstack/react-query";
import getEnv from "utils/env";

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
  const searchParams = new URLSearchParams();
  Object.keys(data).forEach((key) => {
    if (data[key]) {
      return searchParams.set(key, data[key]!);
    }
  });

  try {
    const response = await fetch(
      `${getEnv("VITE_API_BASE_URL")}/assets/?${searchParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result}`);
    }
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
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
