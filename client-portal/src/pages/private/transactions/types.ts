import { ReactNode } from "react";

export type MethodsType = "Bank Card";

export type DataType = {
  dateAndTime: string;
  type: string;
  paymentSystem: string | ReactNode;
  status: string | ReactNode;
  account: string;
  ammount: string;
};