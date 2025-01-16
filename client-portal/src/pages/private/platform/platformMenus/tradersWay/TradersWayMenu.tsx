import { useState } from "react";
import {
  AdvancePlusIcon2,
  IndicatorIcon2,
  PercentageIcon2,
  PlayIcon,
  SignalsIcon,
  StrategyIcon2,
  TradeStopIcon2,
} from "../../../../../assets/icons";
import MenuListCard from "../../../../../components/menuListCard/MenuListCard";
import Modal from "../../../../../components/modal/Modal";
import "./tradersWay.scss";

interface TradersWayMenuProps {}

type TraderOption = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  active?: boolean;
  description?: string;
};

const TradersWayMenu: React.FunctionComponent<TradersWayMenuProps> = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<TraderOption | null>(null);

  const CardSuffix = ({
    icon,
    text,
  }: {
    icon: React.ReactNode;
    text: string;
  }) => (
    <div className="optionSuffix">
      {icon}
      <p>{text}</p>
    </div>
  );

  const NumberIcon = ({ value }: { value: string }) => (
    <div className="tradesWayOption">
      <p className="optionText">{value}</p>
    </div>
  );

  const traderOptions: TraderOption[] = [
    {
      title: "Barcode",
      value: "1",
      subtitle: "Trading Strategy",
      icon: <StrategyIcon2 />,
      active: true,
      description:
        "This strategy is based on the DeMarker oscillator and works best on volatile currency pairs.",
    },
    {
      title: "Kind Martin",
      value: "2",
      subtitle: "Trading Strategy",
      icon: <StrategyIcon2 />,
      active: true,
      description:
        "The combination of the Parabolic SAR indicator and MACD oscillator in this strategy helps you determine the best time to open a trade.",
    },
    {
      title: "StochRSI",
      value: "3",
      subtitle: "Indicator",
      icon: <IndicatorIcon2 />,
      active: true,
      description:
        "The combination of the Parabolic SAR indicator and MACD oscillator in this strategy helps you determine the best time to open a trade.",
    },
    {
      title: "Friday",
      value: "4",
      subtitle: "Trading Strategy",
      icon: <StrategyIcon2 />,
      active: true,
      description:
        "Based on the EMA indicator, this strategy can help you detect short-term volatility.",
    },
    {
      title: "Advanced for 24 hours",
      value: "5",
      subtitle: "Bonus",
      icon: <AdvancePlusIcon2 />,
      active: true,
      description:
        "Access to all the benefits of Advanced status for 24 hours: Up to 89% profitability, unique strategies, and other privileges.",
    },
    {
      title: "Advanced for half price",
      value: "6",
      subtitle: "Bonus",
      icon: <AdvancePlusIcon2 />,
      active: true,
      description:
        "50% discount on Advanced status with all of the privileges of the status. Get up to 89% profitability on successful trades now for only $250 instead of $500.",
    },
    {
      title: "Millenium",
      value: "7",
      subtitle: "Trading Strategy",
      icon: <StrategyIcon2 />,
      active: true,
      description:
        "Millennium features the Detrended Price Oscillator and Heikin Ashi candlesticks. This is one of our most popular strategies, with over 39,000 traders using it.",
    },
    {
      title: "Trailing Stop Loss",
      value: "8",
      subtitle: "Improved Forex",
      icon: <TradeStopIcon2 />,
      active: true,
      description:
        "A tool that automatically adjusts the Stop Loss along with the price. It is enabled next to the Stop Loss setting.",
    },
    {
      title: "Risk Free Trades",
      value: "9",
      subtitle: "Bonus",
      icon: <AdvancePlusIcon2 />,
      active: true,
      description:
        "With risk-free trades enabled, you don't have to worry if your forecast was right or wrong — you won't lose any money and only stand to profit.",
    },
    {
      title: "Up to 89% profitability",
      value: "10",
      subtitle: "Trading Terms",
      icon: <PercentageIcon2 />,
      active: true,
      description:
        "This award gives you up to 89% profitability on successful trades.",
    },
    {
      title: "New Status: Advanced",
      value: "11",
      subtitle: "Bonus",
      icon: <AdvancePlusIcon2 />,
      active: true,
      description:
        "If you earn this award, you will get improved trading conditions: Up to 89% profitability, faster withdrawals, and much more.",
    },
  ];

  return (
    <div className="tradersWay">
      <p className="menuText">
        Each status gives you different paths along the Trader's Way. Each path
        consists of several levels you can reach by trading and gaining XP. Each
        level gives you a unique reward. Once you've unlocked all of the levels
        and reached the end, you'll be upgraded to the next status. Your
        progress on the Trader's Way resets every 30 days.
      </p>

      <MenuListCard
        className="tradersWayCard"
        variant={3}
        title="From Starter to Advanced"
        subtitle="Trading Guide"
        icon={<PlayIcon />}
      />

      <div className="timeContainer">
        <p className="timeCountdown">22:02:21:27</p>
        <div className="timeLeftContainer">
          <p className="timeLeftText">
            Time Left until the Current Trader`s Way Stage Ends
          </p>
          <SignalsIcon /> <span>Beginer</span>
        </div>
      </div>

      <div className="levelBar">
        <p>LEVEL 1</p>
        <p className="levelText">0/50 XP</p>
      </div>

      <div className="traderOptions">
        {traderOptions?.map((item) => (
          <MenuListCard
            disabled={!item?.active}
            textCenter
            title={item.title}
            icon={<NumberIcon value={item.value} />}
            suffix={<CardSuffix text={item.subtitle} icon={item.icon} />}
            onClick={() => {
              if (item.active) {
                setModalOpen(true);
                setSelectedItem(item);
              }
            }}
          />
        ))}
      </div>

      <Modal
        open={isModalOpen}
        setOpen={setModalOpen}
        rootClassName="tradersWayModal"
      >
        <div className="modalBadge">{selectedItem?.subtitle}</div>
        <div className="modalIcon">{selectedItem?.icon}</div>
        <p className="modalHeading">{selectedItem?.title}</p>
        <p className="modalText">{selectedItem?.description}</p>
        <button className="modalButton">Use</button>
      </Modal>
    </div>
  );
};

export default TradersWayMenu;
