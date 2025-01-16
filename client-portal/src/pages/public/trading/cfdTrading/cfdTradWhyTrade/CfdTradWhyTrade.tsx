import "./CfdTradWhyTrade.scss";
import whyTrade1Svg from "../../../../../assets/markets/tradingPage/whyTrade1.svg";
import whyTrade2Svg from "../../../../../assets/markets/tradingPage/whyTrade2.svg";
import whyTrade3Svg from "../../../../../assets/markets/tradingPage/whyTrade3.svg";
import whyTrade4Svg from "../../../../../assets/markets/tradingPage/whyTrade4.svg";
import MainImg from "../../../../../assets/markets/tradingPage/cfdTradingWhyTrade1.png";
import { useTranslation } from "react-i18next";
// const {t} = useTranslation()

// const data = [
//   {
//     text: t("tradWithUsList1"),
//     icon: whyTrade1Svg,
//   },
//   {
//     text: t("tradWithUsList1"),
//     icon: whyTrade2Svg,
//   },
//   {
//     text: t("tradWithUsList1"),
//     icon: whyTrade3Svg,
//   },
//   {
//     text: t("tradWithUsList1"),
//     icon: whyTrade4Svg,
//   },
// ];

const CfdTradWhyTrade = () => {
  const {t} = useTranslation()

  const data = [
    {
      text: t("tradWithUsList1"),
      icon: whyTrade1Svg,
    },
    {
      text: t("tradWithUsList2"),
      icon: whyTrade2Svg,
    },
    {
      text: t("tradWithUsList3"),
      icon: whyTrade3Svg,
    },
    {
      text: t("tradWithUsList4"),
      icon: whyTrade4Svg,
    },
  ];

  return (
    <div className={`cfdTradWhyTradeContainer`}>
      <div>
        <img src={MainImg} alt="" />
      </div>
      <div>
        <h2>{t("whyTrdCFDWithUs")}</h2>
        {data.map((item, index) => (
          <span key={index}>
            <img src={item.icon} alt="" /> {item.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CfdTradWhyTrade;
