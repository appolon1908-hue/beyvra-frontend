import {
  EventsIcon,
  HelpIcon,
  LogoIcon,
  MarketIcon,
  NewsIcon,
  Portfolio,
  TradesIcon,
} from "../../assets/icons";
import "./sidebar.scss";
import { Spin } from "antd";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setPortfolioWindow } from "@store/slices/app";
import { CurrentDrawerType } from "pages/private/platform/types";

type DrawerType =
  | "trades"
  | "market"
  | "events"
  | "help"
  | "news"
  | "assets"
  | "portfolio"
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
  const { togglePortfolioWindow } = useAppSelector(state => state.app)
  const onlineTraders = useAppSelector(state => state.socketStockCrypto.onlinetraders)
  const dispatch = useAppDispatch()
  const onSelect = (activeDrawer: CurrentDrawerType) => {
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
          aria-label="Events"
          onClick={() => onSelect("events")}
          className={isDrawerOpen && currentDrawer === "events" ? "active" : ""}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 16 }}
        >
          <div className="icon flex justify-center whiteIcons">
            <EventsIcon />
          </div>
          <p className="text">Events</p>
        </button>

        <button
          aria-label="Portfolio"
          onClick={() => handlePortfolioNavigation("portfolio")}
          className={isDrawerOpen && currentDrawer === "events" ? "active" : ""}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 16 }}
        >
          <div className="icon flex justify-center whiteIcons">
            <Portfolio />
          </div>
          <p className="text">Portfolio</p>
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
        <button
          aria-label="News"
          onClick={() => onSelect("news")}
          className={isDrawerOpen && currentDrawer === "news" ? "active" : ""}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 16 }}
        >
          <div className="icon flex justify-center whiteIcons">
            <NewsIcon />
          </div>
          <p className="text">News</p>
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
