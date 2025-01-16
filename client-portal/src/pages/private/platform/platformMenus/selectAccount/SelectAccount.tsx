import { useEffect, useState } from "react";
import "./selectAccount.scss";
import {
  InitialAccountsList,
  InitialAccountsListProps,
} from "../add-account/constants";
import { debounce } from "lodash";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";

interface SelectAccountProps {
  hasParent: boolean | null;
  onitemSelection?: Function;
  handleCancleModalSelectAcountModal: any; title: string;
}

const SelectAccount: React.FC<SelectAccountProps> = ({
  handleCancleModalSelectAcountModal,
  hasParent = false,
  onitemSelection, title
}) => {
  const [items, setItems] = useState(InitialAccountsList);
  const [pinnedAccount, setPinnedAccount] = useState(InitialAccountsList[0]);

  const handleItemClick = (item: InitialAccountsListProps): void => {
    if (hasParent) {
      // @ts-ignore
      onitemSelection(item);
    } else {
      setPinnedAccount(item);
    }
  };

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      setItems(
        InitialAccountsList.filter((item) => item.id !== pinnedAccount.id)
      );
    }, 300);
    debouncedSearch();
    return debouncedSearch.cancel;
  }, [pinnedAccount]);

  return (
    <div className="selectAccountMenu">
      <div className="selectAccountMenu-title">
        {title}
      </div>
      {/* <MainItemCard className="AccountPinned" variant={2}>
        <div
          className="PinnedValue"
          onClick={() => {
            handleCancleModalSelectAcountModal(false);
          }}
        >
          {pinnedAccount.icon}
          <div>
            <h2>{pinnedAccount.title}</h2>
            <p>{pinnedAccount.amount}</p>
          </div>
        </div>
      </MainItemCard> */}
      {items.map((item) => (
        <div key={item.id} className="AccountPinnedData">
          <div
            className="AccountsData"
            onClick={() => {
              handleItemClick(item);
            }}
          >
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

export default SelectAccount;
