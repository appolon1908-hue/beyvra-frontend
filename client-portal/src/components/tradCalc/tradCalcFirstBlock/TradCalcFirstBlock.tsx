import { FC, useState } from "react";
import "./TradCalcFirstBlock.scss";
import TradCalcItemAction from "../tradCalcItemAction/TradCalcItemAction";
import TradCalcItemQuantity from "../tradCalcItemQuantity/TradCalcItemQuantity";
import ArrowDownSvg from "../../../assets/markets/arrowDown.svg";
import { DataContentType } from "../types";

interface TradCalcFirstBlockProps {
  selectedData: DataContentType;
  isTitle: boolean;
}

const TradCalcFirstBlock: FC<TradCalcFirstBlockProps> = ({
  selectedData,
  isTitle,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [isBuy, setBuy] = useState<boolean>(false);

  const handleQuantity = (isMinus: boolean) => {
    if (isMinus) {
      quantity > 0 ? setQuantity((prev) => prev - 1) : setQuantity(0);
    } else {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAction = () => {
    setBuy(!isBuy);
  };

  return (
    <div className="tradCalcFirstContainer">
      {isTitle && (
        <div>
          <h3>{selectedData.header.title}</h3>
          <span>{selectedData.header.text}</span>
        </div>
      )}

      <div className="tradCalcItemsLine">
        <TradCalcItemAction handleAction={handleAction} isBuy={isBuy} />
        <TradCalcItemQuantity
          handleQuantity={handleQuantity}
          quantity={quantity}
        />
      </div>

      <div className="tradCalcItemsLine">
        {selectedData.firstBlock.map(
          (item, index) =>
            item.isList && (
              <div key={index + item.title} className="tradCalcIsList">
                <label>{item.title}</label>
                <button>{item.value ? item.value : ""}</button>
                <img src={ArrowDownSvg} alt="" />
              </div>
            )
        )}
      </div>

      <div className="tradCalcItemsLine">
        {selectedData.firstBlock.map(
          (item, index) =>
            item.isPrice && (
              <div key={index + item.title} className="tradCalcIsInput">
                <label>{item.title}</label>
                <input />
              </div>
            )
        )}
      </div>

      <div className="tradCalcItemsLine">
        {selectedData.firstBlock.map(
          (item, index) =>
            item.isDate && (
              <div key={index + item.title} className="tradCalcIsInput">
                <label>{item.title}</label>
                <input />
              </div>
            )
        )}
      </div>

      <button className="tradCalcButtonSubmit">Calculate</button>
    </div>
  );
};

export default TradCalcFirstBlock;
