import MarketSubMenuCard from "../../../../../components/marketSubMenuCard/MarketSubMenuCard";
import MarketSubMenuSlider from "../../../../../components/marketSubMenuSlider/MarketSubMenuSlider";
import { CryptoMarketSubMenuList } from "./constants";
import "./marketSubMenu.scss";

const CryptoMarketSubMenu = () => {
  return (
    <div className="marketSubMenu">
      <MarketSubMenuSlider
        title="Crypto"
        desc="Strategies, signals, and themes designed for trading on crypto assets"
        img="/market-menu-images/Crypto.png"
        bgImg="/market-menu-images/crypto.svg"
        bgCol="green"
      />
      {CryptoMarketSubMenuList.map((item) => (
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

export default CryptoMarketSubMenu;
