import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { INews } from "@interfaces";
import { codestraNewsApi } from "api/generated/codestraDemo";

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
  if (!articleId) throw new Error("A news article id is required.");
  return codestraNewsApi.article<INews>(token, articleId);
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
