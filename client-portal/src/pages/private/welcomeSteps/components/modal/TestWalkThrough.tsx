import { Tooltip } from "antd";
import "./testWalkThrough.scss";
import {
 
  ArrowDownRightIconColor,
  ArrowUpRightIconColor,
  PlusIcon,
  SubtractIcon,
} from "assets/icons";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface FormData {
  duration: number;
  amount: number;
  minimumBidAmount: number;
  maximumBidAmount: number;
  minimumBidDuration: number;
  maximumBidDuration: number;
}

interface TestWalkThroughProps {
  step: number;
  setStep: Function;
  setTrade: Function
  trade?: string;
  formInactive?: boolean;
  bidDuration: number;
  bidAmount: number;
  setBidDuration: Function;
  setBidAmount: Function;
}


const TestWalkThrough: FC<TestWalkThroughProps> = ({ 
  step, 
  setStep, 
  trade, 
  setTrade, 
  formInactive= false,
  bidAmount, 
  bidDuration, 
  setBidAmount, 
  setBidDuration
 }) => {
  const { t } = useTranslation();
  const [tradeForm, setFormData] = useState<FormData>({
    duration: bidDuration,
    amount: bidAmount,
    minimumBidAmount: 50,
    maximumBidAmount: 120,
    minimumBidDuration: 5,
    maximumBidDuration: 10,
  });
  const [formDisabled, setFormDisabled] = useState(false);

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const {
    duration,
    amount, 
    minimumBidAmount,
    maximumBidAmount,
    minimumBidDuration,
    maximumBidDuration
  }: any = tradeForm;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setFormDisabled(formInactive)
  }, [formInactive]);

  const getWidthStyle = () => {
    return windowWidth < 834 && step >= 7 ? "topLeft" : "left";
  };

  const getWidthDownStyle = () => {
    return windowWidth < 834 && step >= 7 ? "bottomLeft" : "left";
  };

  const handleBidAmountChange = (addition = true) => {
    let newAmount = amount;
    if((newAmount > minimumBidAmount) && (!addition)){
      newAmount = newAmount - 10;
    }
    if((newAmount < maximumBidAmount) && (addition)){
      newAmount = newAmount + 10;
    }
    setFormData(
     {
      ...tradeForm,
      amount: newAmount
    });
    setBidAmount(newAmount);

    if(step <= 7){
      setStep((prevStep: number) => prevStep + 1);
    }
  };

  const handleOnInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(
      {
       ...tradeForm,
       [name]: Number(value)
    });
    if(name === "amount")  setBidAmount(Number(value));
    else setBidDuration(Number(value));
    
  };
  
  const handleBidDurationChange = (addition = true) => {
    let newDuration = duration;
    if((newDuration > minimumBidDuration) && (!addition)){
      newDuration = newDuration - 1;
    }
    if((newDuration < maximumBidDuration) && (addition)){
      newDuration = newDuration + 1;
    }
    setFormData(
     {
      ...tradeForm,
      duration: newDuration
    });
    setBidDuration(newDuration);
    if(step <= 8){
      setStep((prevStep: number) => prevStep + 1);
    }
  };

  const handleTradeButtonClick = (type= "up") => {
    setTrade(type);
    setTimeout(() => {
      setStep();
    }, 100);  
  };

  useEffect(( )=> {
   
    setFormData({
      ...tradeForm,
      amount: bidAmount,
      duration: bidDuration
    })
  }, [])
  return (
      <div className="walkThroughSidebarContainer">
        <div className="walkThroughTopBarInputs">

        <div className="amountInputContainer">
          <Tooltip
              rootClassName="walkthroughTooltip amountTooltip"
              placement={getWidthStyle()}
              title={t("trainingInvestmentMoneyTooltip")}
              color="#28bd66"
              open={step == 7}
              >
              <div
                className="walkthroughInputContent"
                // style={{ backgroundColor: "#283645" }}
              >
                <label htmlFor="amount" className="text-[#ffffff66]">{t('amount')} , $</label>
                <input
                  type="number"
                  value={tradeForm.amount}
                  disabled={formDisabled}
                  name="amount"
                  onChange={handleOnInputChange}
                  />
              </div>
          </Tooltip>
              <div className="walkThroughButtonsContainer">
              <div className="walkThroughButtons">
                <button
                  onClick={() => handleBidAmountChange(false)}
                  disabled = {step < 7 || formDisabled || amount <= minimumBidAmount }
                  className={`flex justify-center negative`}
                >
                  <SubtractIcon />
                </button>
              </div>

              <div className="walkThroughButtons">
                <button
                  disabled = {step < 7 || formDisabled || amount >= maximumBidAmount }
                  className="flex justify-center positive"
                  onClick={() => handleBidAmountChange(true)}
                >
                  <PlusIcon />
                </button>
              </div>
              </div>
        </div>

        <div className="durationInputContainer">
        <Tooltip
              rootClassName="walkthroughTooltip amountTooltip"
              placement={getWidthStyle()}
              title={t("trainingInvestmentTimeTooltip")}
              color="#28bd66"
              open={step == 8}
              >
              <div className="walkthroughInputContent">
                <label htmlFor="duration">{t("duration")}</label>
                <input 
                  type="number" 
                  name="duration"
                  disabled={formDisabled}
                  onChange={handleOnInputChange} 
                  value={`${tradeForm.duration}`} 
                />
              </div>
            </Tooltip>
            <div className="walkThroughButtonsContainer">
              <div className="walkThroughButtons">
                <button
                  disabled = {step < 8 || formDisabled || duration <= minimumBidDuration}
                  className="flex justify-center negative"
                  onClick={() => handleBidDurationChange(false)}
                >
                  <SubtractIcon />
                </button>
              </div>

              <div className="walkThroughButtons">
                <button
                  onClick={() => handleBidDurationChange()}
                  className="flex justify-center positive"
                  disabled = {step < 8 || formDisabled || duration >= maximumBidDuration}
                >
                  <PlusIcon />
                </button>
              </div>
            </div>

        </div>
        </div>
        
     <div className="bottomButtonNDownContainer">


  <div className="walkThroughSidbarUpDown">
      <div className="walkThroughupNdown">
    <Tooltip
      rootClassName="walkthroughTooltip amountTooltip"
      placement={getWidthDownStyle()}
      title={ <span style={{ color: "#000" }}> {t("trainingInvestmentButtonTooltip")} </span>}
      color="#28bd66"
      
      open={step == 9}
    >
        <button
          disabled={step < 9 || formDisabled}
          className={`up ${step >= 9 || formDisabled ? "up-enabled" : ""}`}
          onClick={()=>{handleTradeButtonClick('up')}}
         
        >
          <div className="walkThroughupNdownTitle">
            <h2 className="font-semibold text-lg md:text-2xl">{t("up")}</h2>
            <span className="font-semibold text-sm md:text-lg">+82%</span>
          </div>

          <div className="walkThroughBUttonIcon">
            <ArrowUpRightIconColor
              color={
                step !== 9 && step !== 10 && step !== 11
                  ? " #ffffff5e"
                  : " #ffffff"
                }
            />
          </div>
        </button>
    </Tooltip>
      </div>
    <div className="walkThroughupNdown">
      <button
        disabled={step < 9 || formDisabled}
        className={`down ${step >= 9 || formDisabled ? "down-enabled" : ""}`}

        onClick={()=>{handleTradeButtonClick('down')}}
      >
        <div className="walkThroughupNdownTitle">
          <h2 className="font-semibold text-lg md:text-2xl">{t("down")}</h2>
          <span className="font-semibold text-sm md:text-lg">+82%</span>
        </div>

        <div className="walkThroughBUttonIcon">
          <ArrowDownRightIconColor
            color={
              step !== 9 && step !== 10 && step !== 11
              ? " #ffffff5e"
                : " #ffffff"
              }
              />
        </div>
      </button>
    </div>
    </div>
</div>

      </div>
  );
};

export default TestWalkThrough;