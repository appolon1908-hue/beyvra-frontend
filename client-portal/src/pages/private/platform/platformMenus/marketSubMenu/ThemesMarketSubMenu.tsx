import MarketSubMenuCard from "../../../../../components/marketSubMenuCard/MarketSubMenuCard";
import MarketSubMenuSlider from "../../../../../components/marketSubMenuSlider/MarketSubMenuSlider";
import { ThemesMarketSubMenuList } from "./constants";
import "./marketSubMenu.scss";

const ThemesMarketSubMenu = () => {
  return (
    <div className="marketSubMenu">
      <MarketSubMenuSlider
        title="Themes"
        desc="Different color themes for customizing the appearance of the interface"
        img="/market-menu-images/Themes.svg"
        bgImg=""
        bgCol="green2"
      />
      {ThemesMarketSubMenuList.map((item) => (
        <MarketSubMenuCard
          key={item.id}
          img={item.img}
          title={item.title}
          rating={item.rating}
          price={item.price}
          total={item.total}
          month={item.month}
        />
      ))}
    </div>
  );
};

export default ThemesMarketSubMenu;
