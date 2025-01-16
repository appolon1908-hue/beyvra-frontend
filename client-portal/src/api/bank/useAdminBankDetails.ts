import { useMutation } from "@tanstack/react-query";
import getEnv from "utils/env";

async function withdrawWireTransferFetcher(token: string): Promise<boolean> {
  try {
    const BASE_URL = getEnv("VITE_API_BASE_URL");
    const response = await fetch(`${BASE_URL}/bank_account/tradxio/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      const errorKey = Object.keys(result)[0];
      const [errorMessage] = result[errorKey] as string;

      throw new Error(errorMessage);
    }
    return result;
  } catch (error) {
    throw new Error(error as string);
  }
}

type Props = {
  onSuccess?: (
    data: {
      data: [
        {
          id: number;
          created_at: string;
          updated_at: string;
          bank_name: string;
          account_number: string;
          account_holder_name: string;
          last_name: string;
          routing_number: string;
          swift_code: string;
          iban: string;
          country: string;
        }
      ];
    },
    variables: unknown,
    context: unknown
  ) => void;
  onError?: (error: unknown, variables: unknown, context: unknown) => void;
  [index: string]: any;
};

export const useAdminBankDetails = (props: Props) => {
  const receivedProps = props;

  const {
    onSuccess: onSuccessOverride,
    onError: onErrorOverride,
    ...rest
  } = receivedProps;

  return useMutation<any, unknown, any>({
    mutationFn: withdrawWireTransferFetcher,
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

export default useAdminBankDetails;
