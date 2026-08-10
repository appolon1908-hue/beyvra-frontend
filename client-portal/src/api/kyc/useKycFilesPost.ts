import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { beyvraKycApi } from "api/generated/beyvra";

type KycFilesResponse = {
  detail: string;
};

type useKycFilesPostProps = {
  onSuccess?: (
    data: KycFilesResponse[],
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export type KycFilesPostForm = {
  identityDoc: FormData;
  addressDoc: FormData;
};

type KycFilesPostVariables = {
  token: string;
  identityDoc: FormData;
  addressDoc: FormData;
};

async function fetchKycFilesPostForm(data: KycFilesPostVariables) {
  const uploadFile = async (fileData: FormData, desc: string) => {
    return beyvraKycApi.upload<KycFilesResponse>(data.token, fileData);
  };

  // Use Promise.all to send both requests simultaneously
  return Promise.all([
    uploadFile(data.identityDoc, "identityDoc"),
    uploadFile(data.addressDoc, "addressDoc"),
  ]);
}

export const useKycFilesPostForm = (props: useKycFilesPostProps) => {
  const receivedProps = props || ({} as useKycFilesPostProps);

  const { onSuccess: onSuccessOverride, onError: onErrorOverride, ...rest } = receivedProps;

  return useMutation<any, KycFilesResponse[], KycFilesPostVariables, unknown>({
    mutationFn: fetchKycFilesPostForm,
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

export default useKycFilesPostForm;
