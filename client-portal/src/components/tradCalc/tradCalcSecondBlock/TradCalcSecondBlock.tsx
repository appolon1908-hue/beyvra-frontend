import "./TradCalcSecondBlock.scss";
import ArrowDownSvg from "../../../assets/markets/arrowDown.svg";
import { FC } from "react";
import { DataContentType } from "../types";

interface TradCalcSecondBlockProps {
  selectedData: DataContentType;
  isColumn?: boolean;
}

const TradCalcSecondBlock: FC<TradCalcSecondBlockProps> = ({
  selectedData,
  isColumn,
}) => {
  return (
    <div className="tradCalcSecondContainer">
      <div className="tradCalcEUR">
        EUR
        <img className="tradCalcArrDown" src={ArrowDownSvg} alt="" />
      </div>
      <div className={`${isColumn ? "tradCalcEuro tradCalcEuroColumn" : "tradCalcEuro"}`}>
        {selectedData.secondBlock.map((item, index) => (
          <div key={index + item.title}>
            <span>{item.title}</span>
            {item.img ? <img src={item.img} alt="" /> : <p>-</p>}
          </div>
        ))}
      </div>
      <button>Start Trading</button>
      <span>
        *Past performance is not a reliable indicator of future results.
      </span>
    </div>
  );
};

export default TradCalcSecondBlock;
