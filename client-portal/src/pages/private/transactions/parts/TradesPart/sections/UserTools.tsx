import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import { DatePicker, Select } from "antd";
import { CalendarIcon, FillCaretDownIcon } from "../../../../../../assets/icons";


import "../trades.scss";
import { useAppSelector } from "@store/hooks";
import useTransactions, { TransactionHistoryEntry } from "api/wallet/useTransactions";
import { statusAndTypesList } from "pages/private/transactions/constants";
import { useCookies } from "react-cookie";

interface UserToolsProps {
  tabKey: string;
  setTabKey: Dispatch<SetStateAction<string>>;
  setTableData: Dispatch<SetStateAction<TransactionHistoryEntry[]>>
  tabs: {
    label: string;
    key: string;
  }[];
}

const UserTools:FC<UserToolsProps> = ({ setTabKey, tabs, setTableData }) => {
  const [cookies] = useCookies(["access_token"]);

  const { wallets } = useAppSelector((state) => state.wallet);
  const assets = useAppSelector((state) => state.markets.assets);

  const [currency, setCurrency] = useState<string>();
  const [asset, setAsset] = useState<string>();
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [type, setType] = useState<string>();

const { mutate: transactionsMutate } = useTransactions({});

const accountsOptions = useMemo(
  () =>
    wallets.map(({ account_type__symbol, name }) => ({
      value: account_type__symbol,
      label: name,
    })),
  [wallets]
);

const assetsOptions = useMemo(() => (Array.isArray(assets) ? assets : []).map((elm) => ({
  value: elm.symbol,
  label: elm.name,
})),[assets])

const typeOrStatusHandler = (value: string) => {
  const findItem = statusAndTypesList.filter((item) => item.value === value)[0];

  if (findItem) {
    setStatus(undefined);
    setType(undefined);

    if (findItem.type === "status") return setStatus(findItem?.value);
    return setType(findItem?.value);
  }
};

useEffect(() => {
  if (currency || startDate || endDate || status || type || asset) {
    transactionsMutate(
      {
        token: cookies.access_token,
        options: {
          asset,
          created_after: startDate,
          created_before: endDate,
          status,
        },
      },
      {
        onSuccess: (data) => setTableData(data.results),
      }
    );
  }
}, [currency, startDate, endDate, status, type, asset, transactionsMutate, cookies.access_token, setTableData]);
  
  return (
    <div className="user-options-bar user-options-trades">
      <div className="user-option-control-item trades-user-option-select-box beyvra-select-tabkey">
        <Select
          onChange={setTabKey}
          defaultValue="Forex"
          options={tabs}
          suffixIcon={<FillCaretDownIcon />}
        />
      </div>

      <div className="user-option-control-item trades-user-option-select-box">
        <label>Account Type</label>
        <Select
          onChange={setCurrency}
          options={accountsOptions}
          suffixIcon={<FillCaretDownIcon />}
        />
      </div>
      <div className="user-option-control-item trades-user-option-select-box">
        <label>Assest</label>
        <Select
          onChange={setAsset}
          options={assetsOptions}
          suffixIcon={<FillCaretDownIcon />}
        />
      </div>

      <div className="user-option-control-item trades-user-option-select-box select-item-status">
        <label>Status</label>
        <Select
          onChange={typeOrStatusHandler}
          options={statusAndTypesList}
          suffixIcon={<FillCaretDownIcon />}
        />
      </div>
      <div className="trades-select-date-pickers">
        <div className="user-option-control-item trades-user-option-select-box">
          <DatePicker
            size="large"
            placeholder="Start Date"
            suffixIcon={<CalendarIcon />}
            onChange={(event) => {
              if (event) setStartDate(event.toDate().toISOString());
            }}
            className="trades-user-tools-date-picker"
          />
        </div>
        <p>-</p>
        <div className="user-option-control-item trades-user-option-select-box">
          <DatePicker
            size="large"
            placeholder="End Date"
            onChange={(event) => {
              if (event) setEndDate(event.toDate().toISOString());
            }}
            suffixIcon={<CalendarIcon />}
            className="trades-user-tools-date-picker"
          />
        </div>
      </div>
    </div>
  );
};

export default UserTools;
