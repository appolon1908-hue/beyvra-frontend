import { Dispatch, SetStateAction } from "react";
import { ArrowRightOS, InfoCircleIconWhite } from "../../../../../assets/icons";
import MagicBoxCard from "../../../../../components/MagicBoxCard/MagicBoxCard";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";

import "./inviteFriends.scss";
import { RightSubDrawerContent } from "../../types";

interface InviteFriendsProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const InviteFriends: React.FunctionComponent<InviteFriendsProps> = ({
  setIsRightSubDrawerOpen,
  setIsRightSubDrawerContent,
}) => {
  const openDepositHandler = () => {
    setIsRightSubDrawerOpen(true);
    setIsRightSubDrawerContent("get-rewards-deposit");
  };

  const magicBoxAction = () => {
    setIsRightSubDrawerOpen(true);
    setIsRightSubDrawerContent("mega-box-rewards");
  };

  return (
    <div>
      <div style={{ top: "2.1rem", right: "3rem" }} className="headerExtraIcon">
        <InfoCircleIconWhite />
      </div>
      <div className="InviteFriendsCon">
        <p className="getyourreferaltext">
          Get your referal link in just a few steps
        </p>
        <MainItemCard
          className="step1Card"
          variant={1}
          onClick={openDepositHandler}
        >
          <div className="textRow">
            <p className="titletext">Step 1 – Deposit</p>
            <p className="subtext">Deposit money to a live account</p>
          </div>
          <div className="rightIconDiv">
            <ArrowRightOS width="22" height="22" />
          </div>
        </MainItemCard>
        <div className="card">
          <MainItemCard className="step2Card" variant={1}>
            <div className="textRow">
              <p className="titletext" style={{ color: "#969798" }}>
                Step 2 – Trade
              </p>
              <p className="subtext">
                Make a fixed time trade using a live account
              </p>
            </div>
          </MainItemCard>
        </div>
        <MagicBoxCard
          boxImage="/menu-images/squared-3d-treasure-box.png"
          btnAction={magicBoxAction}
        />
      </div>
    </div>
  );
};

export default InviteFriends;
