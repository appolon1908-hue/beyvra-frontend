import "./CfdTradMuchMore.scss";
import checkSvg from "../../../../../assets/markets/redCheckbox.svg";
import MainImg from "../../../../../assets/markets/tradingPage/cfdTradingWhyTrade2.png";

const data = [
  "Multi-asset trading platform with Informative, customisable charts and alerts",
  "Go long or short on thousands of financial instruments",
  "Saving the best for last — Lower Spreads, Speedy Execution",
  "Trade with leverage* to make your capital go further ",
];

const CfdTradMuchMore = () => {

  return (
    <div className={`cfdTradMuchMoreContainer`}>
      <div>
        <h2>And much more</h2>
        {data.map((item, index) => (
          <span key={index}>
            <img src={checkSvg} alt="" /> {item}
          </span>
        ))}
        <p>* Leverage magnifies both profits and losses</p>
      </div>

      <div>
        <img src={MainImg} alt="" />
      </div>
    </div>
  );
};

export default CfdTradMuchMore;
