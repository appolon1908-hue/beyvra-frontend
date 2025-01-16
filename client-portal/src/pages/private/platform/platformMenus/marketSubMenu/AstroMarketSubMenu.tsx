import MarketSubMenuCard from "../../../../../components/marketSubMenuCard/MarketSubMenuCard";
import MarketSubMenuSlider from "../../../../../components/marketSubMenuSlider/MarketSubMenuSlider";
import { AstroMarketSubMenuList } from "./constants";
import "./marketSubMenu.scss";

const AstroMarketSubMenu = () => {
  return (
    <div className="marketSubMenu">
      <MarketSubMenuSlider
        title="Astro"
        desc="Astrology-based tools to help align your trades with the stars"
        img="/market-menu-images/Astro.png"
        bgImg="/market-menu-images/astro.svg"
        bgCol="purple"
      />
      {AstroMarketSubMenuList.map((item) => (
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

export default AstroMarketSubMenu;
