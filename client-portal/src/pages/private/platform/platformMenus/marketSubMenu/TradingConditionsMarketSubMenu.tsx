import MarketSubMenuCard from "../../../../../components/marketSubMenuCard/MarketSubMenuCard";
import MarketSubMenuSlider from "../../../../../components/marketSubMenuSlider/MarketSubMenuSlider";
import { TradingConditionsMarketSubMenuList } from "./constants";
import "./marketSubMenu.scss";

const TradingConditionsMarketSubMenu = () => {
  return (
    <div className="marketSubMenu">
      <MarketSubMenuSlider
        title="Trading Conditions"
        desc="Features that provide more beneficial trading conditions"
        img="/market-menu-images/TradingCondition.svg"
        bgImg=""
        bgCol="sky"
      />
      {TradingConditionsMarketSubMenuList.map((item) => (
        <MarketSubMenuCard
          key={item.id}
          img={item.img}
          title={item.title}
          rating={item.rating}
          price={item.price}
          total={item.total}
        />
      ))}
    </div>
  );
};

export default TradingConditionsMarketSubMenu;
