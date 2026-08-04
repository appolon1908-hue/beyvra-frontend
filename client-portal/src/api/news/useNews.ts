import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { INews } from "@interfaces";
import { codestraNewsApi } from "api/generated/codestraDemo";

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
  status: string,
  totalResults: number,
  results: INews[]
  news: DataNewsResponse;
}

type NewsQueryParams = {
  symbol?: string;
  start?: string;
  end?: string;
  sort?: "asc" | "desc";
  include_content?: string;
  exclude_contentless?: string;
  size?: string;
};

type useNewsProps = {
  onSuccess?: (
    data: NewsResponse,
    variables: { token: string; queryParams?: NewsQueryParams },
    context: unknown
  ) => void;
  onError?: (
    error: unknown,
    variables: { token: string; queryParams?: NewsQueryParams },
    context: unknown
  ) => void;
};

export async function fetchNews(data: {
  token: string;
  queryParams?: NewsQueryParams;
}): Promise<NewsResponse> {
  return codestraNewsApi.list<NewsResponse>(data.token, data.queryParams);
}

export const useNews = (
  props: useNewsProps
): UseMutationResult<
  NewsResponse,
  unknown,
  { token: string; queryParams?: NewsQueryParams }
> => {
  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = props || ({} as useNewsProps);

  return useMutation<NewsResponse,unknown,{ token: string; queryParams?: NewsQueryParams }>({
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
