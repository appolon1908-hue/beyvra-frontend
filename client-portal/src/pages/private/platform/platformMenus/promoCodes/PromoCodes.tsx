import { Modal, Typography } from "antd";
import "./PromoCodes.scss";
import PromoCodeInput from "../../../../../components/promoCodeInpute/PromoCodeInput";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import { FC } from "react";
import { PromoCodeIcon } from "assets/icons";

interface PromoCodesProps {
  isModalOpen: any;
  setIsModalOpen: any;
  setIsSucsessModalOpen: any;
}
const PromoCodes: FC<PromoCodesProps> = ({
  isModalOpen,
  setIsModalOpen,
  setIsSucsessModalOpen
}) => {
  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      className="promocodesModal"
      footer={''}
      centered
    >
      <div className="promocodes">
        <div className="promocodes-title">
          {'Promo Code'}
        </div>
        <div className="promocodes-subTitle">
          {'Use promo codes to unlock useful trading tools and features'}
        </div>
        <PromoCodeInput
          className="promocode-input"
          title="Enter Your Promo Code"
        />
        <PrimaryButton
          Title="Check Promo Code"
          icon={<PromoCodeIcon />}
          className={`mt-[30px] promocodes-button`}
          onClick={() => {
            setIsModalOpen(false);
            setIsSucsessModalOpen(true);
          }}
        />
      </div>
    </Modal>
  );
};

export default PromoCodes;
