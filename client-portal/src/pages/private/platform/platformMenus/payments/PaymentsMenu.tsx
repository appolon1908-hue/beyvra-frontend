import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DepositsIcon2, WithdrawIcon2, TransactionIcon2, HistoryIcon } from "../../../../../assets/icons";
import { RightSubDrawerContent } from "../../types";
import TransferMenu from "../transfer/TransferMenu";
import TransferSuccessMenu from "../transfersuccessful/TransferSuccessMenu";
import DemoFundsModal from "./DemoFundsModal";
import "./paymentsMenu.scss";

interface PaymentsMenuProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const PaymentsMenu: React.FunctionComponent<PaymentsMenuProps> = (_props) => {
  const navigate = useNavigate();
  const [fundsMode, setFundsMode] = useState<"deposit" | "withdraw" | null>(null);
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  return (
    <>
      <div className="paymentsMenu">
        <button type="button" className="paymentItem" onClick={() => setFundsMode("deposit")}>
          <DepositsIcon2 /> <h2>Demo deposit</h2>
        </button>
        <button type="button" className="paymentItem" onClick={() => setFundsMode("withdraw")}>
          <WithdrawIcon2 /> <h2>Demo withdraw</h2>
        </button>
        <button type="button" className="paymentItem" onClick={() => setTransferOpen(true)}>
          <TransactionIcon2 /> <h2>Transfer</h2>
        </button>
        <button type="button" className="paymentItem" onClick={() => navigate("/transactions")}>
          <HistoryIcon /> <h2>Transactions</h2>
        </button>
      </div>
      {fundsMode && (
        <DemoFundsModal mode={fundsMode} open onClose={() => setFundsMode(null)} />
      )}
      <TransferMenu
        isModalOpen={transferOpen}
        setIsModalOpen={setTransferOpen}
        setIsSucsessModalOpen={setTransferSuccess}
      />
      <TransferSuccessMenu
        isModalOpen={transferSuccess}
        setIsModalOpen={setTransferSuccess}
        title="Transfer successful"
        button="Close"
      />
    </>
  );
};

export default PaymentsMenu;
