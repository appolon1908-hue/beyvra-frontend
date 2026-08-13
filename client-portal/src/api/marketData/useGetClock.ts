import { useMutation } from "@tanstack/react-query";
import { beyvraMarketApi } from "api/generated/beyvra";

type ClockResponse = {
  timestamp: string;
  is_open: boolean;
  next_open: number;
  next_close: number;
};

type useGetClockProps = {
  onSuccess?: (
    data: ClockResponse,
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function fetchClock(token: string): Promise<ClockResponse> {
  return beyvraMarketApi.clock<ClockResponse>(token);
}

export const useGetClock = (props: useGetClockProps) => {
  const receivedProps = props || ({} as useGetClockProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: (token: string) => fetchClock(token),
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
    ...(rest || {}),
  });
};

export default useGetClock;
