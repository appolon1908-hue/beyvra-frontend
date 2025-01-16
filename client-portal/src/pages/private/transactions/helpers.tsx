import { FC, ReactNode } from "react";

import {
  TransactionStatusType,
  TransactionType,
} from "@interfaces/ITransaction";

import { BankCardIcon } from "../../../assets/icons";
import { MethodsType } from "./types";

export function methodIconHandler(method: MethodsType): ReactNode | null {
  switch (method) {
    case "Bank Card":
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <BankCardIcon />
          <span style={{ marginLeft: "8px" }}>Bank Card</span>
        </div>
      );
    default:
      return null;
  }
}

export const StatusHandler: FC<{
  status: TransactionStatusType;
}> = ({ status }) => (
  <p
    className="tb-td-transaction-status"
    style={{
      background:
        status === "P" ? "#70808C" : status === "F" ? "#ED5444" : "#1D9747",
    }}
  >
    {status === "P"
      ? "Pending"
      : status === "F"
      ? "Failed"
      : status === "S"
      ? "Success"
      : ""}
  </p>
);

export const TransferTypeHandler: FC<{
  type: TransactionType;
}> = ({ type }) => (
  <p>{type === "D" ? "Deposit" : type === "W" ? "Withdraw" : ""}</p>
);
