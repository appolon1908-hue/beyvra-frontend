import { useTranslation } from "react-i18next";
import "./CfdTrading.scss";
import MainImg from "./main.png";

const CfdTradingBlock = () => {
  const {t} = useTranslation()
  return (
    <div className="cfdTradingContainer">
      <div>
        <h2>{t("CFDTrade")}</h2>
        <span>
          {t("CFDTradeTxt")}
        </span>
        <button>{t("startTrade")}</button>
      </div>
      <img src={MainImg} alt="" />
    </div>
  );
};

export default CfdTradingBlock;
