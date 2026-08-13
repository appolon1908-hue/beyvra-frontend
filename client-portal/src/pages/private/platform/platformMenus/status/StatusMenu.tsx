import "./statusMenu.scss";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
  GreenSignalsIcon,
  OpenLockIcon,
  SignalsIcon,
  TimeLineElipse,
  TimeLineElipse2,
} from "../../../../../assets/icons";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import { Dispatch, SetStateAction, useState } from "react";
import { Typography } from "antd";
import { RightSubDrawerContent } from "../../types";
import { Link } from "react-router-dom";

interface StatusMenuProps {
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const StatusMenu: React.FunctionComponent<StatusMenuProps> = ({}) => {
  const [active, setActive] = useState(0);

  return (
    <div className="status">
      <VerticalTimeline animate={false} layout="1-column-left">
        <VerticalTimelineElement
          iconOnClick={() => setActive(0)}
          onTimelineElementClick={() => setActive(0)}
          iconClassName="timeLineElipseIcon1"
          icon={active === 0 ? <TimeLineElipse /> : <TimeLineElipse2 />}
          contentArrowStyle={{ border: "none" }}
          className={`elementBox box1 ${active === 0 ? "active" : ""}`}
        >
          <div className="boxMainDiv">
            <div className="BoxSubDiv">
              <SignalsIcon />
              Beginner
            </div>
            <div className="statusDiv">Your current status</div>
            <p>Default status with a basic set of accessible features</p>
          </div>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          iconOnClick={() => setActive(1)}
          onTimelineElementClick={() => setActive(1)}
          iconClassName="timeLineElipseIcon1"
          icon={active === 1 ? <TimeLineElipse /> : <TimeLineElipse2 />}
          contentArrowStyle={{ border: "none" }}
          className={`elementBox box2 ${active === 1 ? "active" : ""}`}
        >
          <div className="boxMainDiv">
            <div className="BoxSubDiv">
              <GreenSignalsIcon />
              Advanced
            </div>
            <div className="statusDiv">Pending to Unlock</div>
            <p>
              Access to exclusive platform features for traders who want
              to apply more diverse strategies
            </p>
            <PrimaryButton
              className="primebtn"
              Title="Deposit EUR €500"
              disabled
              icon={<OpenLockIcon />}
            />
          </div>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          iconOnClick={() => setActive(2)}
          onTimelineElementClick={() => setActive(2)}
          iconClassName="timeLineElipseIcon1"
          icon={active === 2 ? <TimeLineElipse /> : <TimeLineElipse2 />}
          contentArrowStyle={{ border: "none" }}
          className={`elementBox box3 ${active === 2 ? "active" : ""}`}
        >
          <div className="boxMainDiv">
            <div className="BoxSubDiv">
              <GreenSignalsIcon />
              Seasoned
            </div>
            <div className="statusDiv">Pending to Unlock</div>
            <p>
              The widest range of tools and features available, perfect for all
              kinds of complex and personalized trading styles
            </p>
            <PrimaryButton
              className="primebtn"
              Title="Deposit EUR €3000"
              disabled
              icon={<OpenLockIcon />}
            />
          </div>
        </VerticalTimelineElement>
      </VerticalTimeline>
      <Link to="/statusDetails">
        <Typography.Link className="knowmoore">
          Know more about Statuses
        </Typography.Link>
      </Link>
    </div>
  );
};

export default StatusMenu;
