import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { codestraAuthApi } from "api/generated/codestraDemo";

export async function fethRegister(data: any): Promise<boolean> {
  return codestraAuthApi.register(data);
}

type useRegisterProps = {
  onSuccess?: (data: unknown, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};
 const useKycRegistration = (props: useRegisterProps) => {
  const receivedProps = props || ({} as useRegisterProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: fethRegister,
    onSuccess: (data, variables, context) => {
      if (onSuccessOverride) {
        onSuccessOverride(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (onErrorOverride) {
        console.log(error, 'occured')
        onErrorOverride(error, variables, context);
      }
    },
    ...(rest || {}),
  });
};

export default useKycRegistration;
