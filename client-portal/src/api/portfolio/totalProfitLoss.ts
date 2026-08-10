import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { beyvraPortfolioApi } from "api/generated/beyvra";
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

export async function fetchProfitLoss(data: {
  token: string;
}): Promise<PortfolioResponse> {
  return beyvraPortfolioApi.profitLoss<PortfolioResponse>(data.token);
}

const useProfitLoss = (
  props: UsePortfolioProps
): UseMutationResult<PortfolioResponse, unknown, { token: string }> => {
  const { onSuccess: onSuccessOverride, onError: onErrorOverride, ...rest } =
    props || ({} as UsePortfolioProps);

  return useMutation<PortfolioResponse, unknown, { token: string }>({
    mutationFn: (data) => fetchProfitLoss(data),
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

export default useProfitLoss;
