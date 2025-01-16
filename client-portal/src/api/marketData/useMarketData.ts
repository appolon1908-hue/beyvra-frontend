import { useMutation } from "@tanstack/react-query";
import getEnv from "utils/env";

type FetcherDataOptions = {
  token: string;
  options?: {
    start?: string;
    symbols?: string;
    timeFrame?: string;
    end?: string
  }
}

export async function marketDataFetcher({
  token,
  options
}: FetcherDataOptions) {
  try {
    const start = options?.start ?? "2024-02-20";
    const end = options?.end ?? "2024-03-20";
    const symbols = options?.symbols ?? "BTC%2FUSD";
    const timeFrame = options?.timeFrame ?? "minute";
    const response = await fetch(
      `${getEnv(
        "VITE_API_BASE_URL"
      )}/market-data/alpaca/?start=${start}&end=${end}&symbol_or_symbols=${symbols}&timeframe=${timeFrame}`,
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

type useMarketDataProps = {
  onSuccess?: (data: unknown, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};
export const useMarketData = (props: useMarketDataProps) => {
  const receivedProps = props || ({} as useMarketDataProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation({
    mutationFn: marketDataFetcher,
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

export default useMarketData;
