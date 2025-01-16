import MyButton from "components/UI/buttons/MyButton";
import "./StepTwo.scss";
import { useTranslation } from "react-i18next";
import { FC, useEffect } from "react";
import data from "./data.json";

import SecondStepIcon from '/public/welcome-icons/welcome_step_two_background.png'

interface StepTwoProps {
  setStep: (step: number | ((prevStep: number) => number)) => void;
}

const StepTwo: FC<StepTwoProps> = ({ setStep }) => {
  const { t } = useTranslation();

  const handleClick = () => {
    setStep((prevStep: number) => prevStep + 1);
  };
  
  const getFirstStep = () => {
    const newArr = [...data?.assets];
    return newArr.slice(0,15);
  };

  const getSecondStep = () => {
    const newArr = [...data?.assets];
    return newArr.slice(15,30);
  };
  const getThirdStep = () => {
    const newArr = [...data?.assets];
    return newArr.slice(30,45);
  };

  const addAnimation = () => {
    const scrollers = document.querySelectorAll(".scroller");
    scrollers.forEach((scroller) => {
      scroller.setAttribute("data-animated", true);
      const scrollerInner = scroller.querySelector(".scroller__inner");
      const scrollerContent = Array.from(scrollerInner.children);
  
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        duplicatedItem.setAttribute("aria-hidden", true);
        scrollerInner.appendChild(duplicatedItem);
      });
    });
  }
  useEffect(() => {
    addAnimation();
  }, [

  ]);

  return (
    <div className="relative h-full flex justify-end flex-col">
      <div className="absolute h-full overflow-hidden top-[-12%] bg-[#2D3138]" >
        
      </div>
      <div className="relative overflow-y-auto mt-6">
        <div className="scroller" data-speed="fast">
          <div className="tag-list scroller__inner">
          {getFirstStep().map((item, index) => (
            <div className="stepTwoItemCard  md:min-w-fit flex items-center gap-x-3.5" key={index + item.name}>
                <div className="w-[35px] h-[35px] bg-[#2D3138] rounded-full flex items-center justify-center ">
                  <img className="w-[24px] h-[24px]" src={item.image} alt="" /> 
                </div>
                <h6 className="font-medium text-base md:text-[18px] lg:text-[24.593px] text-nowrap text-white">{item.name}</h6>
            </div>
          ))}
          </div>
        </div>

        <div className="scroller" data-direction="right" data-speed="slow">
          <div className="scroller__inner">
            {getSecondStep().map((item, index) => (
              <div className="stepTwoItemCard md:min-w-fit flex items-center gap-x-3.5" key={index + item.name}>
                  <div className="w-[35px] h-[35px] bg-[#2D3138] rounded-full flex items-center justify-center ">
                    <img className="w-[24px] h-[24px]" src={item.image} alt="" /> 
                  </div>
                <h6 className="font-medium text-base md:text-[18px] lg:text-[24.593px] text-nowrap text-white">{item.name}</h6>
              </div>
            ))}
          </div>
        </div>

        <div className="scroller" data-direction="left" data-speed="slow">
          <div className="scroller__inner">
            {getThirdStep().map((item, index) => (
              <div className="stepTwoItemCard md:min-w-fit flex items-center gap-x-3.5" key={index + item.name}>
                  <div className="w-[35px] h-[35px] bg-[#2D3138] rounded-full flex items-center justify-center ">
                    <img className="w-[24px] h-[24px]" src={item.image} alt="" /> 
                  </div>
                <h6 className="font-medium text-base md:text-[18px] lg:text-[24.593px] text-nowrap text-white">{item.name}</h6>
              </div>
            ))}
          </div>
        </div>
        
        
      
        <div className="mt-6  w-[95%] md:w-full  xl:w-[904px] max-w-[904px] mx-auto">
          <h2 className="text-[18px] md:text-[21px] text-center text-white mt-3.5 max-w-[750px] justify-self-center">{t("walkthroughStocksSubText")}</h2>
          <div className="mt-9 mb-12 md:mb-16 lg:mb-16 mx-auto max-w-[182px] md:max-w-[360px]">
            <MyButton text="next" handleClick={handleClick} />
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default StepTwo;