import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SearchIcon } from "../../../../../assets/icons";
import "./selectAccount.scss";
import { RightSubDrawerContent } from "../../types";
import { InitialAccountsList } from "../add-account/constants";
import { debounce } from "lodash";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";

interface TransferAccountSelectMenuProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const TransferAccountSelectMenu: React.FC<TransferAccountSelectMenuProps> = ({
  setIsRightSubDrawerOpen,
  setIsRightSubDrawerContent,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState(InitialAccountsList);
  const [pinnedAccount, setPinnedAccount] = useState(InitialAccountsList[0]);

  const handleSearch = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      if (searchTerm === "") {
        setItems(
          InitialAccountsList.filter((item) => item.id !== pinnedAccount.id)
        );
      } else {
        const filteredItems = InitialAccountsList.filter((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).filter((item) => item.id !== pinnedAccount.id);
        setItems(filteredItems);
      }
    }, 300);
    debouncedSearch();
    return debouncedSearch.cancel;
  }, [searchTerm, pinnedAccount]);
  return (
    <div className="TransferAccountSelectMenu">
      <div className="searchAccount">
        <SearchIcon />
        <input type="text" value={searchTerm} onChange={handleSearch} />
      </div>
      <MainItemCard className="AccountPinned" variant={2}>
        <div
          className="PinnedValue"
          onClick={() => {
            setIsRightSubDrawerOpen(true);
            setIsRightSubDrawerContent("transfer");
          }}
        >
          {pinnedAccount.icon}
          <div>
            <h2>{pinnedAccount.title}</h2>
            <p>{pinnedAccount.amount}</p>
          </div>
        </div>
      </MainItemCard>
      {items.map((item) => (
        <div key={item.id} className="AccountPinnedData">
          <div
            className="AccountsData"
            onClick={() => {
              setPinnedAccount(item);
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

export default TransferAccountSelectMenu;
