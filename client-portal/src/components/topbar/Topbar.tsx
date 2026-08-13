import { CSSProperties, useState } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { UserSliceState } from "@store/slices/user";
import ArrowsSlider from "../../components/arrowsSlider/ArrowsSlider";

import Loading from "components/loading";
import {
  CaretDownIcon,
  CloseIconsm,
  DropUpIcon,
  ProfileIcon,
} from "../../assets/icons";
import {
  CurrentDrawerType,
  RightDrawerContent,
} from "../../pages/private/platform/types";
import "./topbar.scss";
import { AssetPairSliceState, removeAssetPair } from "@store/slices/pairs";
import { CryptoSliceState } from "@store/slices/markets/types";
import AssetSelectionContainer from "components/assetSelectionContainer/AssetSelectionContainer";
import { ITradeAssets } from "@interfaces";
import DropdownMenu from "components/dropdownMenu/DropdownMenu";
import { Spin } from "antd";
import { useWorkspaceBootstrap } from "api/workspace/useWorkspaceBootstrap";

interface TopbarProps {
  isDrawerOpen: boolean;
  setIsRightDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRightDrawerContent: React.Dispatch<
    React.SetStateAction<RightDrawerContent>
  >;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDrawer: React.Dispatch<React.SetStateAction<CurrentDrawerType>>;
  currentDrawer: CurrentDrawerType;
  style?: CSSProperties;
}

const Topbar: React.FunctionComponent<TopbarProps> = ({
  isDrawerOpen,
  setIsRightDrawerOpen,
  setIsRightDrawerContent,
  setIsDrawerOpen,
  setCurrentDrawer,
  currentDrawer,
  style,
}) => {
  const { data: workspace } = useWorkspaceBootstrap();
  const demoWallet = workspace?.payload.wallet;
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, loading } = useAppSelector(
    (state: { user: UserSliceState }) => state.user
  );

  const { assetPairs } = useAppSelector(
    (state: { assetPair: AssetPairSliceState }) => state.assetPair

  )
  const dispatch = useAppDispatch()

  const { symbol, assets } = useAppSelector((state: { markets: CryptoSliceState }) => state.markets);

  const ProfileImage = () => {
    if (loading) {
      return <Loading size="small" />;
    }

    return user?.profile_picture ? (
      <img
        src={user.profile_picture}
        alt="profile-img"
        className="profile-img"
      />
    ) : (
      <ProfileIcon />
    );
  };

  const WalletsButton = () => (
    <div className="demo-account-control">
    <button
      type="button"
      aria-label="Choose account"
      className="demo"
      aria-expanded={accountOpen}
      onClick={() => setAccountOpen((open) => !open)}
    >
      {
        !loading ? (
            <>
              <div className="dem">
                <span>DEMO Account</span>
                <span className="demoBadge">DEMO</span>
                <CaretDownIcon />
              </div>
              <div className="amount">
                <p className="value">
                  ${Number(demoWallet?.available ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <small>Virtual USD</small>
              </div>
            </>
        ) :
          (
            <Spin />
          )
      }
    </button>
    {accountOpen && <div className="demo-account-popover" role="dialog" aria-label="Demo account menu">
      <strong>DEMO Account</strong><span className="demoBadge">Virtual funds</span>
      <p>Available ${Number(demoWallet?.available ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      <p>Reserved ${Number(demoWallet?.reserved ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      <small>Practice funds have no monetary value.</small>
    </div>}
    </div>
  );

  return (
    <div className="topbarContainer" id="topbarContainer" style={style}>

      <div className="conversionDiv">
        <AssetSelectionContainer />
      </div>

      <div className="payProfileTab" id="top_right">
        <WalletsButton />
        <div className="profileButtons">
          <button
            aria-label="Open profile"
            className="dropup-icon"
            onClick={() => {
              setIsRightDrawerOpen(true);
              setIsRightDrawerContent("profile");
            }}
          >
            <DropUpIcon />
          </button>
          <button
            aria-label="Open profile"
            className="profile"
            onClick={() => {
              setIsRightDrawerOpen(true);
              setIsRightDrawerContent("profile");
            }}
          >
            <ProfileImage />
          </button>
        </div>


      </div>

      <div className="payProfileTab payProfileTabMobile">
        <div className="profileButtons">
          <button
            aria-label="Open profile"
            className="profile"
            onClick={() => {
              setIsRightDrawerOpen(true);
              setIsRightDrawerContent("profile");
            }}
          >
            <ProfileImage />
          </button>
        </div>
        <WalletsButton />
      </div>
    </div>
  );
};

export default Topbar;
