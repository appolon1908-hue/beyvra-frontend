import { FC, useEffect, useMemo, useState } from "react";
import { Select, DatePicker } from "antd";
import { FillCaretDownIcon } from "../../../../../assets/icons";
import TransactionTable from "../DataTable";

import "../../transactions.scss";
import "./transaction.scss";
import { useAppSelector } from "@store/hooks";
import { statusAndTypesList } from "../../constants";
import { useCookies } from "react-cookie";
import useTransactions, { TransactionResultType } from "api/wallet/useTransactions";
import { format } from "date-fns";
const { RangePicker } = DatePicker
export const TransactionPart: FC = () => {
  const { wallets } = useAppSelector((state) => state.wallet);
  const [currency, setCurrency] = useState<string>();
  const [data, setData] = useState<TransactionResultType>();
  const accountsOptions = useMemo(
    () =>
      wallets.map(({ account_type__symbol, name }) => ({
        value: account_type__symbol,
        label: name,
      })),
    [wallets]
  );

  const [cookies] = useCookies(["access_token"]);

  const { mutate } = useTransactions({
    onSuccess: (data) => {
      setData(data);
    },
    onError: (error) => {
      console.log("fetching wallets error", error);
    },
  });

  useEffect(() => {
    mutate({ token: cookies.access_token });
  }, [cookies.access_token, mutate]);

  const tableData = useMemo(() => {
    const tempData = data?.results.map((item) => (
      {
        tradeID: item.id,
        user: item.user.email,
        amount: `${item.amount} (${item.currency.symbol})`,
        asset: item.currency.symbol,
        price: `${item.amount}$`,
        tradeType: 'Buy',
        date: format(new Date(item.request_date), 'dd MMM yyyy'),
        fee: `${item.network_fee}$`,
        tranasactionID: item.txid || '-',
        status: item.status,
      }
    ));
    return tempData;
  }, [data?.results])


  return (
    <>
      <div className="transactionFilterMainContainer">
        <span
          style={{
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '28px',
          }}
        >
          Transactions
        </span>
        <div className="transactionFilterContainer">
          <div className="transactionFilterDateRange">
            <label>Date Range</label>
            <RangePicker placeholder={['YYYY-MM-DD', 'YYYY-MM-DD']} style={{ border: 'none', boxShadow: 'none', color: 'black' }} />
          </div>
          <Select
            onChange={setCurrency}
            options={accountsOptions}
            suffixIcon={<FillCaretDownIcon />}
          />

          <Select
            options={statusAndTypesList}
            suffixIcon={<FillCaretDownIcon />}
          />
        </div>
      </div>
      <TransactionTable data={tableData} column={['Trade ID', 'User', 'Amount (Currency)', 'Asset', 'Price (per unit) ', 'Trade Type ("Buy" or "Sell")', 'Date', 'Fees', 'Transaction ID', 'Status']} />
    </>
  );
};
export default TransactionPart;