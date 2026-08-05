import { toast } from "react-toastify";
import { codestraAuthApi } from "api/generated/codestraDemo";

export interface emailProps {
  email: string;
}

export async function sendEmailVerification(
  data: emailProps
): Promise<boolean> {
  await codestraAuthApi.sendEmailVerificationPublic(data.email);
  return true;
}
