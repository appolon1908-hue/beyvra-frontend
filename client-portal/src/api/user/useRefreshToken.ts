import { useMutation } from "@tanstack/react-query";
import { codestraAuthApi } from "api/generated/codestraDemo";

interface TokenRefreshSuccess {
  access: string;
  refresh: string;
}

type RefreshTokenVariables = {
  refresh: string;
};

type useRefreshTokenProps = {
  onSuccess?: (
    data: TokenRefreshSuccess,
    variables: RefreshTokenVariables,
    context: unknown
  ) => void;
  onError?: (
    error: unknown,
    variables: RefreshTokenVariables,
    context: unknown
  ) => void;
  [index: string]: any;
};

export async function fethRefreshToken(
  data: RefreshTokenVariables
): Promise<TokenRefreshSuccess> {
  return codestraAuthApi.refresh<TokenRefreshSuccess>(data);
}

export const useRefreshToken = (props: useRefreshTokenProps) => {
  const receivedProps = props || ({} as useRefreshTokenProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, RefreshTokenVariables>({
    mutationFn: fethRefreshToken,
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

export default useRefreshToken;
