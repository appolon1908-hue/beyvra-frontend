import SearchBar from "../../../../../components/searchBar/SearchBar";
import {
  BinancePayIcon,
  CustomStrategiesIcon,
  DepositIcon3,
  HierarchyIcon2,
  MarketIcon2,
  ProfileIcon3,
  StatusIcon2,
  UsersIcon,
  VerificationIcon,
  WithdrawIcon3,
} from "../../../../../assets/icons";
import "./helpCenter.scss";
import { Dispatch, SetStateAction } from "react";
import { LeftSubDrawer } from "../../types";
import { useAppSelector } from "@store/hooks";

interface HelpCenterProps {
  setLeftSubDrawer: Dispatch<SetStateAction<LeftSubDrawer>>;
}

const HelpCenter: React.FunctionComponent<HelpCenterProps> = ({
  setLeftSubDrawer,
}) => {

  const {themeSelect} = useAppSelector(state => state.themeBg)

  return (
    <div className={`${themeSelect} helpCenter`}>
      <SearchBar
        className="helpCenterSearch"
        placeholder="Find the help you need"
      />
      <p className="helpSectionTitle">User Guide</p>
      <div className="helpCenterItems">
        <div
          className="HelpCenterItem"
          onClick={() => setLeftSubDrawer("trading-platform")}
        >
          <HierarchyIcon2 />
          <h2>Trading platform</h2>
        </div>
        <div className="HelpCenterItem">
          <ProfileIcon3 />
          <h2>Profile</h2>
        </div>
        <div className="HelpCenterItem">
          <UsersIcon />
          <h2>Account types</h2>
        </div>
        <div className="HelpCenterItem">
          <DepositIcon3 />
          <h2>Deposits</h2>
        </div>
        <div className="HelpCenterItem">
          <WithdrawIcon3 />
          <h2>Withdrawals</h2>
        </div>
        <div className="HelpCenterItem">
          <StatusIcon2 />
          <h2>Statuses</h2>
        </div>
        <div className="HelpCenterItem">
          <VerificationIcon />
          <h2>Verification</h2>
        </div>
        <div className="HelpCenterItem">
          <MarketIcon2 />
          <h2>Market and platform extensions</h2>
        </div>
        <div className="HelpCenterItem">
          <CustomStrategiesIcon />
          <h2>Custom strategies</h2>
        </div>
        <h3>Payment Methods</h3>
        <div className="HelpCenterItem">
          <BinancePayIcon />
          <h2>Binance Pay</h2>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
