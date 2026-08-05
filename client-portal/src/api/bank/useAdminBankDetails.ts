import { useMutation } from "@tanstack/react-query";
import { codestraBankApi } from "api/generated/codestraDemo";

async function withdrawWireTransferFetcher(token: string): Promise<boolean> {
  try {
    return codestraBankApi.details(token);
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
