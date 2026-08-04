import {
  AiIcon,
  EventsIcon,
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

type DrawerType =
  | "trades"
  | "market"
  | "events"
  | "help"
  | "news"
  | "ai"
  | "assets"
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
    } else {
      setIsDrawerOpen(
        isDrawerOpen && currentDrawer === activeDrawer ? false : true
      );
    }
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
      console.log("set  false")


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
    <div className="sidebar" id={id ? id : ""} style={{ zIndex: '900' }}>
      <div className="top">
        
        <button
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
          onClick={() => onSelect("events")}
          className={isDrawerOpen && currentDrawer === "events" ? "active" : ""}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 16, marginBottom: '1.9rem' }}
        >
          <div className="icon flex justify-center whiteIcons">
            <EventsIcon />
          </div>
          <p className="text">Events</p>
        </button>
        <button
          onClick={() => onSelect("help")}
          className={isDrawerOpen && currentDrawer === "help" ? "active" : ""}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 16, marginBottom: '1.9rem' }}
        >
          <div className="icon flex justify-center whiteIcons">
            <HelpIcon />
          </div>
          <p className="text">Help</p>
        </button>
        <button
          onClick={() => onSelect("news")}
          className={isDrawerOpen && currentDrawer === "news" ? "active" : ""}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 16, marginBottom: '2.3rem' }}
        >
          <div className="icon flex justify-center whiteIcons">
            <NewsIcon />
          </div>
          <p className="text">News</p>
        </button>
        <button
          onClick={() => onSelect("ai")}
          className={isDrawerOpen && currentDrawer === "ai" ? "active" : ""}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 16 }}
        >
          <div className="icon flex justify-center whiteIcons">
            <AiIcon />
          </div>
          <p className="text">AI</p>
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
