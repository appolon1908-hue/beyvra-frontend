import { ArrowRightOS, InfoCircleIconSmall } from "../../assets/icons";
import { Typography } from "antd";
import "./WithdrawCard.scss";
import { Dispatch, FC, SetStateAction } from "react";

interface WithdrawCardProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsModalDepositOpen: Dispatch<SetStateAction<boolean>>;
}
const WithdrawCard: FC<WithdrawCardProps> = ({
  setIsModalOpen,
  setIsModalDepositOpen,
}) => {
  return (
    <div className="Withdraw-card">
      <div>
        <InfoCircleIconSmall />
      </div>
      <div className="withdraw-subcard">
        <Typography.Text className="Withdraw-text">
          You have insufficient funds to make a withdrawal from this account
        </Typography.Text>
        <div
          className="withdraw-link"
          onClick={() => {
            setIsModalDepositOpen(true);
            setIsModalOpen(false);
          }}
        >
          <Typography.Link className="withdraw-link-text">
            Make Deposit
          </Typography.Link>
          <ArrowRightOS width="" height="" stroke="#2dd674" />
        </div>
      </div>
    </div>
  );
};

export default WithdrawCard;
