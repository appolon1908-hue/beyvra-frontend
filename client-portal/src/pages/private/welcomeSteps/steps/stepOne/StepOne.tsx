import MyButton from "components/UI/buttons/MyButton";
import "./StepOne.scss";
import welcomeIcon from '/walkthrough-modal/welcome-modal.png';
import { useTranslation, withTranslation } from "react-i18next";
import { FC } from "react";

interface StepOneProps {
  setStep: (step: number | ((prevStep: number) => number)) => void;
}

const StepOne: FC<StepOneProps> = ({ setStep }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    setStep((prevStep: number) => prevStep + 1);
  };

  return (
    <div className="stepOneContainer welcome-steps-bg flex justify-end flex-col">
      <div className="stepOneHeader w-[273px] md:w-full  xl:w-[904px] max-w-[904px] mx-auto">
        <img src={welcomeIcon} className="w-[184px] md:w-auto mx-auto object-cover" />
        <h2 className="text-white text-[21px] md:text-[27px] text-center font-bold">{t("welcome")}</h2>
        <p className="text-[18px] md:text-[21px] text-center text-white mt-3.5 max-w-[400px] justify-self-center">{t("walkthroughWelcomeSubText")}</p>
        <div className="stepOneButton mt-9 mb-12 md:mb-16 lg:mb-16 mx-auto max-w-[182px] md:max-w-[360px]">
          <MyButton text="startTraining" handleClick={handleClick} />
        </div>
      </div>
    </div>
  );
};

export default  withTranslation()(StepOne);
