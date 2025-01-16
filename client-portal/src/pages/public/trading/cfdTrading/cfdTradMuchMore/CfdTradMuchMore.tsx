import "./CfdTradMuchMore.scss";
import checkSvg from "../../../../../assets/markets/redCheckbox.svg";
import MainImg from "../../../../../assets/markets/tradingPage/cfdTradingWhyTrade2.png";
import { useTranslation } from "react-i18next";


const CfdTradMuchMore = () => {
  const {t} = useTranslation()

  const data = [
    t("cfdMoreList1"),
    t("cfdMoreList2"),
    t("cfdMoreList3"),
    t("cfdMoreList4"),
    
  
  ];

  return (
    <div className={`cfdTradMuchMoreContainer`}>
      <div>
        <h2>{t("cfdMore")}</h2>
        {data.map((item, index) => (
          <span key={index}>
            <img src={checkSvg} alt="" /> {item}
          </span>
        ))}
        <p>{t("CFDMoreExtra")}</p>
      </div>

      <div>
        <img src={MainImg} alt="" />
      </div>
    </div>
  );
};

export default CfdTradMuchMore;
