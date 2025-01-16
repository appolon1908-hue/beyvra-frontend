import React from 'react'
import './straightForwardTrading.scss'
import backdropImg from "../../../../../assets/trading/straightforwardTradingImg.png"
import { useTranslation } from 'react-i18next'

const StraightForwardTrading = () => {
  const { t } = useTranslation()
  return (
    <div>
        
        <div className='tradingWrapper straightForwardWrap'>
          <div className='textWrapper'>
            <h3>{t("straightForward")}</h3>
            <p>
              {t("staightForwardText")}
               </p>
          </div>
          <div className='backdropImage'>
            <img src={backdropImg} alt="working man image" className='mainImg' />
           </div>
        </div>
    </div>
  )
}

export default StraightForwardTrading