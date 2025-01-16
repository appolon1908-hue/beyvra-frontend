import { TimerIcon2, UsdtIcon } from "../../../../../assets/icons";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import "./paymentProcessing.scss";
import { Modal } from "antd";

const PaymentProcessing = ({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: any;
  setIsModalOpen: any;
}) => {
  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      className="depositModal"
      footer={''}
      centered
    >
      <div className="paymentProcessing">
        <div className="header">
          <TimerIcon2 />
          <h2>Payment still being processed</h2>
          <p>We’ll notify you once your funds have been deposited</p>
        </div>
        <div className="paymentBody">
          <div className="bodyHeader">
            <UsdtIcon />
            <h2>250 EUR</h2>
          </div>
          <div className="paymentBodyCard">Estimated deposit time: 2 hours</div>
        </div>
        <PrimaryButton className="button" Title="Finalize" onClick={() => setIsModalOpen(false)} />
      </div>
    </Modal>
  );
};

export default PaymentProcessing;
