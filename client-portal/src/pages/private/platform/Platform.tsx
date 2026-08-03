import { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Topbar from "../../../components/topbar/Topbar";
import "./platform.scss";
import { Drawer } from "antd";
import { ArrowLeftOS, CloseIcon } from "../../../assets/icons";

import useQueryParamHandler from "./hooks/useQueryParamHandler";
import {
  leftDarwerTitleHandler,
  leftDrawerBodyHandler,
  leftSubDrawerBodyHandler,
  leftSubDrawerTitleHandler,
  rightDrawerBodyHandler,
  rightDrawerTitleHandler,
  rightSubDrawerBodyHandler,
  rightSubDrawerExtraHandler,
  rightSubDrawerTitleHandler,
  windowBodyHandler,
} from "./utils";

import {
  CurrentDrawerType,
  LeftSubDrawer,
  RightDrawerContent,
  RightSubDrawerContent,
  WindowDrawer,
} from "./types";
import { setAppearanceBackground } from "../../lib/utils";
import { useAppSelector } from "@store/hooks";
import { useDispatch } from "react-redux";
import { setPortfolioWindow } from "@store/slices/app";
import PlatformChartContainer from "./PlatformChartContainer";
import useWebSocketTicket from "api/user/useWebSocketTicket";
import { setWSTicket } from "@store/slices/user";
import { useCookies } from "react-cookie";
import { usePlatformConfig } from "api/platform/usePlatformConfig";
import { stagingPlatformFeatures } from "config/platformFeatures";

interface PlatformProps { }

const Platform: React.FunctionComponent<PlatformProps> = () => {
  const [windowDrawer, setWindowDrawer] = useState<WindowDrawer>(null)
  const [isWindowDrawerOpen, setIsWindowDrawerOen] = useState<boolean>(true)

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLeftSubDrawerOpen, setIsLeftSubDrawerOpen] =
    useState<boolean>(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState<boolean>(false);
  const [rightDrawerContent, setIsRightDrawerContent] =
    useState<RightDrawerContent>(null);
  const [isRightSubDrawerOpen, setIsRightSubDrawerOpen] =
    useState<boolean>(false);
  const [rightSubDrawerContent, setIsRightSubDrawerContent] =
    useState<RightSubDrawerContent>(null);
  const [currentDrawer, setCurrentDrawer] = useState<CurrentDrawerType>(null);
  const [leftSubDrawer, setLeftSubDrawer] = useState<LeftSubDrawer>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [topbarHeight, setTopbarHeight] = useState(0);
  const [tradeFormHeight, setTradeFormHeight] = useState(0);
  const [mainSidebarWidth, setMainSidebarWidth] = useState(0);
  const [bottomSidebarHeight, setBottomSidebarHeight] = useState(0);
  const storedScale = localStorage.getItem("scale");
  const { togglePortfolioWindow } = useAppSelector(state => state.app)
  const [cookies] = useCookies(["access_token"]);
  const { data: platformFeatures = stagingPlatformFeatures } = usePlatformConfig();


  const dispatch = useDispatch();

  const { themeSelect } = useAppSelector(state => state.themeBg);

  useQueryParamHandler({
    setIsRightDrawerOpen,
    setIsRightDrawerContent,
    setIsRightSubDrawerOpen,
    setIsRightSubDrawerContent,
  });

  const { mutate: webSocketTicketMutate } = useWebSocketTicket({
    onSuccess: (data) => {
      if (data?.ws_ticket) {
        dispatch(setWSTicket(data?.ws_ticket));
      }
    },
  });
  useEffect(() => {
    if (cookies.access_token) {
      webSocketTicketMutate(cookies.access_token);
    }
  }, [cookies.access_token, webSocketTicketMutate]);

  useEffect(() => {
    const topbarElement = document.getElementById("topbarContainer");
    const tradeFormElement = document.getElementById("tradeForm");
    const mainSidebarElement = document.getElementById("main_sidebar");
    const bottomSidebarElement = document.getElementById("bottom_sidebar");

    if (topbarElement) {
      setTopbarHeight(topbarElement.clientHeight);
    }

    if (tradeFormElement && window.innerWidth <= 767) {
      setTradeFormHeight(tradeFormElement.clientHeight);
    }

    if (bottomSidebarElement && window.innerWidth <= 767) {
      setBottomSidebarHeight(bottomSidebarElement.clientHeight);
    }

    if (mainSidebarElement) {
      setMainSidebarWidth(mainSidebarElement.clientWidth);
    } else {
      setMainSidebarWidth(0);
    }
  }, [storedScale]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const storedImageId = localStorage.getItem("selectedBackgroundImage");
    if (storedImageId) {
      setAppearanceBackground(storedImageId);
    }
  }, []);

  const MainSidebar = ({ id }: { id?: string }) => {
    return (
      <Sidebar
        setIsDrawerOpen={setIsDrawerOpen}
        isDrawerOpen={isDrawerOpen}
        setIsLeftSubDrawerOpen={setIsLeftSubDrawerOpen}
        isLeftSubDrawerOpen={isLeftSubDrawerOpen}
        currentDrawer={currentDrawer}
        setCurrentDrawer={setCurrentDrawer}
        features={platformFeatures}
        id={id ? id : ""}
      />
    );
  };

  return (
    <div className="platformWrapper" data-theme={themeSelect}>
      {/* <CustomModal/> */}
      {windowWidth >= 768 ? (
        <MainSidebar id="main_sidebar" />

      ) : (
        <MainSidebar id="bottom_sidebar" />
      )}
      <Drawer
        title={leftDarwerTitleHandler(currentDrawer)}
        placement="left"
        onClose={() => {
          setIsDrawerOpen(false);
        }}
        open={isDrawerOpen}
        className={`${themeSelect} ml-106 leftMainDrawer`}
        style={{ marginLeft: `${mainSidebarWidth}px` }}
        closeIcon={<CloseIcon />}
        mask={false}
        width={
          windowWidth <= 768 ? `calc(100% - ${mainSidebarWidth}px)` : `20.25rem`
        }
      >
        <div>
          {leftDrawerBodyHandler(
            currentDrawer,
            setLeftSubDrawer,
            setIsLeftSubDrawerOpen,
            setIsDrawerOpen
          )}
        </div>
      </Drawer>
      <Drawer
        title={leftSubDrawerTitleHandler(leftSubDrawer)}
        extra={
          <div onClick={() => setIsLeftSubDrawerOpen(false)}>
            <ArrowLeftOS />
          </div>
        }
        placement="left"
        onClose={() => {
          setIsDrawerOpen(false);
          setIsLeftSubDrawerOpen(false);
        }}
        open={isLeftSubDrawerOpen}
        className={`ml-106 leftSubDrawer ${themeSelect}`}
        style={{ marginLeft: `${mainSidebarWidth}px` }}
        closeIcon={<CloseIcon />}
        mask={false}
        width={
          windowWidth <= 768 ? `calc(100% - ${mainSidebarWidth}px)` : `20.25rem`
        }
      >
        <div>{leftSubDrawerBodyHandler(leftSubDrawer, setLeftSubDrawer)}</div>
      </Drawer>


      {/* portfolio panel  */}

      <Drawer
        placement="left"
        onClose={() => {
          setIsDrawerOpen(false);
          setIsWindowDrawerOen(false)
          dispatch(setPortfolioWindow(false))
          console.log("trigger")
        }}
        open={togglePortfolioWindow}
        className={`${themeSelect} ml-106 windowDrawer`}
        style={{ marginLeft: `${mainSidebarWidth}px` }}
        closeIcon={<CloseIcon />}
        mask={false}
        width={`calc(100% - ${mainSidebarWidth}px)`}
      >
        <div className="">
          {windowBodyHandler(
            windowDrawer,
            setWindowDrawer,
            setIsLeftSubDrawerOpen,
            setIsDrawerOpen
          )}
        </div>
      </Drawer>

      <Drawer
        title={rightDrawerTitleHandler(rightDrawerContent)}
        placement="right"
        onClose={() => setIsRightDrawerOpen(false)}
        open={isRightDrawerOpen}
        closeIcon={<CloseIcon />}
        className={`${themeSelect} rightDrawer`}
        width={
          windowWidth <= 768
            ? `calc(100% - ${mainSidebarWidth}px)`
            : `20.25rem`
        }
      >
        {rightDrawerBodyHandler(
          rightDrawerContent,
          setIsRightSubDrawerOpen,
          setIsRightSubDrawerContent,
          setIsRightDrawerOpen,
        )}
      </Drawer>

      <Drawer
        title={rightSubDrawerTitleHandler(rightSubDrawerContent)}
        extra={rightSubDrawerExtraHandler(
          rightSubDrawerContent,
          setIsRightSubDrawerOpen,
          setIsRightSubDrawerContent
        )}
        placement="right"
        onClose={() => {
          setIsRightDrawerOpen(false);
          setIsRightSubDrawerOpen(false);
        }}
        open={isRightSubDrawerOpen}
        closeIcon={<CloseIcon />}
        className={`${themeSelect} rightDrawer rightSubDrawer`}
        maskClassName="rightSubDrawerMask"
        width={
          windowWidth <= 768
            ? `calc(100% - ${mainSidebarWidth}px)`
            : `20.25rem`
        }
      >
        {rightSubDrawerBodyHandler(
          rightSubDrawerContent,
          setIsRightSubDrawerOpen,
          setIsRightDrawerOpen,
          setIsRightSubDrawerContent,
          setIsRightDrawerContent
        )}

      </Drawer>

      <div className={isDrawerOpen ? "trade-section ml-378" : "trade-section"}>

        <Topbar
          style={{ marginLeft: `${mainSidebarWidth}px` }}
          isDrawerOpen={isDrawerOpen}
          setIsRightDrawerOpen={setIsRightDrawerOpen}
          setIsRightDrawerContent={setIsRightDrawerContent}
          setIsDrawerOpen={setIsDrawerOpen}
          setCurrentDrawer={setCurrentDrawer}
          currentDrawer={currentDrawer}
        />

        <PlatformChartContainer
          themeSelect={themeSelect}
          topbarHeight={topbarHeight}
          tradeFormHeight={tradeFormHeight}
          bottomSidebarHeight={bottomSidebarHeight}
        />
      </div>
    </div>
  );
};

export default Platform;
