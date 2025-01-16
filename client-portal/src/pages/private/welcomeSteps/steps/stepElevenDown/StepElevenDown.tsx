import React from 'react';
import './stepElevenDown.scss'
import TestWalkThrough from 'components/welcomeSteps/components/modal/TestWalkThrough';
import CustomMarkerOne from 'components/welcomeSteps/components/customMarkerOne/CustomMarkerOne';
import CustomMarkerTwo from 'components/welcomeSteps/components/customMarkerTwo/CustomMarkerTwo';
import MyButton from 'components/UI/buttons/MyButton';
import { useTranslation } from 'react-i18next';
interface StepElevenProps {
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    handleClick: any;
  }
const StepElevenDown:React.FC<StepElevenProps> = ({ 
    step,
    setStep
}) => {
  const { t } = useTranslation();

    const amounts = ["1.174", "1.172", "1.170", "1.168", "1.166", "1.164"];
    const times = ["17:52", "17:52:30", "17:53", "17:53:30", "17:54"];

    const handleClick = () => {
      setStep((prevStep: number) => prevStep + 1);
    };

  return (
    <div className="stepElevenDownContainer">

       <div className='stepElevenDownGraphContainer'>
        {/* flex right graph and number */}
        <div className='stepElevenRightFlexContainer'>
            <img src='welcome-icons/stepElevenDown.png' alt="" />
            {/* graph indicators */}
            

            <div className="customMarkerOneWalkThroughDown">
                   <CustomMarkerOne color='#B0452D'/>
                </div>
                <div className="customMarkerTwoWalkThroughDown">
                   <span>+$85%</span>
                </div>
                <div className="customMarkerThreeWalkThroughDown">
                   <CustomMarkerTwo/>
                </div>
            <div>

            </div>
            <div className="graphAmountContainer" >
              <div className="graphAmount">
                {amounts.map((item, index) => (
                  <span key={index + item}>{item}</span>
                ))}
              </div>
          </div>
       </div>
        {/* bottom time values */}
        <div className="stepElvenLeftFlexContainer">
        <div className="graphDurationContainer" >
              <div className="graphDuration">
                {times.map((item, index) => (
                  <span key={index + item}>{item}</span>
                ))}
              </div>
          </div>
        </div>
        </div>

        <div className="sideModalWrapper">

       <div className="stepElevenDownModalContainer">
              <TestWalkThrough setStep={setStep} step={step}/>
        </div>
        <div className="stepElevenmain_infoDown">
        <h2>{t("finishTradings")}</h2>
        <div className="stepElevenButtonDown">
          <MyButton text="Complete Training" handleClick={handleClick} />
        </div>
      </div>
          </div>
    </div>
  )
}

export default StepElevenDown
