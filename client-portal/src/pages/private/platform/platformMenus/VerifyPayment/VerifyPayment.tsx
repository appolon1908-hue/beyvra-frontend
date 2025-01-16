import { Button, Typography } from "antd";
import { BlueCardIcon } from "../../../../../assets/icons";
import "./VerifyPayment.scss";

const VerifyPayment = () => {
  return (
    <div className="verify-payment">
      <BlueCardIcon />
      <Typography.Text className="verify-payment-amount-title">
        Payment Amount
      </Typography.Text>
      <Typography.Text className="verify-payment-amount-subtext">
        USD 30
      </Typography.Text>

      <div className="options-list">
        <div className="option-row">
          <Typography.Text className="option-subtext">
            Payment Amount
          </Typography.Text>
          <Button>Bank Cards</Button>
        </div>
        <div className="hr" />
        <div className="option-row">
          <Typography.Text className="option-subtext">
            Deposit Account
          </Typography.Text>
          <Button>Bank USD Account #2859844961</Button>
        </div>
        <div className="hr" />
        <div className="option-row">
          <Typography.Text className="option-subtext">Currency</Typography.Text>
          <Button>USD</Button>
        </div>
      </div>

      <div className="verify-payment-redirect-msg">
        <Typography.Text className="verify-payment-redirect-text">
          You will be redirected to the payment system page afterwards
        </Typography.Text>
        <div className="profileCard settingsButton">
          <button className="settings">
            <span className="txt">Continue</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPayment;
