import { Dispatch, SetStateAction } from "react";
import {
  ArrowRightOS,
  EventIcon,
  HistoryIcon,
} from "../../../../../assets/icons";
import "./eventsMenu.scss";
import { LeftSubDrawer } from "../../types";
import { useAppSelector } from "@store/hooks";

interface EventsMenuProps {
  setLeftSubDrawer: Dispatch<SetStateAction<LeftSubDrawer>>;
  setIsLeftSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const EventsMenu: React.FunctionComponent<EventsMenuProps> = ({
  setLeftSubDrawer,
  setIsLeftSubDrawerOpen,
}) => {
  const {themeSelect} = useAppSelector(state => state.themeBg)
  return (
    <div className={themeSelect}>
      <div className="eventHistoryIcon" onClick={() => {}}>
        <HistoryIcon />
      </div>
      <div className="eventsContainer">
        <div className="eventsTagLineCon">
          <p className="eventsTagLine">
            Get your referal link in just a few steps
          </p>
        </div>
        <div
          onClick={() => {
            setLeftSubDrawer("event-join-leagues");
            setIsLeftSubDrawerOpen(true);
          }}
          className="leaguesContainer"
        >
          <div className="Leagues">
            <h2>Leagues</h2>
            <p>Join now</p>
          </div>
          <div className="coinsContainer">
            <img src="/menu-images/svgs/ThreeCoins.svg" alt="" />
          </div>
        </div>
        <div
          onClick={() => {
            setLeftSubDrawer("events-signals-club");
            setIsLeftSubDrawerOpen(true);
          }}
          className="eventMainItemCard"
        >
          <div className="eventMainItemRow">
            <div>
              <EventIcon />
              <div className="eventMainItemTextDiv">
                <p className="happeningNowText">HAPPENING NOW</p>
                <p className="secondText">Exclusive Trading Signals Club</p>
                <div className="thirdTextRow">
                  <p className="endsText">Ends on</p>
                  <p className="dateText">February 26</p>
                </div>
              </div>
            </div>
            <div className="rightIconDiv">
              <ArrowRightOS width="22" height="22" />
            </div>
          </div>
          <div className="imagesDiv">
            <img
              className="lines"
              src="/menu-images/svgs/EventsLines.svg"
              alt=""
            />
            <img
              className="teamImage"
              src="/menu-images/svgs/EventsMenuImage.svg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsMenu;
