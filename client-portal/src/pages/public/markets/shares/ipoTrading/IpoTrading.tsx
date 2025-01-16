import { useTranslation } from "react-i18next";
import "./IpoTrading.scss";

//img
import BmwSvg from "../../../../../assets/markets/shared/ipoTrading/bmw.svg"
import AlibabaSvg from "../../../../../assets/markets/shared/ipoTrading/alibaba.svg"
import DuSvg from "../../../../../assets/markets/shared/ipoTrading/du.svg"

const IpoTrading = () => {
  const { t } = useTranslation();
  return (
    <div className="ipoTradingContainer">
      <div>
        <img src={BmwSvg} alt="" />
        <img src={DuSvg} alt="" />
        <img src={AlibabaSvg} alt="" />
      </div>
      <div>
        <h2>{t("IPOTrading")}</h2>
        <span>{t("subIPOTrading")}</span>
      </div>
    </div>
  );
};

export default IpoTrading;
