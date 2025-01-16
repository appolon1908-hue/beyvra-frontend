import React from 'react'
import CardRegular from '../cards/Cards'

const CapitalInformation = () => {
  return (
    <>

    <div>
      <p className='text-gray-100 py-2'>
        Capital Information
      </p>

    </div>
    <div className='grid sm:grid-cols-3 gap-[2%] gap-y-3 '>
        <CardRegular
        desc={`Capital Committed`}
        amount={250000}        
        />
         <CardRegular
        desc={`Capital Committed`}
        amount={250000}        
        />
         <CardRegular
        desc={`Capital Committed`}
        amount={250000}        
        />
         <CardRegular
        desc={`Capital Committed`}
        amount={250000}        
        />
    </div>
    </>

  )
}

export default CapitalInformation