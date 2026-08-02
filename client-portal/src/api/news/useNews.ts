import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { INews } from "@interfaces";
import getEnv from "utils/env";

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
  const BASE_URL = getEnv("VITE_API_BASE_URL");
  try {
    const queryParams = data.queryParams
      ? new URLSearchParams(
          Object.entries(data.queryParams)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : "";
    const response = await fetch(`${BASE_URL}/news/${queryParams ? `?${queryParams}` : ""}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${data.token}` },
    });
    const result = await response.json();
  
    
    if (!response.ok) {
      throw new Error(`${result}`);
    }

    return result;
  } catch (error) {
    throw new Error(error as string);
  }
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
