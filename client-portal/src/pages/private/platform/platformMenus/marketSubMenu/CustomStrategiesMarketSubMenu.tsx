import MarketSubMenuCard from "../../../../../components/marketSubMenuCard/MarketSubMenuCard";
import MarketSubMenuSlider from "../../../../../components/marketSubMenuSlider/MarketSubMenuSlider";
import { CustomStrategiesMarketSubMenuList } from "./constants";
import "./marketSubMenu.scss";

const CustomStrategiesMarketSubMenu = () => {
  return (
    <div className="marketSubMenu">
      <MarketSubMenuSlider
        title="Custom Strategies"
        desc="Buy trader-created strategies best suited to your trading style"
        img="/market-menu-images/CustomStrategies.svg"
        bgImg=""
        bgCol="green2"
      />
      {CustomStrategiesMarketSubMenuList.map((item) => (
        <MarketSubMenuCard
          key={item.id}
          img={item.img}
          title={item.title}
          rating={item.rating}
          total={item.total}
          price={item.price}
          white={item.white}
        />
      ))}
    </div>
  );
};

export default CustomStrategiesMarketSubMenu;
