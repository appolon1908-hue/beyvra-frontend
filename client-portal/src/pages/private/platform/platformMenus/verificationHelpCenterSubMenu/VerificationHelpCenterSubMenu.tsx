import { Button } from "antd";
import { ArrowRightIcon } from "../../../../../assets/icons";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";
import "./VerificationHelpCenterSubMenu.scss";
import { Dispatch, SetStateAction } from "react";
import { RightSubDrawerContent } from "../../types";

interface VerificationHelpCenterSubMenuProps {
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const VerificationHelpCenterSubMenu: React.FunctionComponent<
  VerificationHelpCenterSubMenuProps
> = ({ setIsRightSubDrawerContent }) => {
  return (
    <div className="verification-platforms-what">
      <div className="buttonCont">
        <Button
          onClick={() => {
            setIsRightSubDrawerContent("verification-helpcenter-menu");
          }}
          className="btn"
        >
          Back
        </Button>
      </div>
      <MainItemCard className="trading-platforms-about">
        <div className="about-info">
          <h3>What is Verification?</h3>
          <div className="about-info-content">
            <div className="content">
              <p className="text">
                Financial services regulators require brokers to verify their
                clients. Verification helps to ensure that the trader is of
                legal age, acts as an owner of the Tradx account and that the
                funds in the account are legal.
                <br />
                <br />
                Traders provide personal information for verification including
                ID, selfie, payment method details, and documents confirming the
                source of funds.
                <br />
                <br />
                This data is stored following strict security requirements and
                is only used for verification purposes.
              </p>
            </div>
          </div>
        </div>
      </MainItemCard>

      <div className="olymp-trade">
        <ArrowRightIcon width="20" height="20" color="#0094FF" />
        <div>Voluntary and Mandatory Verification</div>
      </div>
    </div>
  );
};

export default VerificationHelpCenterSubMenu;
