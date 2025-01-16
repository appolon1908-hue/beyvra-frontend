import { Typography } from "antd";
import {
  SuccessIcon,
  Trusty1Icon,
  Trusty2Icon,
  Trusty3Icon,
} from "../../../../../assets/icons";
import "./TransferSuccessMenu.scss";
import { FC } from "react";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import Modal from "antd/es/modal/Modal";

interface TransferSuccessMenuProps {
  isModalOpen: any;
  setIsModalOpen: any;
  title: string;
  description?: string;
  button: string;
}
const TransferSuccessMenu: FC<TransferSuccessMenuProps> = ({
  isModalOpen,
  setIsModalOpen,
  title,
  description,
  button,
}) => {
  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      className="depositModal"
      footer={""}
      centered
    >
      <div className="Transfer-success">
        <div className="deposit-success-sub">
          <SuccessIcon width="40" height="40" />
          <Typography.Text className="success-message">{title}</Typography.Text>
          {description && (
            <div>
              <Typography.Title className="deposited-payment">
                {description}
              </Typography.Title>
            </div>
          )}
        </div>
        <PrimaryButton
          className="button"
          Title={button}
          onClick={() => {
            setIsModalOpen(false);
          }}
        />
        <div className="deposited-trust">
          <Typography.Text className="deposited-trust-text">
            Trusted by more than 500,000 users globally
          </Typography.Text>
          <div className="deposited-trust-icons">
            <Trusty1Icon />
            <Trusty2Icon />
            <Trusty3Icon />
            <img src="/menu-images/svgs/NortanSecured.svg" alt="svg" />
          </div>
          <Typography.Text className="deposited-trust-subtext">
            Your funds are safely stored in a trusted bank. All payments are
            secures by 128-bit encryption and processed at a tier 4 data center
            with 99.995% availability. Our platform is checked for malware.
          </Typography.Text>
        </div>
      </div>
    </Modal>
  );
};

export default TransferSuccessMenu;
