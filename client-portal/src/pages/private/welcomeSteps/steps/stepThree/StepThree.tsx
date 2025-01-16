import MyButton from "components/UI/buttons/MyButton";
import "./StepThree.scss";
import { useTranslation } from "react-i18next";
import { FC } from "react";
import { AreaChart } from "pages/private/platform/MainChart/AreaChart";
import SecondStepIcon from '/public/chart.gif'

interface StepThreeProps {
  setStep: (step: number | ((prevStep: number) => number)) => void;
  step: number;
  chartData: any;
}

const StepThree: FC<StepThreeProps> = ({ setStep, step, chartData }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    setStep((prevStep: number) => prevStep + 1);
  };

  return (
    <div className="welcomeStepThree overflow-hidden relative">

      <div className="absolute h-full w-full top-0 left-0 z-20" >
        <img src={SecondStepIcon} className="h-[100vh]"/>
      </div>

      <AreaChart chartData={chartData} liveLoading time={2000} />
    

      <div className="mt-6 lg:mt-[179px] w-[95%] md:w-full  step-three-content xl:w-[904px] max-w-[904px] mx-auto  z-[20] absolute">
        <h2 className="text-[18px] md:text-[21px] text-center text-white mt-3.5 max-w-[750px] justify-self-center ">{t("walkthroughChartsSubText")}</h2>
        <div className="mt-9 mb-12 md:mb-16 lg:mb-16 mx-auto max-w-[182px] md:max-w-[360px]">
          <MyButton text="next" handleClick={handleClick} />
        </div>
      </div>
      
    </div>
  );
};

export default StepThree;

