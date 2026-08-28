import { useMutation } from "@tanstack/react-query";
import { beyvraMarketApi } from "api/generated/beyvra";
import { logInternalError } from "errors/userSafeError";
import { ApiError } from "api/errors";
import type { BaseMutationHookOptions, MarketDataResponse } from "api/types";

export interface MarketDataOptions {
  start?: string;
  symbols?: string;
  timeFrame?: string;
  end?: string;
}

export interface FetchMarketDataInput {
  token: string;
  options?: MarketDataOptions;
}

/**
 * Fetches market data from data provider
 * @param input - Token and market data options
 * @returns Market data response
 * @throws ApiError on request failure
 */
export async function fetchMarketData({
  token,
  options,
}: FetchMarketDataInput): Promise<MarketDataResponse> {
  try {
    const start = options?.start ?? "2024-02-20";
    const end = options?.end ?? "2024-03-20";
    const symbols = options?.symbols ?? "BTC%2FUSD";
    const timeFrame = options?.timeFrame ?? "minute";
    
    const result = await beyvraMarketApi.alpaca<MarketDataResponse>(token, {
      start,
      end,
      symbol_or_symbols: symbols,
      timeframe: timeFrame,
    });
    
    if (!result || typeof result !== "object") {
      throw new ApiError(500, "INVALID_RESPONSE", undefined);
    }
    return result;
  } catch (error) {
    logInternalError(error, { endpoint: "market.data" });
    throw error instanceof ApiError ? error : new ApiError(500, "UNKNOWN");
  }
}

type UseMarketDataProps = BaseMutationHookOptions<MarketDataResponse, FetchMarketDataInput>;

/**
 * Hook to fetch market data
 * @example
 * const { mutate } = useMarketData({
 *   onSuccess: (data) => console.log(data)
 * });
 * mutate({
 *   token: accessToken,
 *   options: { symbols: "BTC/USD" }
 * });
 */
export const useMarketData = (props?: UseMarketDataProps) => {
  const receivedProps = props || ({} as UseMarketDataProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<MarketDataResponse, Error, FetchMarketDataInput>({
    mutationFn: fetchMarketData,
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

export default useMarketData;

