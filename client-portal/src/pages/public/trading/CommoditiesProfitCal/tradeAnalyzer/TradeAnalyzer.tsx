import { CalculatorIcon } from 'assets/icons'
import React from 'react'
import './tradeAnalyzer.scss'
const TradeAnalyzer = () => {
  return (
    <div className='tradeAnalyzer'>
        <div className='iconWrapper'>
            <CalculatorIcon/>

        </div>
        <div className='textWrap'>
            <h3>P/L Calculation example</h3>
            <p>Assume that you have opened a LONG EUR/USD position of 1,000 volume for 1 day on 15th of March and closed your position on 16th of March. Your account currency is USD, while your opening price is 1.05516 and closing price is 1.05716.
      
            </p>
            <p className='footer'> Based on the provided information, your Profit & Loss will be calculated as follows: (Exit Price - Entry Price) + All fees & charges.</p>

        </div>
        
    </div>
  )
}

export default TradeAnalyzer