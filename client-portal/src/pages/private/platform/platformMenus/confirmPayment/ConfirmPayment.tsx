import { FC } from "react";
import { useAppSelector } from "@store/hooks";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import "./confirmPayment.scss";
import { Modal } from "antd";

interface ConfirmPaymentProps {
  isModalOpen: any;
  setIsModalOpen: any;
}

const ConfirmPayment: FC<ConfirmPaymentProps> = (
  {
    isModalOpen,
    setIsModalOpen,
  }
) => {
  const { amount, selectedPaymentMethod, } = useAppSelector((state) => state.payment);

  const handleConfirmationClick = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      className="depositModal"
      footer={''}
      centered
    >
      <div className="confirmPayment">
        <div className="header">
          {/* <BlueCardIcon /> */}
          {selectedPaymentMethod?.methodIcon}
          <p>Payment Amount</p>
          <h2>EUR {amount}</h2>
        </div>
        <div className="body">
          <div className="bodyItem">
            <p>Payment Method</p>
            <div className="bodyItemCard">{selectedPaymentMethod?.name}</div>
          </div>
          <hr />
          <div className="bodyItem">
            <p>Deposit Account</p>
            <div className="bodyItemCard">Bank USD Account #2859844961</div>
          </div>
          <hr />
          <div className="bodyItem">
            <p>Currency</p>
            <div className="bodyItemCard">EUR</div>
          </div>
          <hr />
        </div>
        <p className="footerText">
          You will be redirected to the payment system page afterwards
        </p>
        <PrimaryButton Title="Confirm" onClick={() => handleConfirmationClick()} />
      </div>
    </Modal>
  );

};

export default ConfirmPayment;
