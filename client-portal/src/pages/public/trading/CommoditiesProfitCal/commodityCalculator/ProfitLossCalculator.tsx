import React from 'react'
import './commodityProfitCalculator.scss'
import CommCalc from '../../../../../assets/trading/goldCal.png'
import redDrop from '../../../../../assets/trading/red-droplet.png'
import goldImage from '../../../../../assets/trading/goldImage.png'
import { useTranslation } from 'react-i18next'


const ProfitLossCal = () => {
  const {t} = useTranslation()
  return (
    <div className='commodityProfitWrapper pl'>
       
     
        <div className='imageBackdrop'>
            <div>         
            <img src={goldImage} alt="background image" /> 
            <img src={redDrop} alt="" className='icon-2' />
            <img src={CommCalc} alt=""  className='plCal' />
            </div>
        </div>
        <div className='textWrapper'>
            <h3>{t("howCalP&LCom")}</h3>
            <p>{t("howCalP&LComTxt")}</p>
            <p>{t("howCalP&LComTxt2")}</p>
        </div>
    </div>
  )
}

export default ProfitLossCal