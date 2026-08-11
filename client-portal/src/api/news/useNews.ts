import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { INews } from "@interfaces";
import { beyvraNewsApi } from "api/generated/beyvra";

interface DataTabNewsResponse{ 
  title?: string;
  text?: string;
  publisher?: string;
  url?: string;
}

interface DataNewsResponse {
    
      all: DataTabNewsResponse ;
      forex:  DataTabNewsResponse;
      stocks: DataTabNewsResponse;
      commodities: DataTabNewsResponse;
      crypto: DataTabNewsResponse
    
  
}

interface NewsResponse {
  next_cursor: string | null,
  delayed: boolean,
  stale: boolean,
  results: INews[]
  news: DataNewsResponse;
}

type NewsQueryParams = {
  q?: string;
  instrument?: string;
  category?: string;
  source?: string;
  language?: string;
  country?: string;
  published_after?: string;
  published_before?: string;
  limit?: string;
  cursor?: string;
};

type useNewsProps = {
  onSuccess?: (
    data: NewsResponse,
    variables: { token: string; feed?: "latest" | "market" | "crypto"; queryParams?: NewsQueryParams },
    context: unknown
  ) => void;
  onError?: (
    error: unknown,
    variables: { token: string; feed?: "latest" | "market" | "crypto"; queryParams?: NewsQueryParams },
    context: unknown
  ) => void;
};

export async function fetchNews(data: {
  token: string;
  feed?: "latest" | "market" | "crypto";
  queryParams?: NewsQueryParams;
}): Promise<NewsResponse> {
  return beyvraNewsApi.feed<NewsResponse>(data.token, data.feed || "latest", data.queryParams);
}

export const useNews = (
  props: useNewsProps
): UseMutationResult<
  NewsResponse,
  unknown,
  { token: string; feed?: "latest" | "market" | "crypto"; queryParams?: NewsQueryParams }
> => {
  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = props || ({} as useNewsProps);

  return useMutation<NewsResponse,unknown,{ token: string; feed?: "latest" | "market" | "crypto"; queryParams?: NewsQueryParams }>({
    mutationFn: (data) => fetchNews(data),
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
