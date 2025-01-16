import { Button } from "antd";
import "./TradingPlatform.scss";
import { ArrowRightIcon } from "../../../../../assets/icons";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";
import { Dispatch, SetStateAction } from "react";
import { LeftSubDrawer } from "../../types";

interface TradingPlatformProps {
  setLeftSubDrawer: Dispatch<SetStateAction<LeftSubDrawer>>;
}

const TradingPlatformList = [
  {
    id: 1,
    title: "About the Trading Platform",
    topics: 7,
    content: [
      {
        id: 1,
        content: "About the Trading Platform?",
      },
      {
        id: 2,
        content: "Why Should I Choose Tradx?",
      },
      {
        id: 3,
        content: "What is a time frame?",
      },
      {
        id: 4,
        content: "Do I Need to Install Any Trading Software on My PC?",
      },
      {
        id: 5,
        content: "Can I use robots when trading on the platform?",
      },
      {
        id: 6,
        content:
          "What Should I Do If a System Error Occurs When Loading the Platform?",
      },
      {
        id: 7,
        content: "The Platform Doesn’t Load",
      },
    ],
  },
  {
    id: 1,
    title: "Trades",
    topics: 3,
    content: [
      {
        id: 1,
        content: "About the Trading Platform?",
      },
      {
        id: 2,
        content: "Why Should I Choose Tradx?",
      },
      {
        id: 3,
        content: "What is a time frame?",
      },
      {
        id: 4,
        content: "Do I Need to Install Any Trading Software on My PC?",
      },
      {
        id: 5,
        content: "Can I use robots when trading on the platform?",
      },
      {
        id: 6,
        content:
          "What Should I Do If a System Error Occurs When Loading the Platform?",
      },
      {
        id: 7,
        content: "The Platform Doesn’t Load",
      },
    ],
  },
];

const TradingPlatform: React.FunctionComponent<TradingPlatformProps> = ({
  setLeftSubDrawer,
}) => {
  return (
    <div className="trading-platforms">
      <div className="buttonsContain">
        <Button className="btn" onClick={() => setLeftSubDrawer("help-center")}>
          Back to User Guide
        </Button>
        <Button className="link-button" type="link">
          Trading Platforms
        </Button>
      </div>
      {TradingPlatformList.map((item) => (
        <MainItemCard className="trading-platforms-about">
          <div className="about-info">
            <h3>{item.title}</h3>
            <p className="topics">{item.topics} Topics</p>
            <div className="about-info-content">
              {item.content.map((contentItem) => (
                <div key={contentItem.id} className="content">
                  <div className="content-icon">
                    <ArrowRightIcon color="#A2A2A2" width="14" height="14" />
                  </div>
                  <p className="text">{contentItem.content}</p>
                </div>
              ))}
            </div>
          </div>
        </MainItemCard>
      ))}

      <div
        className="olymp-trade"
        onClick={() => setLeftSubDrawer("what-is-trading")}
      >
        <ArrowRightIcon width="" height="" color="#0094FF" />
        <div>What is a Trading Platform?</div>
      </div>
    </div>
  );
};

export default TradingPlatform;
