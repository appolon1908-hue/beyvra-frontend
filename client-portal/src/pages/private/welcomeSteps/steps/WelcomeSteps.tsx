import { useEffect, useReducer, useState } from "react";
import "./WelcomeSteps.scss";
import { useCookies } from "react-cookie";
import StepTwo from "./stepTwo/StepTwo.tsx";
import StepThree from "./stepThree/StepThree.tsx";
import StepFour from "./stepFour/StepFour.tsx";
import StepFive from "./stepFive/StepFive.tsx";
import StepSix from "./stepSix/StepSix.tsx";
import StepSeven from "./stepSeven/StepSeven.tsx";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@store/hooks.ts";
import useUpdateUser from "api/user/useUpdateUser.ts";
import { setUser } from "@store/slices/user/index.ts";
import WelcomeHeader from "../components/welcomeHeader/WelcomeHeader.tsx";
import StepTen from "./stepTen/StepTen.tsx";
import StepOne from './stepOne/StepOne.tsx';
import LastStep from "./lastStep/LastStep.tsx";
import { initialAreaData } from "pages/private/platform/MainChart/areaData.ts";
import { useNavigate } from "react-router-dom";

const WelcomeSteps = () => {
  const { t } = useTranslation();
  const [trade, setTrade] = useState('down');
  const [step, setWelcomeStep] = useState(1);
  const [duration, setDuration] = useState(30);
  const [amount, setAmount] = useState(90);
  const [tradeOngoing, setTradeOngoing] = useState(false);
  const [areaChartInitialData, setAreaChartInitialData ] = useState(initialAreaData);
  const [cookies, setCookie] = useCookies(["step", "access_token"]);
  const navigate =  useNavigate();

  const dispatch = useAppDispatch();

  const { mutate } = useUpdateUser({
    onSuccess: (data) => {
      dispatch(setUser(data));
    },
  });
  const setStep = () => {
   let newStep = step + 1;
    setWelcomeStep(newStep);
    if(newStep === 10){
      setTradeOngoing(true);
    }
  };

  const editBidDuration = (bidDuration: number) => {
    setDuration(bidDuration);
  };

  const editBidAmount = (bidAmount: number) => {
      setAmount(bidAmount);
  };


  const onSkipWalkthrough = () => {
    mutate({
      data: {
        is_walkthrough_completed: true,
      },
      token: cookies.access_token,
    });
    navigate('/platform');
   
  //  setWelcomeStep(0);
  };

  const onReset = (resetStep = 1) => {
    setWelcomeStep(resetStep);
  };

  useEffect(() => {
    const savedStep = cookies.step;
    if (savedStep) {
      setWelcomeStep(Number(savedStep));
    }
  }, []);

  useEffect(() => {
    setCookie("step", step.toString(), { path: "/", maxAge: 604800 });
  }, [step, setCookie]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepOne setStep={setStep} />;
      case 2:
        return <StepTwo setStep={setStep} />;
      case 3:
        return <StepThree setStep={setStep} step={step} chartData={areaChartInitialData} />;
      case 4:
        return <StepFour setStep={setStep} step={step} chartData={areaChartInitialData}  />;
      case 5:
        return <StepFive setStep={setStep} step={step} chartData={areaChartInitialData} />;
      case 6:
        return <StepSix setStep={setStep} step={step}  chartData={areaChartInitialData} />;
      case 7:
        return (
          <StepSeven 
            setStep={setStep} 
            step={step} 
            chartData={areaChartInitialData} 
            bidDuration={duration}
            setBidDuration = {editBidDuration}
            bidAmount = {amount}
            setBidAmount = {editBidAmount}
          />
        );
      case 8:
        return (
          <StepSeven 
            setStep={setStep} 
            step={step} 
            chartData={areaChartInitialData} 
            formInactive={tradeOngoing}
            bidDuration={duration}
            setBidDuration = {editBidDuration}
            bidAmount = {amount}
            setBidAmount = {editBidAmount}
          />
        );
      case 9:
        return (
          <StepSeven 
            setStep={setStep} 
            step={step} 
            trade={trade} 
            setTrade={setTrade} 
            formInactive={tradeOngoing}
            chartData={areaChartInitialData} 
            bidDuration={duration}
            setBidDuration = {editBidDuration}
            bidAmount = {amount}
            setBidAmount = {editBidAmount}
          />
        );
      case 10:
        return  (
          <StepTen 
            setStep={setStep} 
            step={step} 
            chartData={areaChartInitialData} 
            trade={trade} 
            setTrade={setTrade} 
            formInactive={tradeOngoing}
            bidDuration={duration}
            setBidDuration = {editBidDuration}
            bidAmount = {amount}
            setBidAmount = {editBidAmount}
          />
        );
      case 11:
         return (
            <StepTen 
              setStep={setStep} 
              handleClick={onSkipWalkthrough} 
              step={step} 
              chartData={areaChartInitialData} 
              trade={trade} 
              formInactive={tradeOngoing}
              bidDuration={duration}
              setBidDuration = {editBidDuration}
              bidAmount = {amount}
              setBidAmount = {editBidAmount}
            />
        );
       
        
      case 12:
        return <LastStep onReset={() => onReset()} />;
      default:
        return <StepOne setStep={setStep} />;
    }
  };


  return (
    <div className="welcomeSteps relative">
       <WelcomeHeader step={step} setStep={setStep} onSkipWalkthrough={onSkipWalkthrough} />
        <div className="content relative">
          {renderStep()}
        </div>
    </div>
  );

};

export default WelcomeSteps;
