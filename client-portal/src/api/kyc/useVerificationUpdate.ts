import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { codestraKycApi } from "api/generated/codestraDemo";

export async function fetchVerificationUpdate(data: any): Promise<boolean> {
  return codestraKycApi.update(data.token, data.id, data.formData);
}

type useVerificationProps = {
  onSuccess?: (data: unknown, variables: unknown, context: unknown) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};
export const useVerificationUpdate = (props: useVerificationProps) => {
  const receivedProps = props || ({} as useVerificationProps);

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: fetchVerificationUpdate,
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

export default useVerificationUpdate;
