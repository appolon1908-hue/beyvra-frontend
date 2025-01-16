import { TableColumnsType } from "antd";
import {
  StatusHandler,
  TransferTypeHandler,
  methodIconHandler,
} from "./helpers";
import { ITransaction } from "@interfaces";
import moment from "moment";

export const columns: TableColumnsType<ITransaction> = [
  {
    title: "Date and Time",
    dataIndex: "created_at",
    key: "created_at",
    render: (value) => (
      <>
        {moment(value).format("Do MMM YYYY")}
        <br />
        {moment(value).format("hh:mm:ss")}
      </>
    ),
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (value) => <TransferTypeHandler type={value} />,
  },
  {
    title: "Payment System",
    dataIndex: "payment_system",
    key: "payment_system",
    render: () => methodIconHandler("Bank Card"),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (value) => <StatusHandler status={value} />,
  },
  {
    title: "Account",
    dataIndex: "currency",
    key: "currency",
    render: (value) => <span>{value}</span>,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (value) => <span>{value}</span>,
  },
];

export const accountsOptions = [
  { value: "all", label: "All Accounts" },
  { value: "usd", label: "USD Account" },
  { value: "EUR", label: "EURO Account" },
  { value: "BTC", label: "BITCOIN Account" },
  { value: "ETH", label: "ETHIRIOM Account" },
  { value: "$$", label: "Unknown Account" },
];
