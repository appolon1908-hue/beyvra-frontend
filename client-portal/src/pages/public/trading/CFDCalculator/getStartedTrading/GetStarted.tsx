import { useTranslation } from 'react-i18next'
import BgImage from '../../../../../assets/trading/getStartedImage.png'

import './getStarted.scss'
import { CheckIcon2 } from 'assets/icons'
const GetStarted = () => {
  const {t} = useTranslation()
  return (
         <div className='getStartedWrapper'>
            <div className='imageBackdrop'>
              <div>         
                <img src={BgImage} alt="background image" /> 
              </div>
            </div>
            <div className='textWrapper'>
              <h3> {t("HowTogetStarted")}</h3>
              <p>{t("getStartedNote")}.</p>
              <ul>

                <li><div className='checkBg'><CheckIcon2/></div>  <p>{t("getStartedList1")}</p></li>
                <li><div className='checkBg'><CheckIcon2/></div> <p>{t("getStartedList2")}</p></li>
                <li><div className='checkBg'><CheckIcon2/></div> <p>{t("getStartedList3")}</p></li>
              </ul>

       </div>
   </div>
  )
}

export default GetStarted