import { useMutation, UseMutationResult } from "@tanstack/react-query";
import getEnv from "utils/env";
import IKYC from "@interfaces/IKYC";

interface PortfolioResponse {
  count: number,
  next: string,
  previous: string,
  results: IKYC[]

}



type usePortfoliorops = {
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

export async function fetchPortfio(data: {
  token: string;

}): Promise<PortfolioResponse> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  try {
   

      const response = await fetch(`${BASE_URL}/user/kyc/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${data.token}`,
      },
    });

    const result = await response.json();
    console.log("get portfolio", result)

    if (!response.ok) {
      throw new Error(`${result}`);
    }

    return result;
  } catch (error) {
    throw new Error(error as string);
  }
}
 const usePortfolio = (props: usePortfoliorops): UseMutationResult<PortfolioResponse, unknown, { token: string }> => {
  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = props || ({} as usePortfoliorops);

  return useMutation<PortfolioResponse,unknown,{ token: string}>({
    mutationFn: (data) => fetchPortfio(data),
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

export default usePortfolio