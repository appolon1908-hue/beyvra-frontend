import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { codestraAuthApi } from "api/generated/codestraDemo";

type Props = {
  onSuccess?: (
    data: { qrcode: string },
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export async function fetchQRCode(token: string) {
  return codestraAuthApi.mfaQr(token);
}

export const use2FAQR = (props: Props) => {
  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = props;

  return useMutation<any, unknown, any>({
    mutationFn: fetchQRCode,
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

export default use2FAQR;
