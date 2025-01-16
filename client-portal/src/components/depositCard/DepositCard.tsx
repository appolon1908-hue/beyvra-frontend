import { useAppDispatch } from "@store/hooks";
import { ArrowRightOS } from "../../assets/icons";
import "./DepositCard.scss";
import { setPaymentAmount } from "@store/slices/payment";
import { ChangeEvent } from "react";
import { Modal } from "antd";
interface ContentProps {
  account: string;
  amount?: number | string;
  currency?: string;
  icon?: boolean;
  cardIcon?: React.ReactNode;
  CountryIcon?: React.ReactNode;
  onClick?: any;
  disabled?: boolean;
  input?: boolean;
}

const DepositCard: React.FC<ContentProps> = ({
  account,
  amount,
  icon,
  currency,
  cardIcon,
  CountryIcon,
  onClick,
  disabled,
  input,
}) => {
  const dispatch = useAppDispatch();

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    return dispatch(setPaymentAmount(+e.target.value));
  };

  return (
    <div
      className={`depositCard ${disabled ? "disable" : ""} ${
        input !== true ? "" : "cursor"
      }`}
    >
      <div className="cardContent" onClick={input !== true && onClick}>
        <div>{CountryIcon}</div>
        <div className="cardLeft">
          <div className="cardTop">
            <div className="cardSubtext">{account}</div>
          </div>
          <div className="cardBottom">
            {input ? (
              <input
                className="cardInput"
                placeholder={"Enter deposit amount"}
                value={amount}
                type="number"
                onChange={onChangeHandler}
              />
            ) : (
              <div className="cardTitle">
                {currency} {amount ?? 0}
              </div>
            )}
          </div>
        </div>
        <div className="cardRight">
          {cardIcon}
          {icon && <ArrowRightOS width="36" height="36" />}
        </div>
      </div>
    </div>
  );
};

export default DepositCard;
