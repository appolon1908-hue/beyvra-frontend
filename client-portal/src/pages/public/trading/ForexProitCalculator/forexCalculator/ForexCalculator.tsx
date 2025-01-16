import React from 'react'
import './forexCalculator.scss'
import Droplet from '../../../../../assets/trading/red-droplet.png'
import CornBg from '../../../../../assets/trading/corn_with-gray-bg (1).png'
import Calculator from '../../../../../assets/trading/adam-calculator.png'
const ForexCalculator = () => {
  return (
    <div className='forexCalculator'>
        <div className="background-graphic">
                   <div className='calculatorGraphic'>
            <img src={Calculator} alt="" className='main-image' />
            <img src={Droplet} alt="" className='droplet' />
            <img src={CornBg} alt="" className='cornBg' />
        </div>
        </div> 
        <div className='forexProfitText'>
            <h3>What is a Forex Profit Calculator?</h3>
            <p>A forex profit calculator is a tool used by forex traders to calculate the profit or loss from a particular trade. This calculator factors in a trader’s entry and exit price, the currency pair being traded, the number of units, the cost of spread and rollover, as well as any applicable commissions. It helps traders accurately calculate potential profits or losses in advance and understand the risks of the trade. Forex profit calculators also provide a helpful way to compare potential profits across different currency pairs, or to check the performance of a single currency pair over time.

markets.com offers a forex profit calculator right on the platform to help traders make more informed decisions as they trade.</p>
<p>markets.com offers a forex profit calculator right on the platform to help traders make more informed decisions as they trade.</p>

        </div>
    </div>
  )
}

export default ForexCalculator