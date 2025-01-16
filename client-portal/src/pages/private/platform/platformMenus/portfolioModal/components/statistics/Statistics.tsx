import React from 'react'
import CardRegular from '../cards/Cards'


interface statisticProp {
  numberTrades: number,
  pnl: number,
  winRate: number,
  chart?: boolean
}
const Statistics: React.FC<statisticProp> = ({chart, numberTrades, pnl, winRate}) => {
  return (
    <div className=''>
      <h3 className='text-xl font-medium'>Statistics</h3>
      <div className='grid sm:grid-cols-3 gap-4'>
        <CardRegular 
        desc='Number of trades'
        amount={numberTrades}
        />
         <CardRegular 
        desc='PNL'
        amount={pnl}
        />

        <CardRegular 
          desc='Win Rate'
          amount={winRate}
          chart={chart}
          />


      </div>
    </div>
  )
}

export default Statistics