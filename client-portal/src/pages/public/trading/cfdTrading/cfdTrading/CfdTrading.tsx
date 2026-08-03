import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./CfdTrading.scss";
import MainImg from "./main.png";

const CfdTradingBlock = () => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  return (
    <div className="cfdTradingContainer">
      <div>
        <h2>{t("CFDTrade")}</h2>
        <span>
          {t("CFDTradeTxt")}
        </span>
        <button type="button" onClick={() => navigate('/signIn')}>{t("startTrade")}</button>
      </div>
      <img src={MainImg} alt="" />
    </div>
  );
};

export default CfdTradingBlock;
