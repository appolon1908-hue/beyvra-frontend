import { DatePicker, Select } from "antd";
import { FillCaretDownIcon } from "../../../../../assets/icons";
import TransactionTable from "../DataTable";

import "../../transactions.scss";
import "./trades.scss";
import { useAppSelector } from "@store/hooks";
import { statusAndTypesList } from "../../constants";
import { FC, useMemo, useState } from "react";
const { RangePicker } = DatePicker

export const TradesPart: FC = () => {
  const { wallets } = useAppSelector((state) => state.wallet);
  const [currency, setCurrency] = useState<string>();
  const accountsOptions = useMemo(
    () =>
      wallets.map(({ account_type__symbol, name }) => ({
        value: account_type__symbol,
        label: name,
      })),
    [wallets]
  );

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
          Trades
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
      <TransactionTable data={tempData} column={['Trade ID', 'User', 'Amount', 'Asset', 'Account Type', 'Date', 'Status']} isTrade />
    </>
  );
};

const tempData = [
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
  {
    tradeID: '4647493028272',
    user: 'Hdjendfw....4yr87f',
    amount: '340',
    asset: 'Asset',
    price: '400 806$',
    tradeType: 'Buy',
    date: '01.08.24',
    status: 'In progress',
  },
]
export default TradesPart;
