// import { IOTPForm, IUser } from "@interfaces";
import { IOTPInputProps, IUser } from "@interfaces";
import { useMutation } from "@tanstack/react-query";
import { beyvraAuthApi } from "api/generated/beyvra";

export async function fethOTPVerification(data: IOTPInputProps): Promise<LoginSuccess> {
  return beyvraAuthApi.login<LoginSuccess>(data);
}

interface LoginSuccess {
  access: string;
  refresh: string;
  user: IUser
}

type useLoginProps = {
  onSuccess?: (
    data: LoginSuccess,
    variables: IOTPInputProps,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: IOTPInputProps, context: unknown) => void;
};
 const useOTPVerification = (props: useLoginProps) => {
  const receivedProps = props || ({} as useLoginProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, IOTPInputProps>({
    mutationFn: fethOTPVerification,
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

export default useOTPVerification;
