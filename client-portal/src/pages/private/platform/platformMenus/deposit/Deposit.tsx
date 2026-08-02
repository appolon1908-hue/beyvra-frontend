import { Checkbox, Modal } from "antd";
import "./Deposit.scss";
import DepositCard from "../../../../../components/depositCard/DepositCard";
import { PromoCodeIcon } from "../../../../../assets/icons";
import { FC, useCallback, useEffect } from "react";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import SecondaryButton from "../../../../../components/secondaryButton/SecondaryButton";
import { useAppSelector } from "@store/hooks";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import useQRCodeList from "api/wallet/useQrCodeList";
import { setPaymentMethod, setPaymentMethodList } from "@store/slices/payment";
import LockIcon from "/assets/lock.png";

interface DepositProps {
  isModalOpen: any
  setIsModalOpen: any
  setIsPromoModalOpen: any
  setIsSelectAmountModalOpen: any
  setIsPaymentMethodModalOpen: any
  setIsConfirmPaymentModalOpen: any
}

const Deposit: FC<DepositProps> = ({
  isModalOpen,
  setIsModalOpen,
  setIsPromoModalOpen,
  setIsSelectAmountModalOpen,
  setIsPaymentMethodModalOpen,
  setIsConfirmPaymentModalOpen,
}) => {
  const dispatch = useDispatch();
  const [cookies] = useCookies(["access_token"]);
  const { selectedWallet } = useAppSelector((state) => state.wallet);
  const { amount, selectedPaymentMethod } = useAppSelector((state) => state.payment);

  const { mutate } = useQRCodeList({
    onSuccess: (data) => {
      dispatch(setPaymentMethodList(data))
      console.log("seting payment method", data);
      if (selectedPaymentMethod == null) {

        dispatch(setPaymentMethod(data[0]))
      }
    },
  });

  useEffect(() => {
    mutate(cookies.access_token);
  }, [cookies.access_token, mutate]);

  const paymentCheckoutHandler = useCallback(() => {
    if (amount && selectedPaymentMethod?.name) {
      setIsConfirmPaymentModalOpen(true);
      setIsModalOpen(false);
    } else {
      toast.error("Amount or Payment method invalid");
    }
  }, [amount, selectedPaymentMethod?.name, setIsConfirmPaymentModalOpen, setIsModalOpen]);

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      closable
      className="depositModal"
      footer={''}
      centered
    >
      <div className="deposit">
        <div className="deposit-title">
          {'Deposit'}
        </div>
        <div className="deposit-subTitle">
          {selectedWallet?.currency?.symbol + ' Account #' + selectedWallet?.name}
        
        </div>
        <hr className="hr"/>
        <DepositCard
          account="Deposit Amount"
          amount={amount}
          currency={selectedWallet?.currency?.symbol || ""}
          icon
          onClick={() => {
            setIsSelectAmountModalOpen(true);
          }}
        />
        <DepositCard
          account="Payment Method"
          amount={selectedPaymentMethod?.name}
          icon
          onClick={() => {
            setIsPaymentMethodModalOpen(true);
          }}
        />

        
          <Checkbox>
            <span className="checkboxSpan">
              Save card
            </span>
          </Checkbox>

          <span className="agreementSpan">
            By checking Save card, you agree to the <a>1-Click Service Terms</a> and <a>Card Credentials Storage Agreement</a>
          </span>
       

        <div className="buttonsContainer">
          <PrimaryButton
            disabled={!amount}
            onClick={() => {
              paymentCheckoutHandler();
            }}
            className={`${amount && "active"} payment-card-next-button`}
            Title="Next"
          />
          <SecondaryButton
            Title="Promo Code"
            className="PromoCode"
            icon={<PromoCodeIcon />}
            onClick={() => {
              setIsPromoModalOpen(true);
            }}
          />
        </div>

        <div className="buttonsContainer">
          
          <div className="footerSpan">
            <div className="imagecontainer">
              <img src='/lock.svg' style={{ width: '40px', height: '40px', padding: '5px', color: '#2dd674'}} />
            </div>
            <p>
              Your data is encrypted using 256-bit SSL certificates, 
              providing you with the strongest security available
            </p>

          </div>
        </div>
      </div>
    </Modal>
  );
};

export default Deposit;
