import { Modal, Typography } from "antd";
import { UsdIcon2, UsdtIcon } from "../../../../../assets/icons";
import "./WithdrawAccount.scss";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";
import { FC } from "react";

interface WithdrawAccountProps {
  isModalOpen: boolean;
  setIsModalOpen: any;
  setIsWithdrawPaymentModalOpen: any;
}

const WithdrawAccount: FC<WithdrawAccountProps> = ({
  isModalOpen,
  setIsModalOpen,
  setIsWithdrawPaymentModalOpen,
}) => {
  const handleCancle = () => {
    setIsModalOpen(false);
  };
  const handleClick = () => {
    setIsModalOpen(false);
    setIsWithdrawPaymentModalOpen(true);
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={handleCancle}
      className="depositModal"
      footer={""}
      centered
    >
      <div className="h-[200px]">
        <div className="main">
          <MainItemCard
            variant={2}
            className="main-card"
            onClick={handleClick}
          >
            <div className="first-account">
              <UsdIcon2 />
              <div className="account-type">
                <Typography.Text className="account-flag">
                  USD Account
                </Typography.Text>
                <Typography.Text className="account-amount">
                  USD 0.00
                </Typography.Text>
              </div>
            </div>
          </MainItemCard>

          <MainItemCard
            variant={2}
            className="main-card"
            onClick={handleClick}
          >
            <div className="first-account">
              <UsdtIcon />
              <div className="account-type">
                <Typography.Text className="account-flag">
                  USDT Account
                </Typography.Text>
                <Typography.Text className="account-amount">
                  USD 0.00
                </Typography.Text>
              </div>
            </div>
          </MainItemCard>

          <MainItemCard
            variant={2}
            className="main-card"
            onClick={handleClick}
          >
            <div className="first-account">
              <UsdIcon2 />
              <div className="account-type">
                <Typography.Text className="account-flag">
                  USD Account
                </Typography.Text>
                <Typography.Text className="account-amount">
                  USD 0.00
                </Typography.Text>
              </div>
            </div>
          </MainItemCard>
        </div>
      </div>
    </Modal>
  );
};

export default WithdrawAccount;
