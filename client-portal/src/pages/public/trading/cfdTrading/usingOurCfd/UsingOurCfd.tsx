import "./UsingOurCfd.scss";
import usingOurCfd1Svg from "../../../../../assets/markets/tradingPage/usingOurCfd1.svg";
import usingOurCfd2Svg from "../../../../../assets/markets/tradingPage/usingOurCfd2.svg";
import usingOurCfd3Svg from "../../../../../assets/markets/tradingPage/usingOurCfd3.svg";
import usingOurCfd4Svg from "../../../../../assets/markets/tradingPage/usingOurCfd4.svg";
import usingOurCfd5Svg from "../../../../../assets/markets/tradingPage/usingOurCfd5.svg";
import arrowRightSvg from "../../../../../assets/markets/tradingPage/arrowRightRed.svg";
import MainImg from "../../../../../assets/markets/tradingPage/usingOurCfd.png";
import useTransactions from "api/wallet/useTransactions";
import { useTranslation } from "react-i18next";



const UsingOurCfd = () => {
  const {t} = useTranslation()
  const data = [
    {
      text:  t("usingOurCFD1"),
      icon: usingOurCfd1Svg,
    },
    {
      text:  t("usingOurCFD2"),
      icon: usingOurCfd2Svg,
    },
    {
      text:  t("usingOurCFD3"),
      icon: usingOurCfd3Svg,
    },
    {
      text: t("usingOurCFD4"),
      icon: usingOurCfd4Svg,
    },
    {
      text: t("usingOurCFD5"),
      icon: usingOurCfd5Svg,
    },
  ];
  return (
    <div className={`usingOurCfdContainer`}>
      <div>
        <h2>{t("usingOurCFD")}</h2>
        {data.map((item, index) => (
          <p key={index}>
            <span>
              <img src={item.icon} alt="" />
              {item.text}
            </span>

            <img src={arrowRightSvg} alt="" />
          </p>
        ))}
      </div>
      <div>
        <img src={MainImg} alt="" />
      </div>
    </div>
  );
};

export default UsingOurCfd;
