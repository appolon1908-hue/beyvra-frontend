import { useMutation } from "@tanstack/react-query";
import getEnv from "utils/env";

export async function webSocketTicketFetcher(
  token: string,
) {
  try {
    const response = await fetch(
      `${getEnv("VITE_API_BASE_URL")}/user/websocket_ticket`,
        {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`${result}`);
    }
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
}

type UseWebSocketTicketProps = {
  onSuccess?: (
    data: { ws_ticket: string},
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};
export const useWebSocketTicket = (props: UseWebSocketTicketProps) => {
  const receivedProps = props || ({} as UseWebSocketTicketProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation({
    mutationFn: webSocketTicketFetcher,
    onSuccess: (data, variables, context) => {
      /* Add On success actions here if needed */
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

export default useWebSocketTicket;
