import MarketSubMenuCard from "../../../../../components/marketSubMenuCard/MarketSubMenuCard";
import MarketSubMenuSlider from "../../../../../components/marketSubMenuSlider/MarketSubMenuSlider";
import { AdvisersMarketSubMenuList } from "./constants";
import "./marketSubMenu.scss";

const AdvisersMarketSubMenu = () => {
  return (
    <div className="marketSubMenu">
      <MarketSubMenuSlider
        title="Advisers"
        desc="Indicator-based signals that help identify entry points"
        img="/market-menu-images/Ideas.svg"
        bgImg=""
        bgCol="sky"
      />
      {AdvisersMarketSubMenuList.map((item) => (
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

export default AdvisersMarketSubMenu;
