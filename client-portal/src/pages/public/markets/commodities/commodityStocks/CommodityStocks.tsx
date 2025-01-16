import { useTranslation } from "react-i18next";
import "./CommodityStocks.scss";
import MainImg from "../../../../../assets/markets/commodities/commodityStocksMain.png";

const CommodityStocks = () => {
  const { t } = useTranslation();
  return (
    <div className="commodityStocksContainer">
      <div>
        <h2>{t("commodityCFDStocksETFs")}</h2>
        <span>{t("subCommodityCFDStocksETFs")}</span>
        <button>{t("tradeNow")}</button>
      </div>
      <img src={MainImg} alt="" />
    </div>
  );
};

export default CommodityStocks;
