import { CSSProperties } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { UserSliceState } from "@store/slices/user";
import { WalletSliceState } from "@store/slices/wallet";
import ArrowsSlider from "../../components/arrowsSlider/ArrowsSlider";

import Loading from "components/loading";
import {
  CaretDownIcon,
  CloseIconsm,
  DropUpIcon,
  ProfileIcon,
  WalletIcon,
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
import { formatMoney } from "utils/utils";
import { Spin } from "antd";

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
  const { user, loading } = useAppSelector(
    (state: { user: UserSliceState }) => state.user
  );

  const { selectedWallet } = useAppSelector(
    (state: { wallet: WalletSliceState }) => state.wallet
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
    <div
      className="demo"
      onClick={() => {
        setIsRightDrawerOpen(true);
        setIsRightDrawerContent("account");
      }}
    >
      {
        !loading ? (
          selectedWallet?.name ? (
            <>
              <div className="dem">
                <span style={{ textTransform: 'capitalize' }}>{selectedWallet?.name || "Demo Account"}</span>
                <CaretDownIcon />
              </div>
              <div className="amount">
                <p className="value">
                  {selectedWallet?.currency?.symbol || "D"}{" "}
                  {formatMoney(selectedWallet?.balance) || "9,999.00"}
                </p>
              </div>
            </>
          ) : (
            <h1 style={{ color: 'white' }}>No Account</h1>
          )
        ) :
          (
            <Spin />
          )
      }
    </div>
  );

  return (
    <div className="topbarContainer" id="topbarContainer" style={style}>

      <div className="conversionDiv">
        <AssetSelectionContainer />
      </div>

      <div className="payProfileTab" id="top_right">
        <WalletsButton />
        <button
          onClick={() => {
            setIsRightDrawerOpen(true);
            setIsRightDrawerContent("payments");
          }}
          className="payments"
        >
          Payments
        </button>
        
        <div className="profileButtons">
          <button
            className="dropup-icon"
            onClick={() => {
              setIsRightDrawerOpen(true);
              setIsRightDrawerContent("profile");
            }}
          >
            <DropUpIcon />
          </button>
          <button
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
        <button
          onClick={() => {
            setIsRightDrawerOpen(true);
            setIsRightDrawerContent("payments");
          }}
          className="profile"
        >
          <WalletIcon />
        </button>
      </div>
    </div>
  );
};

export default Topbar;
