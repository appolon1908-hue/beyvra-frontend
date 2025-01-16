import './landing.scss'
import HomeGraph from '../../../../../assets/home/homeGraph.png'
import TradingFunctionality from '../../../../../assets/home/tradeFunctionality.png'
import CustomMarker1 from '../Indicators/customMarker1/CustomMarker1'
import CustomMarker2 from '../Indicators/customMarker2/CustomMarker2'
import { useTranslation } from 'react-i18next'

const Landing = () => {
    const {t} = useTranslation()
    console.log(t);
  return (
    <div>
        <div className="landingHeaderTitle">
            <h2>{t("beTheMasterWithUs")}</h2>
            <span>{t("excelWithUs")}</span>
            <button>{t("startTrading")}</button>
        </div>
        <div className='bottomGraphImageContainer'>
            <div className='homeGraphContainer'>
                <img src={HomeGraph} alt="" />
                
                <div className='valueGraphIndicator'>
                    <span>+$80</span>
                </div>
                <div className='customMarker1Container'>
                <CustomMarker1/>
                </div>
                <div className='customMarker2Container'>
                    <CustomMarker2/>
                </div>
            </div>
            <div className='homeTradeFunctionality'>
                <img src={TradingFunctionality} alt="" />
            </div>
        </div>

    </div>
  )
}

export default Landing