import { useMutation } from "@tanstack/react-query";
import { beyvraAuthApi } from "api/generated/beyvra";

export async function webSocketTicketFetcher(
  token: string,
): Promise<{ ws_ticket: string }> {
  return beyvraAuthApi.websocketTicket<{ ws_ticket: string }>(token);
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
