import React from 'react'
import Leaflet from '../../../../../assets/trading/leaflet.png'
import BgImage from '../../../../../assets/trading/dark-arrow.png'
import UkIFlag from '../../../../../assets/trading/UKUS_Oil_2_48e9f9e285.svg fill.png'
import './marginCall.scss'
import { CheckIcon2 } from 'assets/icons'
import { useTranslation } from 'react-i18next'
const MarginCall = () => {
  const {t} = useTranslation()
  return (
    <div className='marginCallWrapper'>
    
       
       <div className='imageBackdrop'>
           <div>         
            <img src={BgImage} alt="background image" /> 
            <img src={UkIFlag} alt="" className='icon-2' />
            <img src={Leaflet} alt="" className='icon-1' />

       

           </div>
       </div>
       <div className='textWrapper'>
          <h3>{t("whatIsMarginCall")}</h3>
           <ul>

            <li><div className='checkBg'><CheckIcon2/></div>  <p>{t("defineMarginCall")}</p></li>
            <li><div className='checkBg'><CheckIcon2/></div> <p>{t("defineMarginCall2")}</p></li>
            <li><div className='checkBg'><CheckIcon2/></div> <p>{t("defineMarginCall3")}</p></li>
           </ul>

       </div>   
 
   </div>
  )
}

export default MarginCall