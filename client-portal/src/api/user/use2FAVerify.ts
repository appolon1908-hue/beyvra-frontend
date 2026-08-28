import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { beyvraAuthApi } from "api/generated/beyvra";
import { LoginSuccess } from "./useLogin";
import type { BaseMutationHookOptions } from "api/types";

type VerifyArgs = { loginToken?: string; token?: string; otp: string };
type VerifyResponse = Partial<LoginSuccess> & { message?: string };
type Props = BaseMutationHookOptions<VerifyResponse, VerifyArgs>;

export async function fetchVerify(data: VerifyArgs): Promise<VerifyResponse> {
  return beyvraAuthApi.verifyMfa({ otp: data.otp, ...(data.loginToken ? { login_token: data.loginToken } : {}) }, data.token);
}

export const use2FAVerify = (props: Props) => {
  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = props;

  return useMutation<VerifyResponse, Error, VerifyArgs>({
    mutationFn: fetchVerify,
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

export default use2FAVerify;
