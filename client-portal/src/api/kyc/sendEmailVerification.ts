import { toast } from "react-toastify";
import getEnv from "utils/env";

export interface emailProps {
  email: string;
}

export async function sendEmailVerification(
  data: emailProps
): Promise<boolean> {
  const BASE_URL = getEnv("VITE_API_BASE_URL");

  try {
    const response = await fetch(`${BASE_URL}/user/send_email_verification/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data.email),
      referrerPolicy: "no-referrer",
    });

    if (!response.ok) {
      const result = await response.json();
      Object.keys(result).forEach((field) => {
        const errors = result[field];
        errors.forEach((errorMessage: string) => {
          toast.error(`${field}: ${errorMessage}`);
        });
      });
      throw new Error(`${result}`);
    }

    return true;
  } catch (error) {
    throw new Error(error as string);
  }
}
