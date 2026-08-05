import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { codestraAuthApi } from "api/generated/codestraDemo";
import { LoginSuccess } from "./useLogin";

type Props = {
  onSuccess?: (data: LoginSuccess, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

type VerifyArgs = { loginToken?: string; token?: string; otp: string };
type VerifyResponse = Partial<LoginSuccess> & { message?: string };

export async function fetchVerify(data: VerifyArgs): Promise<VerifyResponse> {
  return codestraAuthApi.verifyMfa({ otp: data.otp, ...(data.loginToken ? { login_token: data.loginToken } : {}) }, data.token);
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
