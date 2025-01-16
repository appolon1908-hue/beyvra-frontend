import { Dispatch, SetStateAction, useState, useRef, useEffect } from "react";
import {
  ArchiveIcon,
  DepositsIcon2,
  HistoryIcon,
  ReloadIcon,
  RenameIcon,
  TransactionIcon2,
  WithdrawIcon2,
} from "../../../../../assets/icons";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";
import "./account.scss";
import { RightSubDrawerContent } from "../../types";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import { Col, Row } from "antd";
import SecondaryButton from "../../../../../components/secondaryButton/SecondaryButton";
import { setEditableWallet, setSelectedWallet, setWallets, WalletSliceState } from "@store/slices/wallet";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { formatMoney } from "utils/utils";
import useWalletRefill from "api/wallet/useWalletReload";
import { useCookies } from "react-cookie";

interface AccountCardProps {
  icon: React.ReactNode;
  suffixIcon: React.ReactNode;
  accountType?: string;
  accountData?: any;
  currency?:any;
  amount?: number;
  secAmount?: string;
  selected?: boolean;
  tag?: string;
  onClick: () => void;
  selectedCard: boolean | null;
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const AccountCard: React.FunctionComponent<AccountCardProps> = ({
  icon,
  accountType,
  amount,
  secAmount,
  suffixIcon,
  currency,
  selected,
  selectedCard,
  tag,
  accountData,
  onClick,
  setIsRightSubDrawerOpen,
  setIsRightSubDrawerContent,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [cookies] = useCookies(["access_token"]);

  const {  wallets,selectedWallet } = useAppSelector(
    (state: { wallet: WalletSliceState }) => state.wallet
  );
  
  const {mutate, isPending} = useWalletRefill({
    onSuccess: (data:any) => {

      const updatedWallets = wallets.map((item)=>{
        if(item.id == data.id){
          return {...item , balance:data.balance}
        }
        return item
      })
      dispatch(setWallets(updatedWallets))
      dispatch(setSelectedWallet(data))
     
    },
    onError: (error) => {
      console.log("fetching wallets error", error);
    },
  })
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleSuffixIconClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDropdownVisible(!isDropdownVisible);
  };


  const handleReload = ()=>{
    console.log('reload');
    mutate({
      id: 3,
      token: cookies.access_token,
    });
  }

  useEffect(() => {
    const handler = (e: any) => {
        // @ts-ignore
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownVisible(false);
        }
    };
    window.addEventListener('click', handler);
    return () => {
        window.removeEventListener('click', handler);
    };
  });
 console.log(accountData.currency?.image);
  return (
    <div
      onClick={onClick}
      className={`accountCardWrapper ${selected ? "selected" : ""}`}
    >
      {selectedCard ? (

        // <MainItemCard
        //   variant={2}
        //   className={`new-card ${
        //     isDropdownVisible ? "backgroundNone" : "backgroundColor"
        //   }`}
        // >
        <div className="selected-account-card">
          <div className="leftSide-card">
            <div className="leftSide">

              <div className="icon">
                <img src={accountData.currency?.image} alt="" />
              </div>
              <div className="accountDeets">
                <div className="accountType">{accountData.currency?.longer_name} {accountData?.name}</div>
                 <div className="amount">{accountData.currency?.symbol} {formatMoney(accountData.balance || 0)}</div> 
                <div className="secAmount">{secAmount}</div>
              </div>
            </div>

            <div className="demoReloadIcon"
             onClick={handleReload} 
             style={{display: accountData.id === 3 ? 'block': 'none'}}>
              <ReloadIcon/>
            </div>

            <div
              className="suffixIcon"
              style={{display: accountData.id === 3 ? 'none': 'block'}}
              ref={dropdownRef}
              onBlur={() => setDropdownVisible(false)}
              onClick={handleSuffixIconClick}
            >
              {tag ? <div className="tag">{tag}</div> : null}

              {suffixIcon}
              
              {isDropdownVisible && (
                <div className="dropdownMenu">
                  <div
                    onClick={() => {
                      setIsRightSubDrawerOpen(true);
                      setIsRightSubDrawerContent("payments-deposit");
                    }}
                    className="dropdownMenuContent"
                  >
                    <div className="dropdownMenuIcon">
                      <DepositsIcon2 />
                    </div>
                    <div className="dropdownMenuItem">Deposit</div>
                  </div>
                  <div
                    onClick={() => {
                      setIsRightSubDrawerOpen(true);
                      setIsRightSubDrawerContent("withdraw");
                    }}
                    className="dropdownMenuContent"
                  >
                    <div className="dropdownMenuIcon">
                      <WithdrawIcon2 />
                    </div>
                    <div
                      className="dropdownMenuItem"
                      onClick={() => {
                        setIsRightSubDrawerOpen(true);
                        setIsRightSubDrawerContent("withdraw");
                      }}
                    >
                      Withdraw
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setIsRightSubDrawerOpen(true);
                      setIsRightSubDrawerContent("transfer");
                    }}
                    className="dropdownMenuContent"
                  >
                    <div className="dropdownMenuIcon">
                      <TransactionIcon2 />
                    </div>
                    <div className="dropdownMenuItem">Transfer</div>
                  </div>
                  <div
                    onClick={() => navigate("/transactions")}
                    className="dropdownMenuContent"
                  >
                    <div className="dropdownMenuIcon">
                      <HistoryIcon />
                    </div>
                    <div className="dropdownMenuItem">Transactions</div>
                  </div>
                  <div
                    onClick={() => {
                      dispatch(setEditableWallet(accountData));
                      setIsRightSubDrawerOpen(true);
                      setIsRightSubDrawerContent("account-rename");
                    }}
                    className="dropdownMenuContent"
                  >
                    <div className="dropdownMenuIcon">
                      <RenameIcon />
                    </div>
                    <div className="dropdownMenuItem">Rename</div>
                  </div>
                  <div
                    onClick={() => {
                      dispatch(setEditableWallet(accountData));
                      setIsRightSubDrawerOpen(true);
                      setIsRightSubDrawerContent("account-archive-menu");
                    }}
                    className="dropdownMenuContent"
                  >
                    <div className="dropdownMenuIcon">
                      <ArchiveIcon />
                    </div>
                    <div className="dropdownMenuItem">Archive</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div  style={{ display: accountData.id === selectedWallet?.id && accountData.id !== 3 ? '' : 'none' }}>
            {/* <h1>{accountData.id}</h1>
            <h1>{selectedWallet?.id }</h1> */}
          <Row gutter={10} className="buttons">
            <Col span={11}>
              <PrimaryButton
                className="buttons-2"
                Title="Deposit"
                backgroundColor="#28bd66"
                onClick={() => {
                  setIsRightSubDrawerOpen(true);
                  setIsRightSubDrawerContent("payments-deposit");
                }}
                />
            </Col>
            <Col span={11}>
              <SecondaryButton
              backgroundColor="red"
                className="buttons-1"
                Title="Withdraw"
                onClick={() => {
                  setIsRightSubDrawerOpen(true);
                  setIsRightSubDrawerContent("withdraw");
                }}
              />
            </Col>
          </Row>
          </div>
        {/* </MainItemCard> */}
        </div>
      ) : (
        <>
         <div className="selected-account-card">
          <div className="leftSide-card">
            <div className="leftSide">

              <div className="icon">
                <img src={accountData.currency?.image} alt="" />
              </div>
              <div className="accountDeets">
                <div className="accountType">{accountData.currency?.longer_name} {accountData?.name}</div>
                 <div className="amount">{accountData.currency?.symbol} {formatMoney(accountData.balance || 0)}</div> 
                <div className="secAmount">{secAmount}</div>
              </div>
            </div>
            
            <div className="demoReloadIcon"
             onClick={handleReload} 
             style={{display: accountData.id === 3 ? 'block': 'none'}}>
              <ReloadIcon/>
            </div>
            <div
              className="suffixIcon"
              style={{display: accountData.id === 3 ? 'none': 'block'}}
              ref={dropdownRef}
              onBlur={() => setDropdownVisible(false)}
              onClick={handleSuffixIconClick}
            >
              {tag ? <div className="tag">{tag}</div> : null}

              {suffixIcon}

              {isDropdownVisible && (
                <div className="dropdownMenu">
                  <div
                    onClick={() => {
                      setIsRightSubDrawerOpen(true);
                      setIsRightSubDrawerContent("payments-deposit");
                    }}
                    className="dropdownMenuContent"
                  >
                    <div className="dropdownMenuIcon">
                      <DepositsIcon2 />
                    </div>
                    <div className="dropdownMenuItem">Deposit</div>
                  </div>
                  <div
                    onClick={() => {
                      setIsRightSubDrawerOpen(true);
                      setIsRightSubDrawerContent("withdraw");
                    }}
                    className="dropdownMenuContent"
                  >
                    <div className="dropdownMenuIcon">
                      <WithdrawIcon2 />
                    </div>
                    <div
                      className="dropdownMenuItem"
                      onClick={() => {
                        setIsRightSubDrawerOpen(true);
                        setIsRightSubDrawerContent("withdraw");
                      }}
                    >
                      Withdraw
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setIsRightSubDrawerOpen(true);
                      setIsRightSubDrawerContent("transfer");
                    }}
                    className="dropdownMenuContent"
                  >
                    <div className="dropdownMenuIcon">
                      <TransactionIcon2 />
                    </div>
                    <div className="dropdownMenuItem">Transfer</div>
                  </div>
                  <div
                    onClick={() => navigate("/transactions")}
                    className="dropdownMenuContent"
                  >
                    <div className="dropdownMenuIcon">
                      <HistoryIcon />
                    </div>
                    <div className="dropdownMenuItem">Transactions</div>
                  </div>
                  <div
                    onClick={() => {
                      dispatch(setEditableWallet(accountData));
                      setIsRightSubDrawerOpen(true);
                      setIsRightSubDrawerContent("account-rename");
                    }}
                    className="dropdownMenuContent"
                  >
                    <div className="dropdownMenuIcon">
                      <RenameIcon />
                    </div>
                    <div className="dropdownMenuItem">Rename</div>
                  </div>
                  <div
                    onClick={() => {
                      dispatch(setEditableWallet(accountData));
                      setIsRightSubDrawerOpen(true);
                      setIsRightSubDrawerContent("account-archive-menu");
                    }}
                    className="dropdownMenuContent"
                  >
                    <div className="dropdownMenuIcon">
                      <ArchiveIcon />
                    </div>
                    <div className="dropdownMenuItem">Archive</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div  style={{ display: accountData.id === selectedWallet?.id && accountData.id !== 3 ? '' : 'none' }}>
            {/* <h1>{accountData.id}</h1>
            <h1>{selectedWallet?.id }</h1> */}
          <Row gutter={10} className="buttons">
            <Col span={11}>
              <SecondaryButton
              backgroundColor="grey"
                className="buttons-1"
                Title="Withdraw"
                onClick={() => {
                  setIsRightSubDrawerOpen(true);
                  setIsRightSubDrawerContent("withdraw");
                }}
              />
            </Col>
            <Col span={11}>
              <PrimaryButton
                className="buttons-2"
                Title="Deposit"
                backgroundColor="#0094ff"
                onClick={() => {
                  setIsRightSubDrawerOpen(true);
                  setIsRightSubDrawerContent("payments-deposit");
                }}
                />
            </Col>
          </Row>
          </div>
        {/* </MainItemCard> */}
        </div>
        </>
      )}
    </div>
  );
};

export default AccountCard;
