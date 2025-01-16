import { Dispatch, SetStateAction } from "react";
import { InfoCircleIcon } from "../../../../../assets/icons";
import MainItemCard from "../../../../../components/mainItemCard/MainItemCard";
import "./verificationMenu.scss";
import { RightSubDrawerContent } from "../../types";
import PrimaryButton from "../../../../../components/primaryButton/PrimaryButton";
import { useAppSelector } from "@store/hooks";
import { useNavigate } from "react-router-dom";
import nonVerifiedCard from '../../../../../assets/portfolio/verify-status.png'

interface VerificationMenuProps {
  setIsRightSubDrawerOpen?: Dispatch<SetStateAction<boolean>>;
  setIsRightSubDrawerContent?: Dispatch<SetStateAction<RightSubDrawerContent>>;
}

const VerificationMenu: React.FunctionComponent<VerificationMenuProps> = ({
  setIsRightSubDrawerOpen,
  setIsRightSubDrawerContent,
}) => {
  const { themeSelect } = useAppSelector((state) => state.themeBg);
  const navigate = useNavigate();

  return (
    <div className={`${themeSelect} verificationsContainer max-w-3xl m-auto`}>
      <div className="verificationBadge">
        <img src="/menu-images/verification-img.png" />
      </div>
      {/* <div className="kycVerifyButton w-1/3 m-auto">
        <PrimaryButton
          onClick={() => {
            navigate("/kyc-document/?query=biodata-kyc");
          }}
          className="verificationLearnMore"
          Title="KYC Verification"
        />
      </div> */}

      {/* <MainItemCard pointer={false} className="verificationDetail" variant={2}>
        <p>
          Verification is a mandatory process for financial market participants.
          With its help, we're able to create a safe space for trading where
          you can be sure that your funds are secure.
        </p>
      </MainItemCard> */}
      {/* <div className="learnMoreButton w-1/3 m-auto">
        <PrimaryButton
          onClick={() => {
            if (setIsRightSubDrawerOpen) {
              setIsRightSubDrawerOpen(true);
            }
            if (setIsRightSubDrawerContent) {
              setIsRightSubDrawerContent("verification-helpcenter-menu");
            }
          }}
          className="verificationLearnMore"
          Title="Learn More"
        />
      </div> */}

       {/* <div className="m-auto w-max mt-10">

        <div>
          <h3 className="text-base">KYC Verification Status</h3>
          <h4 className="text-gray-400 font-semibold text-sm">User</h4>
          <p className="text-sm">Hdjendfwenfoijefhewfoihef843498_294yr87f</p>

        </div>
        <div className="mt-4">
          <p className="text-gray-500">Account number</p>
          <p className="font-normal">348765203845923745934059</p>
        </div>

        <div>
          <p className="text-gray-500">Current KYC status</p>
          <p className="text-green-500 text-sm">Verified</p>

          <div className="pt-3">
            <img src={nonVerifiedCard} alt="" className="bg-gray-8 p-3 rounded-xl h-14 w-14" />
          </div>


      </div>
      
      </div> */}
    </div>
  );
};

export default VerificationMenu;
