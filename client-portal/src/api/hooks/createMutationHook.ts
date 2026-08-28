/**
 * Mutation Hook Factory
 * Creates consistent, type-safe mutation hooks with standard error handling
 */

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { logInternalError } from "errors/userSafeError";
import { ApiError } from "api/errors";
import type { BaseMutationHookOptions } from "api/types";

/**
 * Creates a typed mutation hook with consistent error handling
 * 
 * @template TData - Response data type
 * @template TVariables - Mutation variables type
 * @example
 * const useCreateUser = createMutationHook<UserResponse, CreateUserInput>(
 *   async (vars) => api.createUser(vars),
 *   "user.create"
 * );
 */
export function createMutationHook<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  endpoint: string,
) {
  return function UseMutationHook(props?: BaseMutationHookOptions<TData, TVariables>) {
    const receivedProps = props || ({} as BaseMutationHookOptions<TData, TVariables>);

    const {
      onSuccess: onSuccessOverride,
      onError: onErrorOverride,
      ...rest
    } = receivedProps;

    return useMutation<TData, Error, TVariables>({
      mutationFn,
      onSuccess: (data, variables, context) => {
        if (onSuccessOverride) {
          onSuccessOverride(data, variables, context);
        }
      },
      onError: (error, variables, context) => {
        // Log error with endpoint context
        if (!(error instanceof ApiError)) {
          logInternalError(error, { endpoint });
        }

        if (onErrorOverride) {
          onErrorOverride(error, variables, context);
        }
      },
      ...(rest || {}),
    } as UseMutationOptions<TData, Error, TVariables>);
  };
}

export default createMutationHook;
