import { useAppSelector } from "@store/hooks";
import {
  ChartIcon,
  ProfileIcon,
  TradingIcon2,
} from "../../../../../assets/icons";
import Toggle from "../../../../../components/toggle/Toggle";
import "./tradingMenu.scss";

interface TradingMenuProps {}

const TradingMenu: React.FunctionComponent<TradingMenuProps> = () => {

  const {themeSelect} = useAppSelector(state => state.themeBg)
  return (
    <div className={`${themeSelect} tradingMenu`}>
      <div className="tradingMenuSection firstOrder">
        <p className="tradingSectionTitle">
          <ChartIcon /> Chart
        </p>
        <Toggle
          label="Strike prices"
          subtext="Show strike prices on the chart"
          defaultChecked
        />
        <Toggle
          label="Indicators"
          subtext="Show a list of indicators"
          defaultChecked
        />
        <Toggle
          label="Chart types"
          subtext="Show a switch between chart types"
          defaultChecked
        />
      </div>

      <div className="tradingMenuSection">
        <p className="tradingSectionTitle">
          <ProfileIcon /> Accounts
        </p>
        <Toggle
          label="Hidden balances"
          subtext="Hide your live account balances"
          defaultChecked
          infoText="Learn More"
          onClickInfo={() => {}}
        />
      </div>

      <div className="tradingMenuSection">
        <p className="tradingSectionTitle">
          <TradingIcon2 /> Trades
        </p>
        <Toggle
          label="1-click trade"
          subtext="Open trades without confirmation"
        />
        <Toggle
          label="1-click closing"
          subtext="Close trades without confirmation"
          defaultChecked
        />
        <Toggle
          label="Orders"
          subtext="Show the order editor on the trade panel"
          defaultChecked
        />
        <Toggle
          label="Trade Scaling"
          subtext="This function will multiply or divide the trade amount by 2 in FTT mode"
        />
        <Toggle
          label="Flat Market Protection"
          subtext="Get the trade amount back with no loss or gain if opening and closing quotes differ by 1 tick"
          defaultChecked
        />
      </div>
      <div className="tradingMenuSection">
        <p className="tradingSectionTitle">Forex</p>
        <Toggle
          label="Take profit and Stop Loss"
          subtext="Show take profit and Stop Loss editor on the panel for making trades"
          defaultChecked
        />
      </div>
    </div>
  );
};

export default TradingMenu;
