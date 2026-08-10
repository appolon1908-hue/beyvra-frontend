import { toast } from "react-toastify";
import { beyvraAuthApi } from "api/generated/beyvra";

export interface emailProps {
  email: string;
}

export async function sendEmailVerification(
  data: emailProps
): Promise<boolean> {
  await beyvraAuthApi.sendEmailVerificationPublic(data.email);
  return true;
}
