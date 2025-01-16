import { FC } from "react";
import "./WelcomeHeader.scss";
import { useTranslation } from "react-i18next";
import MyButton from "components/UI/buttons/MyButton";
import euroUsFlag from 'assets/icons/welcomeIcons/euro-us-flag.svg';
import LanguageSelectorDropDown from "components/LanguageSelectorDropDown/LanguageSelectorDropDown";

interface WelcomeHeaderProps {
  step: number;
  setStep: (step: number | ((prevStep: number) => number)) => void;
  onSkipWalkthrough: Function;
}

const STEPS_VALUE = 11;

const WelcomeHeader: FC<WelcomeHeaderProps> = ({ step, setStep, onSkipWalkthrough }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    setStep((prevStep: number) => prevStep + 1);
  };

  return (
    <div className="absolute z-[100] w-full">
      <div className="welcomeHeader">
        {step === 1 && (
          <div className="image">
            
          </div>
        )}
        {step >= 3 && step !== 6 && (
          // <div className="header_left_opacity">
          //   <div className="header_image">
          //     <img src={euroUsFlag} />
          //   </div>
          //   <h2>EUR/USD</h2>
          //   {step >= 7 && <div className="percent_text">82%</div>}
          // </div>
          <div className="header_left">
          <div className="flex gap-x-2.5 items-center">
            <div className="header_image ">
              <img src={euroUsFlag} />
            </div>
            <h2>EUR/USD</h2>
          </div>
          {step >= 7 &&<span className="percent_text text-sm font-semibold" >82%</span>}
        </div>
        )}

        {step === 6 && (
          <div className="relative">
            <div className="header_left">
              <div className="flex gap-x-2.5 items-center">
                <div className="header_image ">
                  <img src={euroUsFlag} />
                </div>
                <h2>EUR/USD</h2>
              </div>
              <span className="percent_text text-sm font-semibold" >82%</span>
            </div>
            <div className="relative mt-3">
              <div className="info_block absolute">
                  <div className="triangle">
                    <img src="/welcome-icons/triangle_little.svg" alt="" />
                  </div>
                  <h2 className="text-[18px] md:text-[21px]">{t("toolTipContent")}</h2>
                  <MyButton
                    color={"#172331"}
                    background={"#FFFFFF"}
                    text={"understand"}
                    handleClick={handleClick}
                  />
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-x-4 items-center">
          <LanguageSelectorDropDown />
          <div className="header_right">
            <h2>
              {step <= STEPS_VALUE ? step : STEPS_VALUE}/{STEPS_VALUE}
            </h2>
            <div className="line"></div>
            <div className="close_img cursor-pointer" onClick={() => onSkipWalkthrough()}>
              <img src="welcome-icons/close_grey.svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
