import { useTranslation } from "react-i18next";

interface StocksProps {
  className: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const Stocks: React.FC<StocksProps> = ({ className, setStep }) => {
  const { t } = useTranslation();

  const stockListOne = [
    { name: "Caterpillar", img: "/walkthrough/stocks/stock-cat.png" },
    { name: "GBP/CAD", img: "/walkthrough/stocks/sock-uk-can.png" },
    { name: "Copper", img: "/walkthrough/stocks/stock-bronze.png" },
    { name: "AUD/CHF", img: "/walkthrough/stocks/stock-au-sw.png" },
    { name: "Nike", img: "/walkthrough/stocks/stock-nike.png" },
    { name: "BMW", img: "/walkthrough/stocks/stock-bmw.png" },
  ];

  const stockListTwo = [
    { name: "Tesla", img: "/walkthrough/stocks/stock-tesla.png" },
    { name: "Gold", img: "/walkthrough/stocks/stock-gold.png" },
    { name: "EUR/USD", img: "/walkthrough/stocks/stock-eu-us.png" },
    { name: "Apple", img: "/walkthrough/stocks/stock-apple.png" },
    { name: "Mc Donald’s", img: "/walkthrough/stocks/stock-mac.png" },
    { name: "Brent", img: "/walkthrough/stocks/stock-drop.png" },
  ];

  return (
    <div className={`walkthroughStep stockStep ${className}`}>
      <div className="stocksContainer">
        <div className="stockItemList">
          {stockListOne.map((item, index) => (
            <div className="stockItem" key={item.name + index}>
              <img src={item.img} alt={item.name} />
              <p>{item.name}</p>
            </div>
          ))}
        </div>

        <div className="stockItemList">
          {stockListTwo.map((item, index) => (
            <div className="stockItem" key={item.name + index}>
              <img src={item.img} alt={item.name} />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="walkthroughSubtext">{t("walkthroughStocksSubText")}</p>

      <button className="walkthroughButton" onClick={() => setStep(3)}>
        {t("next")}
      </button>
    </div>
  );
};

export default Stocks;
