import "./StepSeven.scss";
import { FC } from "react";
import TestWalkThrough from "../../components/modal/TestWalkThrough";
import { AreaChart } from "pages/private/platform/MainChart/AreaChart";
import { useTranslation } from "react-i18next";
interface StepSevenProps {
  setStep: (step: number | ((prevStep: number) => number)) => void;
  step: number;
  setTrade?: (trade: string | ((prevTrade: string) => string)) => void;
  trade?: string;
  chartData: any;
  bidDuration: number;
  bidAmount: number;
  setBidDuration: Function;
  setBidAmount: Function;
}

const StepSeven: FC<StepSevenProps> = ({ 
  step, 
  setStep,
  trade,
  setTrade, 
  chartData,
  bidAmount, 
  bidDuration, 
  setBidAmount, 
  setBidDuration
}) => {
 
  const { t } = useTranslation();
  return (
    <div className="">

       <div className=" overflow-hidden relative ">
        <div className="grid grid-cols-8 gap-4 items-center">
          <div className="col-span-8 sm:col-span-8 lg:col-span-6">
            <AreaChart chartData={chartData} />
          </div>
          <div className="modal flex justify-end col-span-8 sm:col-span-8 lg:col-span-2">
            <div className="lg:max-w-[315px] w-full  px-5">
              <TestWalkThrough 
                setStep={setStep} 
                step={step} 
                trade={trade} 
                setTrade={setTrade} 
                bidAmount={bidAmount}
                bidDuration={bidDuration}
                setBidAmount={setBidAmount}
                setBidDuration={setBidDuration}
              />
            </div>
          </div>
        </div>
      
    </div>
    </div>
  );
};

export default StepSeven;
