import "./UsingOurCfd.scss";
import usingOurCfd1Svg from "../../../../../assets/markets/tradingPage/usingOurCfd1.svg";
import usingOurCfd2Svg from "../../../../../assets/markets/tradingPage/usingOurCfd2.svg";
import usingOurCfd3Svg from "../../../../../assets/markets/tradingPage/usingOurCfd3.svg";
import usingOurCfd4Svg from "../../../../../assets/markets/tradingPage/usingOurCfd4.svg";
import usingOurCfd5Svg from "../../../../../assets/markets/tradingPage/usingOurCfd5.svg";
import arrowRightSvg from "../../../../../assets/markets/tradingPage/arrowRightRed.svg";
import MainImg from "../../../../../assets/markets/tradingPage/usingOurCfd.png";

const data = [
  {
    text: "Undestand MT4&5 Trading Conditions",
    icon: usingOurCfd1Svg,
  },
  {
    text: "Trading hours by asset",
    icon: usingOurCfd2Svg,
  },
  {
    text: "Weekly Expiration of Futures",
    icon: usingOurCfd3Svg,
  },
  {
    text: "Know expiration dates of future rollovers",
    icon: usingOurCfd4Svg,
  },
  {
    text: "Discover Trading Holidays",
    icon: usingOurCfd5Svg,
  },
];

const UsingOurCfd = () => {
  return (
    <div className={`usingOurCfdContainer`}>
      <div>
        <h2>Using Our CFDs</h2>
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
