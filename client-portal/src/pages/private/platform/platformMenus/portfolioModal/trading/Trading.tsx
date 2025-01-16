import React, { useEffect, useState } from 'react'
import Statistics from '../components/statistics/Statistics'
import Balance from '../components/balanceContainer/Balance'
import ActiveRequest from '../components/activeRequets/ActiveRequest'
import { useAppSelector } from '@store/hooks'
import { useCookies } from 'react-cookie'
import useUserStat from 'api/user/useStatistics'
import { IUserStat } from '@interfaces'


const Trading = () => {
  const {user} = useAppSelector(state => state.user)
  const [userStat, setUserStat] = useState<IUserStat>()

  const [cookies] = useCookies(["access_token"])

  const {mutate} = useUserStat({
      onSuccess: (data) => {
        console.log(data)
        setUserStat(data)

      },
      onError: () => {

      }
  })

  useEffect(()=>{
      mutate(
          cookies.access_token,

      )

  }, [])
  return (
    <div className='h-full bg-[#1d1d1f] p-8 rounded-xl overflow-y-auto'>
        <Statistics
        numberTrades={userStat?.total_trades ?? 0}
        pnl={773000}
        winRate={60}
        chart={true}
        
        />
        <Balance
        totalTrade={userStat?.total_traded_amount ?? 0}
        revenue={1352}
        totalBalance={userStat?.balance || 0}
        totalWithdrawals={userStat?.total_withdrawal_amount ?? 0}
        totalDeposits={userStat?.total_deposit_amount || 0}
        monthlyCommission={15000}
        indicator={true}

        />
        <ActiveRequest 
          requests={userStat?.pending_transactions ?? []}
        />
        
    </div>
  )
}

export default Trading