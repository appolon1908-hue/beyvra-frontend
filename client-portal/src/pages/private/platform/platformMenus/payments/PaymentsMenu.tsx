import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DepositsIcon2, WithdrawIcon2, TransactionIcon2, HistoryIcon } from "../../../../../assets/icons";
import { RightSubDrawerContent } from "../../types";
import DemoFundsModal from "./DemoFundsModal";
import FinancialDisabledNotice from "../../../../../components/financial/FinancialDisabledNotice";
import "./paymentsMenu.scss";

interface PaymentsMenuProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const PaymentsMenu: React.FunctionComponent<PaymentsMenuProps> = (_props) => {
  const navigate = useNavigate();
  const [fundsMode, setFundsMode] = useState<"deposit" | "withdraw" | null>(null);
  const [showRealMoneyDisabled, setShowRealMoneyDisabled] = useState(false);

  return (
    <>
      <div className="paymentsMenu">
        <button type="button" className="paymentItem" onClick={() => setFundsMode("deposit")}>
          <DepositsIcon2 /> <h2>Demo deposit</h2>
        </button>
        <button type="button" className="paymentItem" onClick={() => setFundsMode("withdraw")}>
          <WithdrawIcon2 /> <h2>Demo withdraw</h2>
        </button>
        <button type="button" className="paymentItem" onClick={() => setShowRealMoneyDisabled(true)}>
          <TransactionIcon2 /> <h2>Real transfer unavailable</h2>
        </button>
        <button type="button" className="paymentItem" onClick={() => navigate("/transactions")}>
          <HistoryIcon /> <h2>Transactions</h2>
        </button>
      </div>
      {fundsMode && (
        <DemoFundsModal mode={fundsMode} open onClose={() => setFundsMode(null)} />
      )}
      {showRealMoneyDisabled && <FinancialDisabledNotice />}
    </>
  );
};

export default PaymentsMenu;
