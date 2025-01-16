import { Typography } from "antd";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";
import { ArrowRightIcon } from "../../../../../assets/icons";
import "./VerificationHelpCenterMenu.scss";
import { Dispatch, SetStateAction } from "react";
import { RightSubDrawerContent } from "../../types";

const TradingPlatformList = [
  {
    id: 1,
    title: "General Information",
    topics: 7,
    content: [
      {
        id: 1,
        content: "What is Verification?",
      },
      {
        id: 2,
        content: "Voluntary and Mandatory Verification",
      },
      {
        id: 3,
        content: "Verification Timeframe",
      },
      {
        id: 4,
        content: "Re-Verification",
      },
    ],
  },
  {
    id: 2,
    title: "Verification Steps",
    topics: 7,
    content: [
      {
        id: 1,
        content: "General List of Documents",
      },
      {
        id: 2,
        content: "ID",
      },
      {
        id: 3,
        content: "3D Selfie",
      },
      {
        id: 4,
        content: "Residence Verification",
      },
      {
        id: 5,
        content: "Payment Method Verification",
      },
    ],
  },
  {
    id: 3,
    title: "Potential Challenges",
    topics: 7,
    content: [
      {
        id: 1,
        content: "The bank card is blocked",
      },
      {
        id: 2,
        content: "The bank card is not personalized",
      },
      {
        id: 3,
        content: "The bank card or e-wallet belongs to someone else",
      },
    ],
  },
];

interface VerificationHelpCenterMenuProps {
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const VerificationHelpCenterMenu: React.FunctionComponent<
  VerificationHelpCenterMenuProps
> = ({ setIsRightSubDrawerContent }) => {
  return (
    <div className="verification-platforms">
      {TradingPlatformList.map((item) => (
        <MainItemCard variant={1} className="trading-platforms-about">
          <div className="about-info">
            <Typography.Link className="h3">{item.title}</Typography.Link>
            <p className="topics">{item.topics} Topics</p>
            <div className="about-info-content">
              {item.content.map((contentItem) => (
                <div key={contentItem.id} className="content">
                  <div className="content-icon">
                    <ArrowRightIcon color="#A2A2A2" width="14" height="14" />
                  </div>
                  <p
                    onClick={() => {
                      setIsRightSubDrawerContent(
                        "verification-helpcenter-sub-menu"
                      );
                    }}
                    className="text"
                  >
                    {contentItem.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </MainItemCard>
      ))}
    </div>
  );
};

export default VerificationHelpCenterMenu;
