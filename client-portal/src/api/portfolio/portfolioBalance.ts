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

export async function fetchPortfolioBalance(data: {
  token: string;
}): Promise<PortfolioResponse> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");

  console.log("fetchPortfolioBalance function started", data.token);

  try {
    const response = await fetch(`${BASE_URL}/portfolio/total-balance/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    const result = await response.json();
    console.log("API response", response, result);

    if (!response.ok) {
      throw new Error(`${result}`);
    }

    console.log(result)

    return result;
  } catch (error) {
    throw new Error(error as string);
  }
}

const usePortfolioBalance = (
  props: UsePortfolioProps
): UseMutationResult<PortfolioResponse, unknown, { token: string }> => {
  const { onSuccess: onSuccessOverride, onError: onErrorOverride, ...rest } =
    props || ({} as UsePortfolioProps);

  return useMutation<PortfolioResponse, unknown, { token: string }>({
    mutationFn: (data) => fetchPortfolioBalance(data),
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

export default usePortfolioBalance;
