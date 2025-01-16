import { Dispatch, ReactNode, SetStateAction } from "react";
import "./helpMenu.scss";
import { VideoIcon } from "../../../../../assets/icons";
import { LeftSubDrawer } from "../../types";
import { Col, Row } from "antd";
import { useAppSelector } from "@store/hooks";

interface HelpMenuProps {
  setLeftSubDrawer: Dispatch<SetStateAction<LeftSubDrawer>>;
  setIsLeftSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const HelpLink = ({
  icon,
  heading,
  text,
  onClick,
}: {
  icon: ReactNode;
  heading: string;
  text: string;
  onClick?: () => void;
}) => {

  const {themeSelect} = useAppSelector(state => state.themeBg)
  return (
    <div className={`${themeSelect} helpLnkContainer`} onClick={onClick}>
      <div className="icon">{icon}</div>
      <p className="helpHead">{heading}</p>
      <p className="helpTxt">{text}</p>
    </div>
  );
};

const HelpMenuList = [
  {
    id: 1,
    title: "Discover the Platform",
    time: "02:01",
    img: "/menu-images/svgs/ScholarHat.svg",
  },
  {
    id: 2,
    title: "Opening Trades",
    time: "02:46",
    img: "/menu-images/svgs/TradingSignalsSky.svg",
  },
  {
    id: 3,
    title: "Making Forecasts",
    time: "04:46",
    img: "/menu-images/svgs/SearchBigImage.svg",
  },
  {
    id: 4,
    title: "Deposit & Withdrawal",
    time: "04:46",
    img: "/menu-images/svgs/DollarSignSky.svg",
  },
];

const HelpMenu: React.FunctionComponent<HelpMenuProps> = ({
  setLeftSubDrawer,
  setIsLeftSubDrawerOpen,
}) => {
  const {themeSelect} = useAppSelector(state => state.themeBg)

  return (
    <div className={`${themeSelect} helpMenu`}>
      <div className="flexHelpLnks">
        <HelpLink
          icon={<img src="/menu-images/svgs/SupportMenuIcon.svg" />}
          heading="Support"
          text="We’re here for you 24/7"
          onClick={() => {
            setLeftSubDrawer("support");
            setIsLeftSubDrawerOpen(true);
          }}
        />
        <HelpLink
          icon={<img src="/menu-images/svgs/HelpCenterMenuIcon.svg" />}
          heading="Help Center"
          text="Get to know the platform"
          onClick={() => {
            setLeftSubDrawer("help-center");
            setIsLeftSubDrawerOpen(true);
          }}
        />
      </div>
      <div className="flexHelpLnks">
        <HelpLink
          icon={<img src="/menu-images/svgs/EducationMenuIcon.svg" />}
          heading="Education"
          text="Expand your knowledge"
          onClick={() => {
            setLeftSubDrawer("education-menu");
            setIsLeftSubDrawerOpen(true);
          }}
        />
        <HelpLink
          icon={<img src="/menu-images/svgs/TradingTutorialsIcon.svg" />}
          heading="Trading Tutorials"
          text="Learn how to open a trade"
          onClick={() => {
            setLeftSubDrawer("trading-tutorials");
            setIsLeftSubDrawerOpen(true);
          }}
        />
      </div>
      <div className="videosContainer">
        <h2 className="videoLessons">Video Lessons</h2>
        {HelpMenuList.map((item) => (
          <div key={item.id} className="videosItems">
            <Row className="videoItemRow">
              <Col span={14} className="videoItemCol1">
                <div className="videoItemHeader">
                  <VideoIcon /> {item.time}
                </div>
                <h2>{item.title}</h2>
              </Col>
              <Col span={10} className="videoItemImage">
                <img src={item.img} alt="" />
              </Col>
            </Row>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpMenu;
