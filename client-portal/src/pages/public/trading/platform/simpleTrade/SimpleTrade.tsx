import React from 'react'
import { CheckIcon2 } from 'assets/icons'
import graphBg from '../../../../../assets/trading/graph-bg.png'
import candleSTick from '../../../../../assets/trading/candleStickBg.png'
import perc from '../../../../../assets/trading/90perc.png'
import './simpleTrade.scss'
import { useTranslation } from 'react-i18next'
const SimpleTrade = () => {
  const {t} = useTranslation()
  return (
    <div className='simpleTrade'>
        <div className='imagery'>
        <img src={candleSTick} alt="candle stick" className='bg-1' />
        <img src={graphBg} alt="candle stick" className='bg-2'/>
        <img src={perc} alt='percentage' className='bg-3'/>
        <h2></h2>
    </div>
       
        <div className='simpleTradeTextList'>
            <h3>{t("simpleTrading")}</h3>
            <ul>
                <li><span><CheckIcon2/></span> <p>{t("simpleTrading1")}</p></li>
                <li> <span><CheckIcon2/></span><p>{t("simpleTrading2")}</p></li>
                <li><span><CheckIcon2/></span><p>{t("simpleTrading3")}</p></li>
                <li><span><CheckIcon2/></span><p>{t("simpleTrading4")}</p></li>
            </ul>
        </div>
        
    </div>
  )
}

export default SimpleTrade