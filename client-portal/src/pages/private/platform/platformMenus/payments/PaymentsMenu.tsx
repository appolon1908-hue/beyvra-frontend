import {
  DepositsIcon2,
  WithdrawIcon2,
  TransactionIcon2,
  HistoryIcon,
  WireGlobe,
} from "../../../../../assets/icons";
import "./paymentsMenu.scss";
import { Dispatch, SetStateAction, useState } from "react";
import { RightSubDrawerContent } from "../../types";
import { useNavigate } from "react-router-dom";
import ModalWireTransfer from "components/modalWireTranfer/modalWireTransfer";
import Deposit from "../deposit/Deposit";
import WithdrawMenu from "../withdraw/WithdrawMenu";
import TransferMenu from "../transfer/TransferMenu";
import PromoCodes from "../promoCodes/PromoCodes";
import TransferSuccessMenu from "../transfersuccessful/TransferSuccessMenu";
import SelectAmountMenu from "../selectAmountMenu/SelectAmountMenu";
import PaymentMethod from "../paymentMethod/PaymentMethod";
import CryptoPayments from "../cryptoPayments/CryptoPayments";
import PaymentProcessing from "../paymentProcessing/PaymentProcessing";
import ConfirmPayment from "../confirmPayment/ConfirmPayment";
import WithdrawAccount from "../withdrawAccount/WithdrawAccount";
import WithdrawPayment from "../withdrawpayment/WithdrawPayment";
import WithdrawRequest from "../withdrawRequest/WithdrawRequest";

interface PaymentsMenuProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const PaymentsMenu: React.FunctionComponent<PaymentsMenuProps> = ({
  setIsRightSubDrawerOpen,
  setIsRightSubDrawerContent,
}) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isWithdrawRequestModalOpen, setIsWithdrawRequestModalOpen] = useState<boolean>(false);
  const [isWithdrawPaymentModalOpen, setIsWithdrawPaymentModalOpen] = useState<boolean>(false);
  const [isWithdrawAccountModalOpen, setIsWithdrawAccountModalOpen] = useState<boolean>(false);
  const [isConfirmPaymentModalOpen, setIsConfirmPaymentModalOpen] = useState<boolean>(false);
  const [isPaymentProcessingModalOpen, setIsPaymentProcessingModalOpen] = useState<boolean>(false);
  const [isCryptoPaymentsModalOpen, setIsCryptoPaymentsModalOpen] = useState<boolean>(false);
  const [isPaymentMethodModalOpen, setIsPaymentMethodModalOpen] = useState<boolean>(false);
  const [isSelectAmountModalOpen, setIsSelectAmountModalOpen] = useState<boolean>(false);
  const [isTransferSuccessModalOpen, setIsTransferSuccessModalOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSucsessModalOpen] = useState<boolean>(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState<boolean>(false);
  const [isModalDepositOpen, setIsModalDepositOpen] = useState<boolean>(false);
  const [isModalWithdrawOpen, setIsModalWithdrawOpen] =
    useState<boolean>(false);
  const [isModalTransferOpen, setIsModalTransferOpen] =
    useState<boolean>(false);

  return (
    <>
      <div>
        <div className="paymentsMenu">
          <div
            className="paymentItem"
            onClick={() => {
              setIsModalDepositOpen(true);
            }}
          >
            <DepositsIcon2 /> <h2>Deposit</h2>
          </div>
          <div
            className="paymentItem"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <WireGlobe /> <h2>Wire Transfer</h2>
          </div>
          <div
            className="paymentItem"
            onClick={() => {
              setIsModalWithdrawOpen(true);
            }}
          >
            <WithdrawIcon2 /> <h2>Withdraw</h2>
          </div>
          <div
            className="paymentItem"
            onClick={() => {
              setIsModalTransferOpen(true);
            }}
          >
            <TransactionIcon2 /> <h2>Transfer</h2>
          </div>
          <div
            className="paymentItem"
            onClick={() => navigate("/transactions")}
          >
            <HistoryIcon /> <h2>Transaction</h2>
          </div>
        </div>
      </div>
      <Deposit
        isModalOpen={isModalDepositOpen}
        setIsModalOpen={setIsModalDepositOpen}
        setIsPromoModalOpen={setIsPromoModalOpen}
        setIsSelectAmountModalOpen={setIsSelectAmountModalOpen}
        setIsPaymentMethodModalOpen={setIsPaymentMethodModalOpen}
        setIsConfirmPaymentModalOpen={setIsConfirmPaymentModalOpen}
      />
      <ModalWireTransfer
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <WithdrawMenu
        isModalOpen={isModalWithdrawOpen}
        setIsModalOpen={setIsModalWithdrawOpen}
        setIsModalDepositOpen={setIsModalDepositOpen}
        setIsWithdrawAccountModalOpen={setIsWithdrawAccountModalOpen}
      />
      <TransferMenu
        isModalOpen={isModalTransferOpen}
        setIsModalOpen={setIsModalTransferOpen}
        setIsSucsessModalOpen={setIsTransferSuccessModalOpen}
      />
      <WithdrawAccount
        isModalOpen={isWithdrawAccountModalOpen}
        setIsModalOpen={setIsWithdrawAccountModalOpen}
        setIsWithdrawPaymentModalOpen={setIsWithdrawPaymentModalOpen}
      />
      <WithdrawPayment
        isModalOpen={isWithdrawPaymentModalOpen}
        setIsModalOpen={setIsWithdrawPaymentModalOpen}
        setIsWithdrawRequestModalOpen={setIsWithdrawRequestModalOpen}
      />
      <WithdrawRequest
        isModalOpen={isWithdrawRequestModalOpen}
        setIsModalOpen={setIsWithdrawRequestModalOpen}
      />
      <PromoCodes
        isModalOpen={isPromoModalOpen}
        setIsModalOpen={setIsPromoModalOpen}
        setIsSucsessModalOpen={setIsSucsessModalOpen}
      />
      <SelectAmountMenu
        isModalOpen={isSelectAmountModalOpen}
        setIsModalOpen={setIsSelectAmountModalOpen}
      />
      <PaymentMethod
        isModalOpen={isPaymentMethodModalOpen}
        setIsModalOpen={setIsPaymentMethodModalOpen}
        setIsCryptoPaymentsModalOpen={setIsCryptoPaymentsModalOpen}
      />
      <CryptoPayments
        isModalOpen={isCryptoPaymentsModalOpen}
        setIsModalOpen={setIsCryptoPaymentsModalOpen}
        setIsPaymentProcessingModalOpen={setIsPaymentProcessingModalOpen}
      />
      <PaymentProcessing
        isModalOpen={isPaymentProcessingModalOpen}
        setIsModalOpen={setIsPaymentProcessingModalOpen}
      />
      <TransferSuccessMenu
        isModalOpen={isTransferSuccessModalOpen}
        setIsModalOpen={setIsTransferSuccessModalOpen}
        title="Payment Successful"
        description="30 USD"
        button="Close"
      />
      <ConfirmPayment
        isModalOpen={isConfirmPaymentModalOpen}
        setIsModalOpen={setIsConfirmPaymentModalOpen}
      />
      <TransferSuccessMenu
        isModalOpen={isSuccessModalOpen}
        setIsModalOpen={setIsSucsessModalOpen}
        title="Your Promo Code has been applied"
        button="Done"
      />
    </>
  );
};

export default PaymentsMenu;
