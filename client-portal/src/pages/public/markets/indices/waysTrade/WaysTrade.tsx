import { useTranslation } from "react-i18next";
import "./WaysTrade.scss";

//img
import MainSvg from "../../../../../assets/markets/indices/waysTrade.png";

const WaysTrade = () => {
  const { t } = useTranslation();
  return (
    <div className="waysTradeContainer">
      <div>
        <h2>{t("waysTradeIndices")}</h2>
        <span>{t("subWaysTradeIndices")}</span>
      </div>

      <img src={MainSvg} alt="" />
    </div>
  );
};

export default WaysTrade;
