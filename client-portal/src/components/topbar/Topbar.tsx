import { CSSProperties, useEffect, useState } from "react";

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
import { useCookies } from "react-cookie";
import { getApiUrl } from "utils/env";

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
  const [cookies] = useCookies(["access_token"]);
  const [demoWallet, setDemoWallet] = useState<{ available: string; reserved: string } | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [refillState, setRefillState] = useState<"idle" | "confirm" | "pending" | "success" | "error">("idle");
  const loadDemoWallet = async () => {
    if (!cookies.access_token) return;
    const response = await fetch(getApiUrl("v1/demo/wallet"), { headers: { Authorization: `Bearer ${cookies.access_token}` } });
    if (response.ok) setDemoWallet(await response.json());
  };
  useEffect(() => { void loadDemoWallet(); }, [cookies.access_token]);
  const refillDemo = async () => {
    if (!cookies.access_token) return;
    setRefillState("pending");
    const response = await fetch(getApiUrl("v1/demo/wallet/refill"), { method: "POST", headers: { Authorization: `Bearer ${cookies.access_token}`, "Idempotency-Key": crypto.randomUUID() } });
    if (response.ok) { await loadDemoWallet(); setRefillState("success"); window.setTimeout(() => setRefillState("idle"), 1800); }
    else setRefillState("error");
  };
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
          selectedWallet?.name ? (
            <>
              <div className="dem">
                <span>DEMO Account</span>
                <span className="demoBadge">DEMO</span>
                <CaretDownIcon />
              </div>
              <div className="amount">
                <p className="value">
                  ${Number(demoWallet?.available ?? selectedWallet?.balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <small>Virtual USD</small>
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
    </button>
    {accountOpen && <div className="demo-account-popover" role="dialog" aria-label="Demo account menu">
      <strong>DEMO Account</strong><span className="demoBadge">Virtual funds</span>
      <p>Available ${Number(demoWallet?.available ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      <p>Reserved ${Number(demoWallet?.reserved ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      <button type="button" onClick={() => setRefillState("confirm")} disabled={refillState === "pending"}>Refill Demo</button>
      <small>Practice funds have no monetary value.</small>
      {refillState === "confirm" && <div className="demo-refill-confirm"><p>Reset available virtual funds to $10,000? Trade history remains.</p><button type="button" onClick={() => void refillDemo()}>Refill Demo</button><button type="button" onClick={() => setRefillState("idle")}>Cancel</button></div>}
      {refillState === "pending" && <p role="status">Refilling…</p>}{refillState === "success" && <p role="status">Demo balance refilled.</p>}{refillState === "error" && <p role="alert">Refill unavailable. Try again later.</p>}
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
