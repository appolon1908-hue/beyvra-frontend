import "./TradCalc.scss";

import { FC } from "react";
import { dataContent } from "./data";
import { DataContentKeys, DataContentType } from "./types";
import { HeaderTradCalc } from "./header/HeaderTradCalc";
import TradCalcFirstBlock from "./tradCalcFirstBlock/TradCalcFirstBlock";
import TradCalcSecondBlock from "./tradCalcSecondBlock/TradCalcSecondBlock";

interface TradCalcProps {
  titleHeader?: DataContentKeys;
  withRoute?: boolean;
}

const TradCalc: FC<TradCalcProps> = ({
  titleHeader = "CFD Trading Calculator",
  withRoute
}) => {
  const getDataByTitle = (titleHeader: DataContentKeys): DataContentType => {
    return dataContent[titleHeader];
  };

  const selectedData = getDataByTitle(titleHeader);

  return (
    <div className="tradCalcContainer">
      <HeaderTradCalc withRoute={withRoute} titleHeader={titleHeader} />
      {titleHeader === "CFD Trading Calculator" ? (
        <div className={`tradCalcMainBlock ${titleHeader ? "mt-80" : "mt-0"}`}>
          <TradCalcFirstBlock isTitle={true} selectedData={selectedData} />
          <TradCalcSecondBlock selectedData={selectedData} />
        </div>
      ) : (
        <div className={`tradCalcWrapperBlock`}>
          <div>
            <h3>{selectedData.header.title}</h3>
            <span>{selectedData.header.text}</span>
          </div>
          <div className="tradCalcMainTwoBlock">
            <TradCalcFirstBlock isTitle={false} selectedData={selectedData} />
            <TradCalcSecondBlock isColumn={titleHeader === "Forex Margin Calculator" ? true : false} selectedData={selectedData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TradCalc;
