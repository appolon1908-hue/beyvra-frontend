import React from 'react'
import './activeRequest.scss'
import { NoList } from 'assets/icons'
const ActiveRequest = ({requests}: {requests: any[]}) => {
  console.log(requests?.length)
  return (
    <div className='activeRequest '>
        <h3 className='mb-3'>Active Request</h3>



        <ul className='overflow-x-auto'>

            {requests?.length > 0 ? requests?.map((item: any) => (
                <li className='text-white grid grid-cols-4 bg-[#0F1A2B99] py-2.5 px-8 rounded-lg mb-3'> 
                <span className='text-xs'>{item?.created_at}</span>
                <span className='text-xs'>{item?.type == "WITHDRAWAL" ? "Withdrawing funds" : "Depositing funds" } </span>
                <span className='text-xs'>{item?.amount}</span>
                <span className='text-xs text-[#FFB800]'>{item?.status == "PENDING" ? "in Processing" : "success"}</span>

                </li>
            )) : <li className='text-center py-6 '>

              <span className='text-center block w-max m-auto'>
                <NoList/>
              </span>

                <p className='text-center'>No transactions</p>

              </li>}
                  
        </ul>
    </div>
  )
}

export default ActiveRequest