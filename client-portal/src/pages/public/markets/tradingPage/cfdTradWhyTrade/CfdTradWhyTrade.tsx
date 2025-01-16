import "./cfdTradWhyTrade.scss";
import whyTrade1Svg from "../../../../../assets/markets/tradingPage/whyTrade1.svg";
import whyTrade2Svg from "../../../../../assets/markets/tradingPage/whyTrade2.svg";
import whyTrade3Svg from "../../../../../assets/markets/tradingPage/whyTrade3.svg";
import whyTrade4Svg from "../../../../../assets/markets/tradingPage/whyTrade4.svg";
import MainImg from "../../../../../assets/markets/tradingPage/cfdTradingWhyTrade1.png";

const data = [
  {
    text: "Low spreads and competitive margin rates",
    icon: whyTrade1Svg,
  },
  {
    text: "You’re in control, trading on your terms",
    icon: whyTrade2Svg,
  },
  {
    text: "World-Class trading tools are right in your hands",
    icon: whyTrade3Svg,
  },
  {
    text: "Interactive education for all types of traders",
    icon: whyTrade4Svg,
  },
];

const CfdTradWhyTrade = () => {
  return (
    <div className={`cfdTradWhyTradeContainer`}>
      <div>
        <img src={MainImg} alt="" />
      </div>
      <div>
        <h2>Why Trade CFDs with us</h2>
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
