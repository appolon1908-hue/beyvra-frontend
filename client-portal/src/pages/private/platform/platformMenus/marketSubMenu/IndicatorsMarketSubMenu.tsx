import MarketSubMenuCard from "../../../../../components/marketSubMenuCard/MarketSubMenuCard";
import MarketSubMenuSlider from "../../../../../components/marketSubMenuSlider/MarketSubMenuSlider";
import { IndicatorsMarketSubMenuList } from "./constants";
import "./marketSubMenu.scss";

const IndicatorsMarketSubMenu = () => {
  return (
    <div className="marketSubMenu">
      <MarketSubMenuSlider
        title="Indicators"
        desc="Algorithm-based recommendations on when to open trades"
        img="/market-menu-images/PlusPurple.svg"
        bgImg=""
        bgCol="purple3"
      />
      {IndicatorsMarketSubMenuList.map((item) => (
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

export default IndicatorsMarketSubMenu;
