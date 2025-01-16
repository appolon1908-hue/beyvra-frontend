import { CalculatorIcon } from 'assets/icons'
import React from 'react'
import './tradeAnalyzer.scss'
import { useTranslation } from 'react-i18next'
const TradeAnalyzer = ({header, text, footer}: {header: string, text: string, footer: string}) => {
  const {t} = useTranslation()
  return (
    <div className='tradeAnalyzer'>
        <div className='iconWrapper'>
            <CalculatorIcon/>

        </div>
        <div className='textWrap'>
            <h3>{header}</h3>
            <p>{text}</p>
            <p className='footer'>{footer}</p>

        </div>
        
    </div>
  )
}

export default TradeAnalyzer