import { SuccessIcon } from "../../../../../assets/icons";
import { Typography } from "antd";

import "./PasswordSuccess.scss";
import { Dispatch, SetStateAction } from "react";
import { RightSubDrawerContent } from "../../types";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";

interface PasswordSuccessProps {
  setIsRightSubDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const PasswordSuccess: React.FunctionComponent<PasswordSuccessProps> = ({
  setIsRightSubDrawerContent,
}) => {
  return (
    <div className="password-success">
      <SuccessIcon width="40" height="40" />
      <Typography.Title className="success-message">
        Your Password has been modified!
      </Typography.Title>
      <div className="button">
        <PrimaryButton
          className="changePwButton"
          onClick={() => {
            console.log("settings");
            setIsRightSubDrawerContent("settings");
          }}
          Title="Done"
        />
      </div>
    </div>
  );
};

export default PasswordSuccess;
