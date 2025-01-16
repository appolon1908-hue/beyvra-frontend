import { EuroFlag, PaymentIcon } from "../../../../../assets/icons";
import DepositCard from "../../../../../components/depositCard/DepositCard";
import DepositInput from "../../../../../components/depositInput/DepositInput";
import "./WithdrawPayment.scss";
import { Dispatch, FC, SetStateAction } from "react";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import { Modal } from "antd";

interface WithdrawPaymentProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsWithdrawRequestModalOpen: Dispatch<SetStateAction<boolean>>;
  isModalOpen: boolean;
}

const WithdrawPayment: FC<WithdrawPaymentProps> = ({
  isModalOpen,
  setIsModalOpen,
  setIsWithdrawRequestModalOpen,
}) => {
  const handleCancle = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancle}
      className="depositModal"
      footer={""}
      centered
    >
      <div className="withdraw-payment">
        <div className="withdrawTitle">Withdraw</div>
        <div className="withdraw-payment-buttons">
          <DepositCard
            CountryIcon={<EuroFlag />}
            account="From USD Account"
            amount={0}
            currency={""}
          />
          <DepositCard
            CountryIcon={<PaymentIcon />}
            account="To Bank Cards"
            amount={540691}
            currency={""}
          />
          <DepositInput
            placeholderColor
            marginTop
            classname="bordercolor"
            placeholder="Amount - USD"
          />
        </div>
        <div className="withdraw-details">
          <div className="withdraw-transfer">
            <p>Transfer Amount - USD</p>
            <p>0.00</p>
          </div>
          <div className="hr" />
          <div className="withdraw-transfer">
            <p>Comission - USD</p>
            <p>0.00</p>
          </div>
          <div className="hr" />
          <div className="withdraw-transfer">
            <p>Total - USD</p>
            <p>0.00</p>
          </div>
          <div className="hr" />
        </div>
        <PrimaryButton
          Title="Withdraw"
          className="button-withdraw"
          onClick={() => {
            setIsModalOpen(false);
            setIsWithdrawRequestModalOpen(true);
          }}
        />
      </div>
    </Modal>
  );
};

export default WithdrawPayment;
