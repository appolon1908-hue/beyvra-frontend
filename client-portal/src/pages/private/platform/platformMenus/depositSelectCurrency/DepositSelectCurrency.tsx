import {
  EuroFlag,
  NumberInputIcon,
  SearchIcon,
} from "../../../../../assets/icons";
import "./depositSelectCurrency.scss";
import { useEffect, useState } from "react";
import { debounce } from "lodash";
import { InitialAccountsList } from "../add-account/constants";
import DepositCard from "../../../../../components/depositCard/DepositCard";

const DepositSelectCurrency = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState(InitialAccountsList);

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      const filteredItems = InitialAccountsList.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setItems(filteredItems);
    }, 300);
    debouncedSearch();
    return debouncedSearch.cancel;
  }, [searchTerm]);

  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="depositAccount">
      <DepositCard
        input
        account="Deposit Amount"
        amount={0}
        CountryIcon={<EuroFlag />}
        cardIcon={<NumberInputIcon />}
        currency={""}
      />
      <div className="searchAccount">
        <SearchIcon />
        <input type="text" value={searchTerm} onChange={handleSearch} />
      </div>
      {items.map((item) => (
        <div key={item.id} className="AccountPinnedData">
          <div className="AccountsData">
            {item.icon}
            <div>
              <h2>{item.title}</h2>
              <p>{item.amount}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepositSelectCurrency;
