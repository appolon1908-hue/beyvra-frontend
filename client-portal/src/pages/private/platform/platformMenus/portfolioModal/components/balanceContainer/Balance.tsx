import React from 'react'
import CardRegular from '../cards/Cards'
interface balanceProps {
  totalTrade: number,
  revenue: number,
  totalBalance: number,
  totalWithdrawals: number,
  totalDeposits: number,
  monthlyCommission: number,
  indicator?: boolean,
  chart?: boolean

}
const Balance: React.FC<balanceProps> = ({totalBalance, totalTrade, totalWithdrawals, totalDeposits, monthlyCommission, indicator}) => {
  return (
    <div className='pt-3'>
      <h3 className='text-xl font-medium text-white/80'>Balance</h3>
      <div className='grid sm:grid-cols-3 gap-4'>
        <CardRegular 
        desc='Total trades'
        amount={235}
        />
         <CardRegular 
        desc='Revenue'
        amount={totalTrade}
        indicator={indicator}
        />

        <CardRegular 
          desc='Total Balance'
          amount={totalBalance}
          />


      </div>
      <div className='my-4 grid sm:grid-cols-3 gap-4'>
        <CardRegular 
        desc='Total amount of withdrawals'
        amount={totalWithdrawals}
        />
         <CardRegular 
        desc='Total amount of of deposits'
        amount={totalDeposits}
        />

        <CardRegular 
          desc='Commission for the month amounted to'
          amount={monthlyCommission}
          />


      </div>
    </div>
  )
}

export default Balance