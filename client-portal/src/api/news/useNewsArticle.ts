import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { INews } from "@interfaces";
import getEnv from "utils/env";

// Type for the fetchNews function's parameters
type FetchNewsParams = {
  token: string;
  articleId?: string;
};

// Type for the useNewsArticle hook's properties
type UseNewsProps = {
  onSuccess?: (
    data: INews,
    variables: FetchNewsParams,
    context: unknown
  ) => void;
  onError?: (
    error: unknown,
    variables: FetchNewsParams,
    context: unknown
  ) => void;
};

// Function to fetch the news article data from the API
export async function fetchNewsArticle({ token, articleId }: FetchNewsParams): Promise<INews> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  
  try {
    const response = await fetch(`${BASE_URL}/news/${articleId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to fetch the news article. HTTP status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw new Error((error as Error).message || "An unexpected error occurred while fetching the news article.");
  }
}

// Custom hook to use the fetchNews function with react-query's useMutation
export const useNewsArticle = (
  props: UseNewsProps = {}
): UseMutationResult<INews, unknown, FetchNewsParams> => {
  const { onSuccess, onError } = props;

  return useMutation<INews, unknown, FetchNewsParams>({
    mutationFn: fetchNewsArticle,
    onSuccess: (data, variables, context) => {
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      console.error("Error fetching news article:", error);
      if (onError) {
        onError(error, variables, context);
      }
    },
  });
};