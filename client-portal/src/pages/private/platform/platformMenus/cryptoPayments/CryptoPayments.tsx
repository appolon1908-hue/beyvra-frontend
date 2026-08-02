import { TimerIcon2, UsdtIcon } from "../../../../../assets/icons";
import SecondaryButton from "../../../../../components/secondaryButton/SecondaryButton";
import "./cryptoPayments.scss";
import QRCode from "react-qr-code";
import { useAppSelector } from "@store/hooks";
import { Modal } from "antd";

interface CryptoPaymentsProps {
  isModalOpen: any;
  setIsModalOpen: any;
  setIsPaymentProcessingModalOpen: any;
}

const CryptoPayments: React.FunctionComponent<CryptoPaymentsProps> = ({
  isModalOpen,
  setIsModalOpen,
  setIsPaymentProcessingModalOpen,
}) => {
  const { selectedPaymentMethod } = useAppSelector((state) => state.payment);
  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      className="depositModal"
      footer={''}
      centered
    >
      <div className="cryptoPayments">
        <div className="header">
          <UsdtIcon />
          <p>Payment Amount</p>
          <h2>250 EUR</h2>
        </div>
        <p className="depositCode">
          Deposit code: 20958cc2-d120-11ee-8317-02c58245e617
        </p>
        <div className="QRCodeContainer">
          <div className="address">
            <p className="depositAddress">Deposit Address:</p>
            <p className="depositAddressCode">
              {selectedPaymentMethod?.account_id}
            </p>
          </div>
          <div className="address2">
            <p className="depositAddress">Network:</p>
            <p className="depositAddressCode">{selectedPaymentMethod?.network}</p>
          </div>
          <p className="QRMessage">
            Scan the QR code with your mobile phone or copy the TRC20 address
            below into your crypto wallet app
          </p>
          <div className="QRCode">
            {selectedPaymentMethod?.account_id && <QRCode
              bgColor="#05233b"
              fgColor="#ffffff"
              className="QRCodeScan"
              size={56}
              style={{ height: "auto", maxWidth: "80%", width: "60%" }}
              value={selectedPaymentMethod.account_id}
              viewBox={`0 0 56 56`}
            />}
          </div>
          <div className="btnContainer">
            <SecondaryButton
              className="button"
              Title="I have paid"
              onClick={() => {
                setIsModalOpen(false);
                setIsPaymentProcessingModalOpen(true);
              }}
            />
          </div>
        </div>
        <div className="footer">
          <TimerIcon2 />
          <p>70% of payments made via this method take 2 hours</p>
        </div>
      </div>
    </Modal>
  );
};

export default CryptoPayments;
