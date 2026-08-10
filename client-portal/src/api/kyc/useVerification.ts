import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { beyvraKycApi } from "api/generated/beyvra";

export async function fetchVerification(data: any): Promise<boolean> {
  return beyvraKycApi.submit(data.token, data.formData);
}

type useVerificationProps = {
  onSuccess?: (data: unknown, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};
export const useVerification = (props: useVerificationProps) => {
  const receivedProps = props || ({} as useVerificationProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: fetchVerification,
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

export default useVerification;
