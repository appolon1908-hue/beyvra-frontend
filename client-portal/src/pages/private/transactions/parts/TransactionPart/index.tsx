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
import moment from "moment";
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
        amount: `${item.amount} (${item.asset})`,
        asset: item.asset,
        price: item.price ?? '-',
        tradeType: item.side ?? item.type,
        date: moment(item.occurred_at).format('DD MMM YYYY'),
        fee: item.fee,
        tranasactionID: item.source_ref,
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
      <TransactionTable data={tableData} column={['Trade ID', 'Amount (Currency)', 'Asset', 'Price (per unit) ', 'Trade Type ("Buy" or "Sell")', 'Date', 'Fees', 'Transaction ID', 'Status']} />
    </>
  );
};
export default TransactionPart;
