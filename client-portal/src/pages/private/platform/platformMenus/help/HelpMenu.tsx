import { Dispatch, ReactNode, SetStateAction } from "react";
import "./helpMenu.scss";
import { LeftSubDrawer } from "../../types";
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
      <p className="helpMenuNote">Choose a support topic above. Walkthrough lessons are available from your account walkthrough.</p>
    </div>
  );
};

export default HelpMenu;
