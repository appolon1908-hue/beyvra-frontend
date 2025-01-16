import React from 'react'
import chartImg from "../../../../../../../assets/portfolio/circle-chart.png"
import { IndicatorGreen } from 'assets/icons'
import './card.scss'
const CardRegular = ({desc, amount, className, number, chart, indicator}: {desc: string , amount?: number, className?: string, number?: string, chart?: boolean, indicator?: boolean}) => {
  console.log(chart)
  return (
    <div className={`cardStat bg-gray-100/10 px-5 py-1.5 rounded flex items-center ${className}`}>

      <div className='flex-1'>
        <div className='flex items-center justify-between'>
        <p className='card-top text-sm text-white my-2 font-normal '>{desc}</p>
        {indicator && <p className='gain flex items-center gap-1'>1.2 <IndicatorGreen/></p>}

        </div>
       
          {amount  &&    <p className='card-bottom font-bold text-sm'>${amount}</p>}
          {number &&   <p className='card-bottom font-bold text-sm '>${number}</p>}

      </div>
      {chart && <img src={chartImg} alt="" /> }
       
        
        
    </div>
  )
}

export default CardRegular