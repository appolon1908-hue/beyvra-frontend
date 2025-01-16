import { FC } from "react";
import "./TradCalcItemAction.scss";

interface TradCalcItemActionProps {
        handleAction: () => void,
        isBuy: boolean
}

const TradCalcItemAction: FC<TradCalcItemActionProps> = ({ handleAction, isBuy }) => {
  return (
    <div className="tradCalcItemAction">
      <label>Action</label>
      <div>
        <span
          onClick={handleAction}
          className={`${!isBuy ? "tradCalcActionActive" : "tradCalcNotActive"}`}
        >
          Sell
        </span>
        <span
          onClick={handleAction}
          className={`${isBuy ? "tradCalcActionActive" : "tradCalcNotActive"}`}
        >
          Buy
        </span>
      </div>
    </div>
  );
};

export default TradCalcItemAction;
