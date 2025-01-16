import MarketSubMenuCard from "../../../../../components/marketSubMenuCard/MarketSubMenuCard";
import MarketSubMenuSlider from "../../../../../components/marketSubMenuSlider/MarketSubMenuSlider";
import { ForexMarketSubMenuList } from "./constants";
import "./marketSubMenu.scss";

const ForexMarketSubMenu = () => {
  return (
    <div className="marketSubMenu">
      <MarketSubMenuSlider
        title="Forex"
        desc="Strategies, signals, and themes designed for trading on crypto
              assets"
        img="/market-menu-images/Forex.png"
        bgImg="/market-menu-images/forex.svg"
        bgCol="red"
      />
      {ForexMarketSubMenuList.map((item) => (
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

export default ForexMarketSubMenu;
