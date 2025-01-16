import { Dispatch, SetStateAction } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { WalletData, WalletSliceState, setSelectedWallet } from "@store/slices/wallet";

import Loading from "components/loading";
import IocnPlaceholder from "assets/icons/IocnPlaceholder";
import {
  AddIcon,
  GlobeIcon,
  ReloadIcon,
  ThreeDotsMenu,
} from "../../../../../assets/icons";
import AccountCard from "./AccountCard";
import "./account.scss";
import { RightSubDrawerContent } from "../../types";
import { useCookies } from "react-cookie";

interface AccountMenuProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const AccountMenu: React.FunctionComponent<AccountMenuProps> = ({
  setIsRightSubDrawerOpen,
  setIsRightSubDrawerContent,
}) => {
  const [cookies, setCookie] = useCookies(["selectedAccount"]);
  const dispatch = useAppDispatch();

  const { wallets,walletsLoading, selectedWallet } = useAppSelector(
    (state: { wallet: WalletSliceState }) => state.wallet
  );
  console.log(wallets);

  if (walletsLoading) {
    return <Loading size="large" />;
  }

  return (
    <div>
      <div
        className="headerAddIcon"
        onClick={() => {
          setIsRightSubDrawerOpen(true);
          setIsRightSubDrawerContent("add-account");
        }}
      >
        <AddIcon />
      </div>
      <div className="accountsContainer">
        
        {wallets.slice().reverse().map((account) => (
          <AccountCard
            key={account.id}
            onClick={() =>{
              dispatch(setSelectedWallet(account))
              setCookie('selectedAccount',account, { path: '/' })
            } }
            icon={<IocnPlaceholder />} // To be replaced when backend add images to wallets
            accountType={account.name}
            amount={account.balance}
            // secAmount={account.account_type__symbol}
            accountData={account}
            suffixIcon={<ThreeDotsMenu />}
            tag="" // To be added when backend updates response
            selectedCard={selectedWallet?.id === account.id}
            setIsRightSubDrawerOpen={setIsRightSubDrawerOpen}
            setIsRightSubDrawerContent={setIsRightSubDrawerContent}
          />
        ))}
      </div>
    </div>
  );
};

export default AccountMenu;
