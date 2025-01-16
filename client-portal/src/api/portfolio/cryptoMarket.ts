import { useMutation, UseMutationResult } from "@tanstack/react-query";
import getEnv from "utils/env";
import IKYC from "@interfaces/IKYC";

interface PortfolioResponse {
  count: number;
  next: string;
  previous: string;
  results: IKYC[];
}

type UsePortfolioProps = {
  onSuccess?: (
    data: PortfolioResponse,
    variables: { token: string },
    context: unknown
  ) => void;
  onError?: (
    error: unknown,
    variables: { token: string },
    context: unknown
  ) => void;
};

export async function fetchCryptoMarket(data: {
  token: string;
}): Promise<PortfolioResponse> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  const MAX_ITEMS = 1000
  console.log("fetch market data function started", data.token);

  try {
    const response = await fetch(`${BASE_URL}/portfolio/crypto-market-data/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    const result = await response.json();
    console.log("crypto API response", response, result);

    if (!response.ok) {
      throw new Error(`${result}`);
    }
    const limitedResults = {
      ...result,
      results: result.results.slice(0, MAX_ITEMS),
    };

    return limitedResults;
    // return result;
  } catch (error) {
    throw new Error(error as string);
  }
}

const useCrptoMarketData = (
  props: UsePortfolioProps
): UseMutationResult<PortfolioResponse, unknown, { token: string }> => {
  const { onSuccess: onSuccessOverride, onError: onErrorOverride, ...rest } =
    props || ({} as UsePortfolioProps);

  return useMutation<PortfolioResponse, unknown, { token: string }>({
    mutationFn: (data) => fetchCryptoMarket(data),
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

export default useCrptoMarketData;
