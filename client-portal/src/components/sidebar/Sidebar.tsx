import {
  HelpIcon,
  LogoIcon,
  MarketIcon,
  NewsIcon,
  TradesIcon,
} from "../../assets/icons";
import "./sidebar.scss";
import { Spin } from "antd";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setPortfolioWindow } from "@store/slices/app";
import { CurrentDrawerType } from "pages/private/platform/types";
import { PlatformFeatureFlags } from "config/platformFeatures";
import { usePlatformOverlay } from "pages/private/platform/PlatformOverlayContext";
import { useNavigate } from "react-router-dom";

type DrawerType =
  | "trades"
  | "market"
  | "events"
  | "help"
  | "news"
  | "assets"
  | "ai"
  | null;

interface SidebarProps {
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDrawerOpen: boolean;
  setIsLeftSubDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLeftSubDrawerOpen: boolean;
  id?: string;
  currentDrawer: DrawerType;
  setCurrentDrawer: React.Dispatch<React.SetStateAction<CurrentDrawerType>>;
  features?: PlatformFeatureFlags;
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({
  setIsDrawerOpen,
  isDrawerOpen,
  setIsLeftSubDrawerOpen,
  isLeftSubDrawerOpen,
  currentDrawer,
  setCurrentDrawer,
  id,
}) => {
  const navigate = useNavigate();
  const { togglePortfolioWindow } = useAppSelector(state => state.app)
  const onlineTraders = useAppSelector(state => state.socketStockCrypto.onlinetraders)
  const dispatch = useAppDispatch()
  const { openOverlay, closeOverlay } = usePlatformOverlay();
  const onSelect = (activeDrawer: CurrentDrawerType) => {
    if (activeDrawer === "market" || activeDrawer === "assets") openOverlay("market");
    else closeOverlay();
    if (isLeftSubDrawerOpen) {
      setIsLeftSubDrawerOpen(false);
    }
    setIsDrawerOpen(!(isDrawerOpen && currentDrawer === activeDrawer));
    if (togglePortfolioWindow) {
      dispatch(setPortfolioWindow(false))
      // setIsDrawerOpen(false)
    }
    setCurrentDrawer(activeDrawer);
  };
  const handlePortfolioNavigation = (activeDrawer: string) => {
    if (isLeftSubDrawerOpen || isDrawerOpen) {
      setIsLeftSubDrawerOpen(false);
      dispatch(setPortfolioWindow(true));
      setIsDrawerOpen(false)


    } else if (togglePortfolioWindow) {
      dispatch(setPortfolioWindow(false));

    }
    else {
      dispatch(setPortfolioWindow(true));
    }
    // dispatch(setPortfolioWindow(true));
    // setModalOpen(false)
    // setIsRightSubDrawerOpen(false)
    // setIsRightDrawerOpen(false)
    // setCurrentDrawer(activeDrawer);


  }



  return (
    <div className="sidebar" id={id ? id : ""}>
      
      <div className="logo">
          <a href="/platform"> <LogoIcon /></a>
        </div>
      
      <div className="top">
        
        <button
          aria-label="Trades"
          onClick={() => onSelect("trades")}
          className={isDrawerOpen && currentDrawer === "trades" ? "active" : ""}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 16 }}
        >
          <div className="icon flex justify-center whiteIcons">
            <TradesIcon />
          </div>
          <p className="text">Trades</p>
        </button>

        <button
          aria-label="InZone"
          onClick={() => navigate("/platform/inzone")}
          className=""
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 16 }}
        >
          <div className="icon flex justify-center whiteIcons">
            <NewsIcon />
          </div>
          <p className="text">InZone</p>
        </button>

        <button
          aria-label="Rewards"
          onClick={() => navigate("/platform/rewards")}
          className=""
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 16 }}
        >
          <div className="icon flex justify-center whiteIcons">
            <NewsIcon />
          </div>
          <p className="text">Rewards</p>
        </button>

        <button
          aria-label="Market"
          onClick={() => onSelect("market")}
          className={isDrawerOpen && currentDrawer === "market" ? "active" : ""}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 16 }}
        >
          <div className="icon flex justify-center whiteIcons">
            <MarketIcon />
          </div>
          <p className="text">Market</p>
        </button>

        <button
          aria-label="Help"
          onClick={() => onSelect("help")}
          className={isDrawerOpen && currentDrawer === "help" ? "active" : ""}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 16 }}
        >
          <div className="icon flex justify-center whiteIcons">
            <HelpIcon />
          </div>
          <p className="text">Help</p>
        </button>
      </div>
      <div className="bottom">
        <div className="online">
          {
            onlineTraders ? (
              <p className="numberOnline">{onlineTraders || 'loading'}</p>

            ) : (
              <Spin />
            )
          }
          <p className="onl">Online</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
