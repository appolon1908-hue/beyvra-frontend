import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import getEnv from "utils/env";

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
  const BASE_URL = getEnv("VITE_API_BASE_URL");

  const uploadFile = async (fileData: FormData, desc: string) => {
    try {
      const response = await fetch(`${BASE_URL}/user/kycfiles/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
        body: fileData,
      });
      
      const result = await response.json();

      if (!response.ok) {
        Object.keys(result).forEach((field) => {
          const errors = result[field];
          errors.forEach((errorMessage: string) => {
            toast.error(`${field}: ${errorMessage}`);
          });
        });
        throw new Error(`${result}`);
      }
      return result;
    } catch (error) {
      throw new Error(error as string);
    }
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
