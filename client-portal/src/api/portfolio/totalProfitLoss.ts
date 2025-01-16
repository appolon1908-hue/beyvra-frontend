import { useMutation, UseMutationResult } from "@tanstack/react-query";
import getEnv from "utils/env";
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
  const BASE_URL = getEnv("VITE_API_BASE_URL");

  // console.log("fetch profit loss function started", data.token);

  try {
    const response = await fetch(`${BASE_URL}/portfolio/total-profit-loss/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    const result = await response.json();
    console.log("API response fr profit loss", response, result);

    if (!response.ok) {
      throw new Error(`${result}`);
    }

    return result;
  } catch (error) {
    throw new Error(error as string);
  }
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
