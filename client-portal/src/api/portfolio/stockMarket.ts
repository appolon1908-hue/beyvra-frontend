import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { codestraPortfolioApi } from "api/generated/codestraDemo";
import IKYC from "@interfaces/IKYC";

interface PortfolioResponse {
  count: number;
  next: string;
  previous: string;
  results: any[];
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

export async function fetchMarket(data: {
  token: string;
}): Promise<PortfolioResponse> {
  const MAX_ITEMS = 1000
  const result = await codestraPortfolioApi.stockMarket<PortfolioResponse>(data.token);
  return { ...result, results: result.results.slice(0, MAX_ITEMS) };
}

const useStockMarketData = (
  props: UsePortfolioProps
): UseMutationResult<PortfolioResponse, unknown, { token: string }> => {
  const { onSuccess: onSuccessOverride, onError: onErrorOverride, ...rest } =
    props || ({} as UsePortfolioProps);

  return useMutation<PortfolioResponse, unknown, { token: string }>({
    mutationFn: (data) => fetchMarket(data),
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

export default useStockMarketData;
