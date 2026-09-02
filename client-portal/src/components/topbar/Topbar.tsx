import { CSSProperties, useState } from "react";
import { useAppSelector } from "@store/hooks";
import { UserSliceState } from "@store/slices/user";
import Loading from "components/loading";
import { CaretDownIcon, DropUpIcon, ProfileIcon } from "../../assets/icons";
import { CurrentDrawerType, RightDrawerContent } from "../../pages/private/platform/types";
import "./topbar.scss";
import AssetSelectionContainer from "components/assetSelectionContainer/AssetSelectionContainer";
import { Spin } from "antd";
import { useWorkspaceBootstrap } from "api/workspace/useWorkspaceBootstrap";

interface TopbarProps {
  isDrawerOpen: boolean;
  setIsRightDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRightDrawerContent: React.Dispatch<React.SetStateAction<RightDrawerContent>>;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentDrawer: React.Dispatch<React.SetStateAction<CurrentDrawerType>>;
  currentDrawer: CurrentDrawerType;
  style?: CSSProperties;
}

const Topbar: React.FunctionComponent<TopbarProps> = ({
  setIsRightDrawerOpen,
  setIsRightDrawerContent,
  style,
}) => {
  const { data: workspace } = useWorkspaceBootstrap();
  const demoWallet = workspace?.payload.wallet;
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, loading } = useAppSelector(
    (state: { user: UserSliceState }) => state.user,
  );

  const ProfileImage = () => {
    if (loading) return <Loading size="small" />;

    return user?.profile_picture ? (
      <img
        src={user.profile_picture}
        alt="User profile"
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
        aria-label="Choose demo account"
        className="demo"
        aria-expanded={accountOpen}
        onClick={() => setAccountOpen((open) => !open)}
      >
        {!loading ? (
          <>
            <div className="dem">
              <span>DEMO Account</span>
              <span className="demoBadge">DEMO</span>
              <CaretDownIcon />
            </div>
            <div className="amount">
              <p className="value">
                ${Number(demoWallet?.available ?? 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <small>Virtual USD</small>
            </div>
          </>
        ) : (
          <Spin />
        )}
      </button>
      {accountOpen && (
        <div className="demo-account-popover" role="dialog" aria-label="Demo account menu">
          <strong>DEMO Account</strong>
          <span className="demoBadge">Virtual funds</span>
          <p>
            Available ${Number(demoWallet?.available ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <p>
            Reserved ${Number(demoWallet?.reserved ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
          <small>Practice funds have no monetary value.</small>
        </div>
      )}
    </div>
  );

  const openProfile = () => {
    setIsRightDrawerOpen(true);
    setIsRightDrawerContent("profile");
  };

  return (
    <div className="topbarContainer" id="topbarContainer" style={style}>
      <div className="hz-platform-identity" aria-label="Beyvra platform domain">
        <span className="hz-platform-identity__name">Beyvra</span>
        <span className="hz-platform-identity__domain">platform.beyvra.com</span>
      </div>

      <div className="conversionDiv">
        <AssetSelectionContainer />
      </div>

      <div className="payProfileTab" id="top_right">
        <WalletsButton />
        <div className="profileButtons">
          <button aria-label="Open profile" className="dropup-icon" onClick={openProfile}>
            <DropUpIcon />
          </button>
          <button aria-label="Open profile" className="profile" onClick={openProfile}>
            <ProfileImage />
          </button>
        </div>
      </div>

      <div className="payProfileTab payProfileTabMobile">
        <div className="profileButtons">
          <button aria-label="Open profile" className="profile" onClick={openProfile}>
            <ProfileImage />
          </button>
        </div>
        <WalletsButton />
      </div>
    </div>
  );
};

export default Topbar;
