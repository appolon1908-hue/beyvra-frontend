import "./TradCalcItemQuantity.scss";
import MinusSvg from "../../../assets/markets/minus.svg";
import PlusSvg from "../../../assets/markets/plusRound.svg";
import { FC } from "react";

interface TradCalcItemQuantityProps {
  quantity: number;
  handleQuantity: (isMinus: boolean) => void;
}

const TradCalcItemQuantity: FC<TradCalcItemQuantityProps> = ({
  quantity,
  handleQuantity,
}) => {
  return (
    <div className="tradCalcItemQuantity">
      <label>Quantity</label>
      <span>{quantity}</span>
      <img
        className="tradCalcMinus"
        src={MinusSvg}
        alt=""
        onClick={() => handleQuantity(true)}
      />
      <img
        className="tradCalcPlus"
        src={PlusSvg}
        alt=""
        onClick={() => handleQuantity(false)}
      />
    </div>
  );
};

export default TradCalcItemQuantity;
