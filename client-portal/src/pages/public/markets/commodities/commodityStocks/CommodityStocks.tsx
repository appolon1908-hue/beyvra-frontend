import { useTranslation } from "react-i18next";
import "./CommodityStocks.scss";
import MainImg from "../../../../../assets/markets/commodities/commodityStocksMain.png";
import { useNavigate } from "react-router-dom";

const CommodityStocks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="commodityStocksContainer">
      <div>
        <h2>{t("commodityCFDStocksETFs")}</h2>
        <span>{t("subCommodityCFDStocksETFs")}</span>
        <button type="button" onClick={() => navigate('/signIn')}>{t("tradeNow")}</button>
      </div>
      <img src={MainImg} alt="" />
    </div>
  );
};

export default CommodityStocks;
