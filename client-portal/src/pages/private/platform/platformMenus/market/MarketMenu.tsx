import "./marketMenu.scss";
import { ArrowRightOS } from "../../../../../assets/icons";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";
import CarouselSlider from "../../../../../components/carouselSlider/CarouselSlider";
import { Col, Row } from "antd";
import MarketSubMenuSlider from "../../../../../components/marketSubMenuSlider/MarketSubMenuSlider";
import { Dispatch, SetStateAction } from "react";
import { LeftSubDrawer } from "../../types";
import { useAppSelector } from "@store/hooks";

interface MarketMenuProps {
  setLeftSubDrawer: Dispatch<SetStateAction<LeftSubDrawer>>;
  setIsLeftSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

type MarketMenuType = {
  id: number;
  title: string;
  desc: string;
  img: string;
  path: LeftSubDrawer;
};

const MarketLink = ({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) => {

  


  // const navigate = useNavigate();
  return (
    <MainItemCard onClick={onClick} className="menufirstCard" variant={2}>
      <p className="menufirstCardText">{text}</p>
      <ArrowRightOS width="22" height="22" />
    </MainItemCard>
  );
};

const MarketMenuList: MarketMenuType[] = [
  {
    id: 1,
    title: "Trading Conditions",
    desc: "Features that provide more benefitial trading conditions",
    img: "/market-menu-images/TradingCondition.svg",
    path: "trading-conditions-market-submenu",
  },
  {
    id: 2,
    title: "Signals",
    desc: "Algorithm-based recommendations on when to open trades",
    img: "/market-menu-images/Signals.svg",
    path: "signals-market-submenu",
  },
  {
    id: 3,
    title: "Custom Strategies",
    desc: "Buy trader-created strategies best suited to your trading style",
    img: "/market-menu-images/CustomStrategies.svg",
    path: "custom-strategies-market-submenu",
  },
  {
    id: 4,
    title: "Strategies",
    desc: "Ready-to-use sets of tools that make it easier to spot entry and exit points",
    img: "/market-menu-images/ChessKing.svg",
    path: "strategies-market-submenu",
  },
  {
    id: 5,
    title: "Indicators",
    desc: "Ready-to-use sets of tools that make it easier to spot entry and exit points",
    img: "/market-menu-images/PlusPurple.svg",
    path: "indicators-market-submenu",
  },
  {
    id: 6,
    title: "Themes",
    desc: "Different color themes for customizing the appearance of the interface",
    img: "/market-menu-images/Themes.svg",
    path: "themes-market-submenu",
  },
  {
    id: 7,
    title: "Advisers",
    desc: "Indicator-based signals that help identify entry points",
    img: "/market-menu-images/Ideas.svg",
    path: "advisers-market-submenu",
  },
];

const MarketMenu: React.FunctionComponent<MarketMenuProps> = ({
  setLeftSubDrawer,
  setIsLeftSubDrawerOpen,
}) => {
  const {themeSelect} = useAppSelector(state => state.themeBg)

  return (
    <div className={`${themeSelect} market-menu`}>
      <MarketLink
        onClick={() => {
          setLeftSubDrawer("barcode");
          setIsLeftSubDrawerOpen(true);
        }}
        text="My Purchases & Rewards"
      />
      <MarketLink
        onClick={() => {
          setLeftSubDrawer("published-strategies");
          setIsLeftSubDrawerOpen(true);
        }}
        text="My Published Strategies"
      />
      <CarouselSlider>
        <MarketSubMenuSlider
          onClick={() => {
            setLeftSubDrawer("astro-market-submenu");
            setIsLeftSubDrawerOpen(true);
          }}
          title="Astro"
          desc="Astrology-based tools to help align your trades with the stars"
          img="/market-menu-images/Astro.png"
          bgImg="/market-menu-images/astro.svg"
          bgCol="purple"
        />
        <MarketSubMenuSlider
          onClick={() => {
            setLeftSubDrawer("forex-market-sub");
            setIsLeftSubDrawerOpen(true);
          }}
          title="Forex"
          desc="Strategies, signals, and themes designed for trading on crypto
              assets"
          img="/market-menu-images/Forex.png"
          bgImg="/market-menu-images/forex.svg"
          bgCol="red"
        />
        <MarketSubMenuSlider
          onClick={() => {
            setLeftSubDrawer("crypto-market-submenu");
            setIsLeftSubDrawerOpen(true);
          }}
          title="Crypto"
          desc="Strategies, signals, and themes designed for trading on crypto
              assets"
          img="/market-menu-images/Crypto.png"
          bgImg="/market-menu-images/crypto.svg"
          bgCol="green"
        />
      </CarouselSlider>
      {MarketMenuList.map((item) => (
        <div
          onClick={() => {
            setLeftSubDrawer(item?.path);
            setIsLeftSubDrawerOpen(true);
          }}
          key={item.id}
          className="menuthirdCardCon"
        >
          <MainItemCard className="menuthirdCard">
            <Row className="menuThirdCardRow">
              <Col span={15}>
                <p className="menuthirdCardText1">{item.title}</p>
                <p className="menuthirdCardText2">{item.desc}</p>
              </Col>
              <Col span={3}></Col>
              <Col span={6} className="svgs">
                <img src={item.img} alt="" />
              </Col>
            </Row>
          </MainItemCard>
        </div>
      ))}
    </div>
  );
};

export default MarketMenu;
